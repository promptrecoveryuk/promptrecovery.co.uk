import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getAllAreasMeta, getAreaContent, getAreaMeta, getAreaSlugs } from '../lib/areas';

// These tests intentionally run against the real area collection so loader and
// frontmatter regressions are caught against production-like content.
const KNOWN_SLUG = 'rickmansworth';

describe('getAreaSlugs()', () => {
  it('returns an array of slugs', () => {
    const slugs = getAreaSlugs();
    assert.ok(Array.isArray(slugs));
    assert.ok(slugs.length >= 1, 'expected at least one area to exist');
    assert.ok(slugs.includes(KNOWN_SLUG), `expected slugs to include "${KNOWN_SLUG}"`);
  });

  it('does not include file extensions', () => {
    for (const slug of getAreaSlugs()) {
      assert.ok(!slug.endsWith('.mdx'), `slug "${slug}" should not include the .mdx extension`);
    }
  });
});

describe('getAreaMeta(slug)', () => {
  it('returns expected core metadata', () => {
    const meta = getAreaMeta(KNOWN_SLUG);

    assert.equal(meta.slug, KNOWN_SLUG);
    assert.equal(meta.title, 'Breakdown Recovery in Rickmansworth');
    assert.equal(typeof meta.description, 'string');
    assert.equal(typeof meta.date, 'string');
    assert.equal(typeof meta.imageIndex, 'number');
    assert.equal(typeof meta.author, 'string');
  });

  it('preserves FAQ frontmatter when present', () => {
    const meta = getAreaMeta(KNOWN_SLUG);

    assert.ok(meta.faqs);
    assert.ok(meta.faqs.length > 0, 'expected FAQs to be present');
    assert.equal(typeof meta.faqs[0].question, 'string');
    assert.equal(typeof meta.faqs[0].answer, 'string');
  });
});

describe('getAreaContent(slug)', () => {
  it('returns meta and stripped content', () => {
    const { meta, content } = getAreaContent(KNOWN_SLUG);

    assert.equal(meta.slug, KNOWN_SLUG);
    assert.ok(content.trim().length > 0, 'content body should not be empty');
    assert.ok(!content.includes('title:'), 'content should not contain frontmatter fields');
  });

  it('returns the same metadata as getAreaMeta', () => {
    const { meta } = getAreaContent(KNOWN_SLUG);
    assert.deepEqual(meta, getAreaMeta(KNOWN_SLUG));
  });
});

describe('getAllAreasMeta()', () => {
  it('returns every area with required fields', () => {
    const areas = getAllAreasMeta();

    assert.ok(areas.length >= 1);
    for (const area of areas) {
      assert.equal(typeof area.slug, 'string');
      assert.equal(typeof area.title, 'string');
      assert.equal(typeof area.date, 'string');
      assert.equal(typeof area.description, 'string');
      assert.equal(typeof area.imageIndex, 'number');
      assert.equal(typeof area.author, 'string');
    }
  });

  it('returns areas newest-first', () => {
    const areas = getAllAreasMeta();

    for (let i = 0; i < areas.length - 1; i++) {
      const current = new Date(areas[i].date).getTime();
      const next = new Date(areas[i + 1].date).getTime();
      assert.ok(current >= next, `area[${i}] (${areas[i].date}) should be >= area[${i + 1}] (${areas[i + 1].date})`);
    }
  });
});
