import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getAllPostsMeta, getPostContent, getPostMeta, getPostSlugs } from '../lib/posts';

// ---------------------------------------------------------------------------
// The tests below run against the real files in src/content/posts/ — no
// mocking. This keeps the tests simple and guarantees that the helpers work
// with the actual MDX files on disk.
// ---------------------------------------------------------------------------

// Known slug used throughout (the post that ships with the project).
const KNOWN_SLUG = 'what-to-do-when-your-car-breaks-down-on-the-motorway';

describe('getPostSlugs()', () => {
  it('returns an array', () => {
    const slugs = getPostSlugs();
    assert.ok(Array.isArray(slugs));
  });

  it('returns at least one slug', () => {
    const slugs = getPostSlugs();
    assert.ok(slugs.length >= 1, 'expected at least one post to exist');
  });

  it('returns slugs without the .mdx extension', () => {
    const slugs = getPostSlugs();
    for (const slug of slugs) {
      assert.ok(!slug.endsWith('.mdx'), `slug "${slug}" should not include the .mdx extension`);
    }
  });

  it('includes the known slug', () => {
    const slugs = getPostSlugs();
    assert.ok(slugs.includes(KNOWN_SLUG), `expected slugs to include "${KNOWN_SLUG}"`);
  });
});

describe('getPostMeta(slug)', () => {
  it('returns a PostMeta object with all required fields', () => {
    const meta = getPostMeta(KNOWN_SLUG);
    assert.equal(meta.slug, KNOWN_SLUG);
    assert.equal(typeof meta.title, 'string');
    assert.equal(typeof meta.date, 'string');
    assert.equal(typeof meta.description, 'string');
    assert.equal(typeof meta.imageIndex, 'number');
  });

  it('returns the correct title for the known post', () => {
    const meta = getPostMeta(KNOWN_SLUG);
    assert.equal(meta.title, 'What to do when your car breaks down on the motorway');
  });

  it('returns a valid ISO date string', () => {
    const meta = getPostMeta(KNOWN_SLUG);
    const parsed = new Date(meta.date);
    assert.ok(!isNaN(parsed.getTime()), `date "${meta.date}" should be a valid date`);
  });

  it('returns a non-empty description', () => {
    const meta = getPostMeta(KNOWN_SLUG);
    assert.ok(meta.description.length > 0, 'description should not be empty');
  });

  it('returns a positive imageIndex', () => {
    const meta = getPostMeta(KNOWN_SLUG);
    assert.ok(meta.imageIndex >= 1, 'imageIndex should be a 1-based index (>= 1)');
  });
});

describe('getPostContent(slug)', () => {
  it('returns meta and content', () => {
    const { meta, content } = getPostContent(KNOWN_SLUG);
    assert.equal(typeof content, 'string');
    assert.equal(meta.slug, KNOWN_SLUG);
  });

  it('strips frontmatter from the content body', () => {
    const { content } = getPostContent(KNOWN_SLUG);
    assert.ok(!content.includes('---'), 'content should not contain raw frontmatter delimiters');
    assert.ok(!content.includes('title:'), 'content should not contain the frontmatter title field');
  });

  it('content is non-empty', () => {
    const { content } = getPostContent(KNOWN_SLUG);
    assert.ok(content.trim().length > 0, 'content body should not be empty');
  });

  it('meta matches what getPostMeta returns', () => {
    const { meta } = getPostContent(KNOWN_SLUG);
    const directMeta = getPostMeta(KNOWN_SLUG);
    assert.deepEqual(meta, directMeta);
  });
});

describe('getAllPostsMeta()', () => {
  it('returns an array', () => {
    const posts = getAllPostsMeta();
    assert.ok(Array.isArray(posts));
  });

  it('returns at least one post', () => {
    const posts = getAllPostsMeta();
    assert.ok(posts.length >= 1);
  });

  it('every post has all required fields', () => {
    const posts = getAllPostsMeta();
    for (const post of posts) {
      assert.equal(typeof post.slug, 'string', 'slug must be a string');
      assert.equal(typeof post.title, 'string', 'title must be a string');
      assert.equal(typeof post.date, 'string', 'date must be a string');
      assert.equal(typeof post.description, 'string', 'description must be a string');
      assert.equal(typeof post.imageIndex, 'number', 'imageIndex must be a number');
    }
  });

  it('posts are sorted newest-first', () => {
    const posts = getAllPostsMeta();
    for (let i = 0; i < posts.length - 1; i++) {
      const current = new Date(posts[i].date).getTime();
      const next = new Date(posts[i + 1].date).getTime();
      assert.ok(current >= next, `post[${i}] (${posts[i].date}) should be >= post[${i + 1}] (${posts[i + 1].date})`);
    }
  });

  it('includes the known slug', () => {
    const posts = getAllPostsMeta();
    const slugs = posts.map((p) => p.slug);
    assert.ok(slugs.includes(KNOWN_SLUG));
  });
});
