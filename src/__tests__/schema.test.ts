import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildHowToSchema,
  getSchemaIds,
} from '../lib/schema';

// The schema tests focus on the shared builder functions rather than full page
// rendering, so JSON-LD behaviour is covered without mounting React routes.
describe('getSchemaIds()', () => {
  it('returns stable website and local business ids', () => {
    assert.deepEqual(getSchemaIds('https://promptrecovery.co.uk'), {
      localBusiness: 'https://promptrecovery.co.uk/#localbusiness',
      website: 'https://promptrecovery.co.uk/#website',
    });
  });
});

describe('buildArticleSchema()', () => {
  it('builds a connected article schema object', () => {
    const schema = buildArticleSchema({
      authorName: 'Nick',
      canonicalUrl: 'https://promptrecovery.co.uk/blog/test-post/',
      datePublished: '2026-04-01',
      description: 'Test description',
      headline: 'Test headline',
      image: 'https://promptrecovery.co.uk/images/test.jpg',
      localBusinessId: 'https://promptrecovery.co.uk/#localbusiness',
      websiteId: 'https://promptrecovery.co.uk/#website',
    });

    assert.equal(schema['@type'], 'BlogPosting');
    assert.equal(schema['@id'], 'https://promptrecovery.co.uk/blog/test-post/#article');
    assert.equal(schema.author.url, 'https://promptrecovery.co.uk/about/');
    assert.deepEqual(schema.publisher, { '@id': 'https://promptrecovery.co.uk/#localbusiness' });
    assert.deepEqual(schema.isPartOf, { '@id': 'https://promptrecovery.co.uk/#website' });
  });
});

describe('buildBreadcrumbSchema()', () => {
  it('omits item on the current page breadcrumb', () => {
    const schema = buildBreadcrumbSchema([
      { name: 'Home', item: 'https://promptrecovery.co.uk/' },
      { name: 'Blog', item: 'https://promptrecovery.co.uk/blog/' },
      { name: 'Current page' },
    ]);

    assert.equal(schema.itemListElement[2].name, 'Current page');
    assert.ok(!('item' in schema.itemListElement[2]));
  });
});

describe('buildFaqPageSchema()', () => {
  it('strips markdown links from answer text', () => {
    const schema = buildFaqPageSchema([
      {
        question: 'What areas do you cover?',
        answer: 'We cover [Rickmansworth](/areas/rickmansworth/) and nearby towns.',
      },
    ]);

    assert.equal(schema.mainEntity[0].acceptedAnswer.text, 'We cover Rickmansworth and nearby towns.');
  });
});

describe('buildHowToSchema()', () => {
  it('numbers how-to steps in order', () => {
    const schema = buildHowToSchema('Do a thing', 'Description', ['First step', 'Second step']);

    assert.equal(schema.step.length, 2);
    assert.deepEqual(schema.step[0], { '@type': 'HowToStep', position: 1, name: 'First step' });
    assert.deepEqual(schema.step[1], { '@type': 'HowToStep', position: 2, name: 'Second step' });
  });
});
