import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';

import {
  ACCEPTANCE_CHECKLIST_NAME,
  buildAcceptanceChecklistItems,
  buildTrelloCardDescription,
  extractSyncedCardId,
  parseLocalSeoBacklog,
  parseTrelloBoardSpec,
} from '../lib/trello-backlog';

const repoRoot = process.cwd();
const localSeoPlanPath = path.join(repoRoot, 'improvement-ideas', 'LOCAL_SEO_PLAN.md');
const localSeoPlan = fs.readFileSync(localSeoPlanPath, 'utf8');
const trelloBoardSpec = fs.readFileSync(path.join(repoRoot, 'TRELLO.md'), 'utf8');

describe('parseTrelloBoardSpec()', () => {
  it('reads lists and labels from TRELLO.md', () => {
    const boardSpec = parseTrelloBoardSpec(trelloBoardSpec);

    assert.ok(boardSpec.lists.includes('Inbox 📥'));
    assert.ok(boardSpec.lists.includes('Doing ⏩'));
    assert.ok(boardSpec.labels.includes('🔎 SEO'));
    assert.ok(boardSpec.labels.includes('🌍 Website content'));
  });
});

describe('parseLocalSeoBacklog()', () => {
  it('parses Trello-ready cards from improvement-ideas/LOCAL_SEO_PLAN.md', () => {
    const cards = parseLocalSeoBacklog(localSeoPlan, 'improvement-ideas/LOCAL_SEO_PLAN.md');

    assert.ok(cards.length > 10, 'expected a substantial backlog');
    assert.ok(cards.every((card) => card.listName === 'Inbox 📥'));
    assert.ok(cards.every((card) => card.sourcePath === 'improvement-ideas/LOCAL_SEO_PLAN.md'));
    assert.ok(cards.some((card) => card.cardId === 'audit-gbp-business-type-address-service-areas'));
    assert.ok(cards.some((card) => card.labels.includes('🔎 SEO')));
  });

  it('uses a blank line after the card heading and level 4 plan headings', () => {
    assert.match(
      localSeoPlan,
      /^### Card: Audit GBP business type, address visibility, and service areas\n\nCard ID:/m
    );
    assert.match(localSeoPlan, /^#### What are we trying to achieve\?$/m);
    assert.match(localSeoPlan, /^#### Why are we doing this\?$/m);
    assert.match(localSeoPlan, /^#### Acceptance criteria$/m);
  });
});

describe('buildTrelloCardDescription()', () => {
  it('includes the sync marker and the narrative sections only', () => {
    const [card] = parseLocalSeoBacklog(localSeoPlan, 'improvement-ideas/LOCAL_SEO_PLAN.md');
    const description = buildTrelloCardDescription(card);

    assert.equal(extractSyncedCardId(description), card.cardId);
    assert.ok(description.includes('Source: improvement-ideas/LOCAL_SEO_PLAN.md'));
    assert.ok(description.includes('## What are we trying to achieve?'));
    assert.ok(description.includes('## Why are we doing this?'));
    assert.ok(!description.includes(`## ${ACCEPTANCE_CHECKLIST_NAME}`));
    assert.ok(!description.includes('- Current GBP setup is documented.'));
  });
});

describe('buildAcceptanceChecklistItems()', () => {
  it('returns the acceptance criteria as checklist items', () => {
    const [card] = parseLocalSeoBacklog(localSeoPlan, 'improvement-ideas/LOCAL_SEO_PLAN.md');
    const items = buildAcceptanceChecklistItems(card);

    assert.deepEqual(items, [
      'Current GBP setup is documented.',
      'It is clear whether the business should be treated as a service-area business or hybrid business.',
      'A recommendation is made on whether the address should remain visible or be hidden.',
      'Current service areas are documented.',
      'A recommended service-area list is proposed.',
      'Any guideline or ranking risks are noted clearly.',
    ]);
  });
});
