import fs from 'node:fs/promises';
import path from 'node:path';

import dotenv from 'dotenv';

import {
  ACCEPTANCE_CHECKLIST_NAME,
  buildAcceptanceChecklistItems,
  buildTrelloCardDescription,
  extractSyncedCardId,
  parseLocalSeoBacklog,
  parseTrelloBoardSpec,
  type TrelloBacklogCard,
} from '../src/lib/trello-backlog';

dotenv.config();

type TrelloList = { id: string; name: string };
type TrelloLabel = { id: string; name: string | null };
type TrelloCheckItem = { id: string; name: string; pos?: number; state?: 'complete' | 'incomplete' };
type TrelloChecklist = { checkItems?: TrelloCheckItem[]; id: string; name: string };
type TrelloCard = { desc: string; id: string; idLabels?: string[]; idList: string; name: string; shortUrl?: string };
type ChecklistSyncPlan =
  | { items: string[]; type: 'create' }
  | {
      checklistId: string;
      checklistNameNeedsUpdate: boolean;
      existingChecklistName: string;
      itemRenames: Array<{ id: string; name: string }>;
      itemsToAdd: string[];
      itemsToDelete: TrelloCheckItem[];
      type: 'noop' | 'update';
    };
type SyncAction =
  | {
      card: TrelloBacklogCard;
      checklistPlan: ChecklistSyncPlan;
      labelIds: string[];
      targetListId: string;
      targetListName: string;
      type: 'create';
    }
  | {
      card: TrelloBacklogCard;
      checklistPlan: ChecklistSyncPlan;
      existingCard: TrelloCard;
      existingListName: string;
      labelIdsToAdd: string[];
      labelIdsToRemove: string[];
      needsDescUpdate: boolean;
      needsNameUpdate: boolean;
      type: 'noop' | 'update';
    };

const DEFAULT_PLAN_PATH = 'LOCAL_SEO_PLAN.md';
const DEFAULT_BOARD_SPEC_PATH = 'TRELLO.md';

async function main() {
  const rawArgs = process.argv.slice(2);
  const args = new Set(rawArgs);
  const dryRun = !args.has('--apply') || args.has('--dry-run');
  const selectedCardId = getArgValue(rawArgs, '--card-id');

  const planPath = path.join(process.cwd(), DEFAULT_PLAN_PATH);
  const boardSpecPath = path.join(process.cwd(), DEFAULT_BOARD_SPEC_PATH);
  const apiKey = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_API_TOKEN;
  const boardId = process.env.TRELLO_BOARD_ID;

  if (!apiKey || !token || !boardId) {
    fail('Missing TRELLO_API_KEY, TRELLO_API_TOKEN, or TRELLO_BOARD_ID in the environment.');
  }

  const [planMarkdown, boardSpecMarkdown] = await Promise.all([
    fs.readFile(planPath, 'utf8'),
    fs.readFile(boardSpecPath, 'utf8'),
  ]);

  const parsedBacklogCards = parseLocalSeoBacklog(planMarkdown);
  const backlogCards = filterCardsById(parsedBacklogCards, selectedCardId);
  const boardSpec = parseTrelloBoardSpec(boardSpecMarkdown);

  validateCardsAgainstBoardSpec(backlogCards, boardSpec);

  const client = new TrelloClient(apiKey, token);
  const [boardLists, boardLabels, boardCards] = await Promise.all([
    client.getBoardLists(boardId),
    client.getBoardLabels(boardId),
    client.getBoardCards(boardId),
  ]);

  const cardsBySyncId = new Map<string, TrelloCard>();
  for (const card of boardCards) {
    const syncedId = extractSyncedCardId(card.desc);
    if (syncedId) {
      cardsBySyncId.set(syncedId, card);
    }
  }

  const existingSyncedCards = backlogCards
    .map((card) => cardsBySyncId.get(card.cardId))
    .filter((card): card is TrelloCard => card !== undefined);

  const checklistEntries = await Promise.all(
    existingSyncedCards.map(async (card) => [card.id, await client.getCardChecklists(card.id)] as const)
  );
  const checklistsByCardId = new Map<string, TrelloChecklist[]>(checklistEntries);

  const actions = buildSyncActions(backlogCards, boardLists, boardLabels, boardCards, checklistsByCardId);

  printSyncPlan(actions, dryRun, selectedCardId);

  if (dryRun) {
    return;
  }

  for (const action of actions) {
    if (action.type === 'noop') {
      continue;
    }

    if (action.type === 'create') {
      const desc = buildTrelloCardDescription(action.card);
      const createdCard = await client.createCard({
        desc,
        idLabels: action.labelIds,
        idList: action.targetListId,
        name: action.card.title,
      });

      await applyChecklistPlan(client, createdCard.id, action.checklistPlan);

      console.log(`Created: ${action.card.title} -> ${createdCard.shortUrl ?? createdCard.id}`);
      continue;
    }

    if (action.needsNameUpdate || action.needsDescUpdate) {
      await client.updateCard(action.existingCard.id, {
        ...(action.needsDescUpdate ? { desc: buildTrelloCardDescription(action.card) } : {}),
        ...(action.needsNameUpdate ? { name: action.card.title } : {}),
      });
    }

    for (const labelId of action.labelIdsToAdd) {
      await client.addLabelToCard(action.existingCard.id, labelId);
    }

    for (const labelId of action.labelIdsToRemove) {
      await client.removeLabelFromCard(action.existingCard.id, labelId);
    }

    await applyChecklistPlan(client, action.existingCard.id, action.checklistPlan);

    console.log(`Updated: ${action.card.title}`);
  }
}

function validateCardsAgainstBoardSpec(cards: TrelloBacklogCard[], boardSpec: { labels: string[]; lists: string[] }) {
  const unknownLists = new Set<string>();
  const unknownLabels = new Set<string>();

  for (const card of cards) {
    if (!boardSpec.lists.includes(card.listName)) {
      unknownLists.add(card.listName);
    }

    for (const label of card.labels) {
      if (!boardSpec.labels.includes(label)) {
        unknownLabels.add(label);
      }
    }
  }

  if (unknownLists.size > 0 || unknownLabels.size > 0) {
    const parts: string[] = [];

    if (unknownLists.size > 0) {
      parts.push(`Unknown lists in LOCAL_SEO_PLAN.md: ${Array.from(unknownLists).join(', ')}`);
    }

    if (unknownLabels.size > 0) {
      parts.push(`Unknown labels in LOCAL_SEO_PLAN.md: ${Array.from(unknownLabels).join(', ')}`);
    }

    fail(parts.join('\n'));
  }
}

function filterCardsById(cards: TrelloBacklogCard[], selectedCardId?: string): TrelloBacklogCard[] {
  if (!selectedCardId) {
    return cards;
  }

  const filteredCards = cards.filter((card) => card.cardId === selectedCardId);

  if (filteredCards.length === 0) {
    fail(`No card found for Card ID "${selectedCardId}".`);
  }

  return filteredCards;
}

function buildSyncActions(
  backlogCards: TrelloBacklogCard[],
  boardLists: TrelloList[],
  boardLabels: TrelloLabel[],
  boardCards: TrelloCard[],
  checklistsByCardId: Map<string, TrelloChecklist[]>
): SyncAction[] {
  const listsByName = new Map(boardLists.map((list) => [list.name, list]));
  const labelsByName = new Map(boardLabels.map((label) => [label.name ?? '', label]));
  const cardsBySyncId = new Map<string, TrelloCard>();

  for (const card of boardCards) {
    const syncedId = extractSyncedCardId(card.desc);
    if (syncedId) {
      cardsBySyncId.set(syncedId, card);
    }
  }

  return backlogCards.map((card) => {
    const targetList = listsByName.get(card.listName);
    if (!targetList) {
      fail(`Board is missing list "${card.listName}".`);
    }

    const labelIds = card.labels.map((labelName) => {
      const label = labelsByName.get(labelName);
      if (!label) {
        fail(`Board is missing label "${labelName}".`);
      }
      return label.id;
    });

    const existingCard = cardsBySyncId.get(card.cardId);
    if (!existingCard) {
      return {
        card,
        checklistPlan: { items: buildAcceptanceChecklistItems(card), type: 'create' },
        labelIds,
        targetListId: targetList.id,
        targetListName: targetList.name,
        type: 'create',
      };
    }

    const existingLabelIds = new Set(existingCard.idLabels ?? []);
    const desiredLabelIds = new Set(labelIds);
    const labelIdsToAdd = labelIds.filter((labelId) => !existingLabelIds.has(labelId));
    const labelIdsToRemove = [...existingLabelIds].filter((labelId) => !desiredLabelIds.has(labelId));
    const needsNameUpdate = existingCard.name !== card.title;
    const needsDescUpdate = existingCard.desc !== buildTrelloCardDescription(card);
    const existingListName = boardLists.find((list) => list.id === existingCard.idList)?.name ?? '(unknown list)';
    const checklistPlan = buildChecklistSyncPlan(card, checklistsByCardId.get(existingCard.id) ?? []);
    const checklistNeedsUpdate = checklistPlan.type !== 'noop';
    const type =
      needsNameUpdate || needsDescUpdate || labelIdsToAdd.length > 0 || labelIdsToRemove.length > 0 || checklistNeedsUpdate
        ? 'update'
        : 'noop';

    return {
      card,
      checklistPlan,
      existingCard,
      existingListName,
      labelIdsToAdd,
      labelIdsToRemove,
      needsDescUpdate,
      needsNameUpdate,
      type,
    };
  });
}

function buildChecklistSyncPlan(card: TrelloBacklogCard, existingChecklists: TrelloChecklist[]): ChecklistSyncPlan {
  const desiredItems = buildAcceptanceChecklistItems(card);
  const checklist = existingChecklists.find((item) => item.name === ACCEPTANCE_CHECKLIST_NAME);

  if (!checklist) {
    return { items: desiredItems, type: 'create' };
  }

  const existingItems = [...(checklist.checkItems ?? [])].sort((a, b) => (a.pos ?? 0) - (b.pos ?? 0));
  const sharedLength = Math.min(existingItems.length, desiredItems.length);
  const itemRenames: Array<{ id: string; name: string }> = [];

  for (let index = 0; index < sharedLength; index++) {
    if (existingItems[index].name !== desiredItems[index]) {
      itemRenames.push({ id: existingItems[index].id, name: desiredItems[index] });
    }
  }

  const itemsToAdd = desiredItems.slice(sharedLength);
  const itemsToDelete = existingItems.slice(sharedLength);
  const checklistNameNeedsUpdate = checklist.name !== ACCEPTANCE_CHECKLIST_NAME;
  const type =
    checklistNameNeedsUpdate || itemRenames.length > 0 || itemsToAdd.length > 0 || itemsToDelete.length > 0 ? 'update' : 'noop';

  return {
    checklistId: checklist.id,
    checklistNameNeedsUpdate,
    existingChecklistName: checklist.name,
    itemRenames,
    itemsToAdd,
    itemsToDelete,
    type,
  };
}

async function applyChecklistPlan(client: TrelloClient, cardId: string, checklistPlan: ChecklistSyncPlan) {
  if (checklistPlan.type === 'noop') {
    return;
  }

  if (checklistPlan.type === 'create') {
    const checklist = await client.createChecklistOnCard(cardId, ACCEPTANCE_CHECKLIST_NAME);
    for (const item of checklistPlan.items) {
      await client.addCheckItem(checklist.id, item);
    }
    return;
  }

  if (checklistPlan.checklistNameNeedsUpdate) {
    await client.updateChecklist(checklistPlan.checklistId, { name: ACCEPTANCE_CHECKLIST_NAME });
  }

  for (const itemRename of checklistPlan.itemRenames) {
    await client.updateCheckItemOnCard(cardId, itemRename.id, {
      idChecklist: checklistPlan.checklistId,
      name: itemRename.name,
    });
  }

  for (const itemToAdd of checklistPlan.itemsToAdd) {
    await client.addCheckItem(checklistPlan.checklistId, itemToAdd);
  }

  for (const itemToDelete of checklistPlan.itemsToDelete) {
    await client.deleteCheckItem(checklistPlan.checklistId, itemToDelete.id);
  }
}

function printSyncPlan(actions: SyncAction[], dryRun: boolean, selectedCardId?: string) {
  const createCount = actions.filter((action) => action.type === 'create').length;
  const updateCount = actions.filter((action) => action.type === 'update').length;
  const noopCount = actions.filter((action) => action.type === 'noop').length;

  console.log(`${dryRun ? 'Dry run' : 'Apply'} mode`);
  if (selectedCardId) {
    console.log(`Card filter: ${selectedCardId}`);
  }
  console.log(`Create: ${createCount}, Update: ${updateCount}, No-op: ${noopCount}`);

  for (const action of actions) {
    if (action.type === 'create') {
      console.log(
        `CREATE | ${action.targetListName} | ${action.card.title} | labels: ${action.card.labels.join(', ')} | checklist: ${ACCEPTANCE_CHECKLIST_NAME}`
      );
      continue;
    }

    if (action.type === 'noop') {
      console.log(`NO-OP  | ${action.existingListName} | ${action.card.title}`);
      continue;
    }

    const changes: string[] = [];
    if (action.needsNameUpdate) changes.push('name');
    if (action.needsDescUpdate) changes.push('description');
    if (action.labelIdsToAdd.length > 0) changes.push(`add ${action.labelIdsToAdd.length} label(s)`);
    if (action.labelIdsToRemove.length > 0) changes.push(`remove ${action.labelIdsToRemove.length} label(s)`);
    if (action.checklistPlan.type === 'create') changes.push(`create checklist "${ACCEPTANCE_CHECKLIST_NAME}"`);
    if (action.checklistPlan.type === 'update') {
      if (action.checklistPlan.checklistNameNeedsUpdate) changes.push('rename checklist');
      if (action.checklistPlan.itemRenames.length > 0) changes.push(`rename ${action.checklistPlan.itemRenames.length} checklist item(s)`);
      if (action.checklistPlan.itemsToAdd.length > 0) changes.push(`add ${action.checklistPlan.itemsToAdd.length} checklist item(s)`);
      if (action.checklistPlan.itemsToDelete.length > 0) changes.push(`remove ${action.checklistPlan.itemsToDelete.length} checklist item(s)`);
    }

    console.log(`UPDATE | ${action.existingListName} | ${action.card.title} | ${changes.join(', ')}`);
  }
}

function getArgValue(args: string[], flagName: string): string | undefined {
  const directMatch = args.find((arg) => arg.startsWith(`${flagName}=`));
  if (directMatch) {
    return directMatch.slice(flagName.length + 1).trim() || undefined;
  }

  const flagIndex = args.indexOf(flagName);
  if (flagIndex === -1) {
    return undefined;
  }

  const nextArg = args[flagIndex + 1];
  if (!nextArg || nextArg.startsWith('--')) {
    fail(`Expected a value after ${flagName}.`);
  }

  return nextArg.trim();
}

class TrelloClient {
  constructor(
    private readonly apiKey: string,
    private readonly token: string
  ) {}

  async getBoardLists(boardId: string): Promise<TrelloList[]> {
    return this.request<TrelloList[]>(`/boards/${boardId}/lists`, { fields: 'id,name' });
  }

  async getBoardLabels(boardId: string): Promise<TrelloLabel[]> {
    return this.request<TrelloLabel[]>(`/boards/${boardId}/labels`, { fields: 'id,name,color' });
  }

  async getBoardCards(boardId: string): Promise<TrelloCard[]> {
    return this.request<TrelloCard[]>(`/boards/${boardId}/cards`, {
      fields: 'id,name,desc,idList,idLabels,shortUrl',
      filter: 'open',
    });
  }

  async getCardChecklists(cardId: string): Promise<TrelloChecklist[]> {
    return this.request<TrelloChecklist[]>(`/cards/${cardId}/checklists`, {
      checkItem_fields: 'id,name,state,pos',
      checkItems: 'all',
      fields: 'id,name',
    });
  }

  async createCard(params: { desc: string; idLabels: string[]; idList: string; name: string }): Promise<TrelloCard> {
    return this.request<TrelloCard>('/cards', {
      desc: params.desc,
      idLabels: params.idLabels.join(','),
      idList: params.idList,
      name: params.name,
      pos: 'top',
    }, 'POST');
  }

  async updateCard(cardId: string, params: { desc?: string; name?: string }): Promise<TrelloCard> {
    return this.request<TrelloCard>(`/cards/${cardId}`, params, 'PUT');
  }

  async createChecklistOnCard(cardId: string, name: string): Promise<TrelloChecklist> {
    return this.request<TrelloChecklist>(`/cards/${cardId}/checklists`, { name }, 'POST');
  }

  async updateChecklist(checklistId: string, params: { name: string }): Promise<TrelloChecklist> {
    return this.request<TrelloChecklist>(`/checklists/${checklistId}`, params, 'PUT');
  }

  async addCheckItem(checklistId: string, name: string): Promise<TrelloCheckItem> {
    return this.request<TrelloCheckItem>(`/checklists/${checklistId}/checkItems`, { name }, 'POST');
  }

  async updateCheckItemOnCard(cardId: string, checkItemId: string, params: { idChecklist: string; name: string }) {
    return this.request(`/cards/${cardId}/checkItem/${checkItemId}`, params, 'PUT');
  }

  async deleteCheckItem(checklistId: string, checkItemId: string) {
    await this.request(`/checklists/${checklistId}/checkItems/${checkItemId}`, {}, 'DELETE');
  }

  async addLabelToCard(cardId: string, labelId: string): Promise<void> {
    await this.request(`/cards/${cardId}/idLabels`, { value: labelId }, 'POST');
  }

  async removeLabelFromCard(cardId: string, labelId: string): Promise<void> {
    await this.request(`/cards/${cardId}/idLabels/${labelId}`, {}, 'DELETE');
  }

  private async request<T = unknown>(pathname: string, params: Record<string, string> = {}, method: string = 'GET'): Promise<T> {
    const url = new URL(`https://api.trello.com/1${pathname}`);
    const searchParams = new URLSearchParams({
      key: this.apiKey,
      token: this.token,
    });

    for (const [key, value] of Object.entries(params)) {
      if (value !== '') {
        searchParams.set(key, value);
      }
    }

    url.search = searchParams.toString();

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      method,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Trello API error ${response.status} for ${method} ${pathname}: ${text}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
