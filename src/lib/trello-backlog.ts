export type TrelloBacklogCard = {
  acceptanceCriteria: string[];
  cardId: string;
  labels: string[];
  listName: string;
  title: string;
  what: string;
  why: string;
};

export type TrelloBoardSpec = {
  labels: string[];
  lists: string[];
};

export const ACCEPTANCE_CHECKLIST_NAME = 'Acceptance criteria';

const CARD_ID_PREFIX = 'Card ID:';
const LIST_PREFIX = 'List:';
const LABELS_PREFIX = 'Labels:';
const WHAT_TITLE = 'What are we trying to achieve?';
const WHY_TITLE = 'Why are we doing this?';
const ACCEPTANCE_TITLE = 'Acceptance criteria';
const SYNC_MARKER_PREFIX = '<!-- trello-sync-card-id:';

export function parseLocalSeoBacklog(markdown: string): TrelloBacklogCard[] {
  const headingRegex = /^### Card: (.+)$/gm;
  const matches = Array.from(markdown.matchAll(headingRegex));

  return matches.map((match, index) => {
    const title = match[1].trim();
    const start = match.index ?? 0;
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? markdown.length) : markdown.length;
    const block = markdown.slice(start, end).trim();
    const metadataArea = extractMetadataArea(block);

    const cardId = extractMetadataField(metadataArea, CARD_ID_PREFIX, [LIST_PREFIX, LABELS_PREFIX]);
    const listName = extractMetadataField(metadataArea, LIST_PREFIX, [CARD_ID_PREFIX, LABELS_PREFIX]);
    const labels = extractMetadataField(metadataArea, LABELS_PREFIX, [CARD_ID_PREFIX, LIST_PREFIX])
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean);

    const what = extractSection(block, planSectionHeading(WHAT_TITLE), planSectionHeading(WHY_TITLE));
    const why = extractSection(block, planSectionHeading(WHY_TITLE), planSectionHeading(ACCEPTANCE_TITLE));
    const acceptanceRaw = extractTrailingSection(block, planSectionHeading(ACCEPTANCE_TITLE));
    const acceptanceCriteria = acceptanceRaw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('- '))
      .map((line) => line.slice(2).trim());

    if (labels.length === 0) {
      throw new Error(`Card "${title}" must define at least one label.`);
    }

    if (acceptanceCriteria.length === 0) {
      throw new Error(`Card "${title}" must define at least one acceptance criterion.`);
    }

    return {
      acceptanceCriteria,
      cardId,
      labels,
      listName,
      title,
      what,
      why,
    };
  });
}

export function parseTrelloBoardSpec(markdown: string): TrelloBoardSpec {
  const lines = markdown.split('\n');
  let currentSection: 'Labels' | 'Lists' | null = null;
  const lists: string[] = [];
  const labels: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === '## Lists') {
      currentSection = 'Lists';
      continue;
    }

    if (line === '## Labels') {
      currentSection = 'Labels';
      continue;
    }

    if (line.startsWith('## ')) {
      currentSection = null;
      continue;
    }

    if (!line.startsWith('### ')) {
      continue;
    }

    const value = line.slice(4).trim();

    if (currentSection === 'Lists') {
      lists.push(value);
    } else if (currentSection === 'Labels') {
      labels.push(value);
    }
  }

  return { labels, lists };
}

export function buildTrelloCardDescription(card: TrelloBacklogCard): string {
  return [
    `${SYNC_MARKER_PREFIX}${card.cardId} -->`,
    'Source: LOCAL_SEO_PLAN.md',
    '',
    trelloSectionHeading(WHAT_TITLE),
    '',
    card.what,
    '',
    trelloSectionHeading(WHY_TITLE),
    '',
    card.why,
  ].join('\n');
}

export function buildAcceptanceChecklistItems(card: TrelloBacklogCard): string[] {
  return [...card.acceptanceCriteria];
}

export function extractSyncedCardId(description: string): string | null {
  const markerRegex = /<!-- trello-sync-card-id:([a-z0-9-]+) -->/i;
  return description.match(markerRegex)?.[1] ?? null;
}

function extractMetadataArea(block: string): string {
  const firstSectionIndex = block.search(/^#### /m);
  if (firstSectionIndex === -1) {
    throw new Error('Missing Trello backlog card sections.');
  }

  return block.slice(0, firstSectionIndex).trim();
}

function extractMetadataField(metadataArea: string, prefix: string, otherPrefixes: string[]): string {
  const escapedPrefix = escapeForRegex(prefix);
  const nextPrefixes = otherPrefixes.map(escapeForRegex).join('|');
  const regex = new RegExp(`${escapedPrefix}\\s*([\\s\\S]*?)(?=(?:\\s+(?:${nextPrefixes})\\s*)|$)`);
  const value = metadataArea.match(regex)?.[1]?.replace(/\s+/g, ' ').trim();

  if (!value) {
    throw new Error(`Missing required field "${prefix}" in Trello backlog card.`);
  }

  return value;
}

function extractSection(block: string, heading: string, nextHeading: string): string {
  const escapedHeading = escapeForRegex(heading);
  const escapedNextHeading = escapeForRegex(nextHeading);
  const regex = new RegExp(`^${escapedHeading}\\n\\n([\\s\\S]*?)(?=^${escapedNextHeading}$)`, 'm');
  const value = block.match(regex)?.[1]?.trim();

  if (!value) {
    throw new Error(`Missing required section "${heading}" in Trello backlog card.`);
  }

  return value;
}

function extractTrailingSection(block: string, heading: string): string {
  const escapedHeading = escapeForRegex(heading);
  const regex = new RegExp(`^${escapedHeading}\\n\\n([\\s\\S]*)`, 'm');
  const value = block.match(regex)?.[1]?.trim();

  if (!value) {
    throw new Error(`Missing required section "${heading}" in Trello backlog card.`);
  }

  return value;
}

function planSectionHeading(title: string): string {
  return `#### ${title}`;
}

function trelloSectionHeading(title: string): string {
  return `## ${title}`;
}

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
