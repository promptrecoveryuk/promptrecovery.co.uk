import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  getAllServicesMeta,
  getServiceContent,
  getServiceMeta,
  getServiceSlugs,
  hasServicePage,
} from '../lib/services';

// These tests intentionally use the real service content collection so the
// homepage/services card-linking logic stays aligned with the files on disk.
const LINKED_SERVICE_SLUG = 'breakdown-towing';
const UNLINKED_SERVICE_SLUG = 'motorway-recovery';

describe('getServiceSlugs()', () => {
  it('returns the known linked service slug', () => {
    const slugs = getServiceSlugs();

    assert.ok(Array.isArray(slugs));
    assert.ok(slugs.includes(LINKED_SERVICE_SLUG));
  });
});

describe('getServiceMeta(slug)', () => {
  it('returns metadata for the known linked service', () => {
    const meta = getServiceMeta(LINKED_SERVICE_SLUG);

    assert.equal(meta.slug, LINKED_SERVICE_SLUG);
    assert.equal(meta.title, 'Breakdown & Towing in Watford');
    assert.equal(typeof meta.description, 'string');
    assert.equal(typeof meta.imageIndex, 'number');
  });
});

describe('getServiceContent(slug)', () => {
  it('returns content and matching metadata', () => {
    const { meta, content } = getServiceContent(LINKED_SERVICE_SLUG);

    assert.equal(meta.slug, LINKED_SERVICE_SLUG);
    assert.ok(content.includes('What this service covers'));
    assert.deepEqual(meta, getServiceMeta(LINKED_SERVICE_SLUG));
  });
});

describe('getAllServicesMeta()', () => {
  it('includes the known linked service', () => {
    const services = getAllServicesMeta();

    assert.ok(services.some((service) => service.slug === LINKED_SERVICE_SLUG));
  });
});

describe('hasServicePage(slug)', () => {
  it('returns true when a matching service page exists', () => {
    assert.equal(hasServicePage(LINKED_SERVICE_SLUG), true);
  });

  it('returns false when no matching service page exists', () => {
    assert.equal(hasServicePage(UNLINKED_SERVICE_SLUG), false);
  });
});
