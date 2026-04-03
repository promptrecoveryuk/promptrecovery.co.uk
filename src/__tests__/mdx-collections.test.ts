import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, describe, it } from 'node:test';

import { getCollectionMeta, getCollectionSlugs, getMdxContent, getMdxMeta } from '../lib/mdx-collections';
import type { BaseContentMeta } from '../types';

// These tests exercise the generic collection helpers in isolation using temp
// files, which makes them fast and independent of the real site content.
const testDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'promptrecovery-mdx-'));

after(() => {
  fs.rmSync(testDirectory, { recursive: true, force: true });
});

fs.writeFileSync(
  path.join(testDirectory, 'alpha.mdx'),
  `---
title: Alpha
date: "2026-04-01"
description: Alpha description
imageIndex: 2
author: Nick
---

This is alpha content.
`
);

fs.writeFileSync(
  path.join(testDirectory, 'beta.mdx'),
  `---
title: Beta
date: "2026-04-02"
description: Beta description
imageIndex: 3
---

This is beta content.
`
);

function parseFrontmatter(slug: string, data: Record<string, unknown>): BaseContentMeta {
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    imageIndex: data.imageIndex as number,
    author: (data.author as string) ?? 'Nick',
  };
}

describe('mdx collection helpers', () => {
  it('reads slugs from a directory', () => {
    const slugs = getCollectionSlugs(testDirectory);
    assert.deepEqual(slugs.sort(), ['alpha', 'beta']);
  });

  it('reads metadata for a single mdx file', () => {
    const meta = getMdxMeta(testDirectory, 'alpha', parseFrontmatter);

    assert.equal(meta.slug, 'alpha');
    assert.equal(meta.title, 'Alpha');
    assert.equal(meta.imageIndex, 2);
    assert.equal(meta.author, 'Nick');
  });

  it('reads metadata and content for a single mdx file', () => {
    const result = getMdxContent(testDirectory, 'beta', parseFrontmatter);

    assert.equal(result.meta.slug, 'beta');
    assert.equal(result.meta.author, 'Nick', 'default author should be applied by the parser');
    assert.ok(result.content.includes('This is beta content.'));
    assert.ok(!result.content.includes('title:'), 'returned content should not include frontmatter');
  });

  it('collects metadata across all mdx files', () => {
    const metadata = getCollectionMeta(testDirectory, parseFrontmatter);

    assert.equal(metadata.length, 2);
    assert.deepEqual(metadata.map((item) => item.slug).sort(), ['alpha', 'beta']);
  });
});
