import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import sitemap from '../app/sitemap';

describe('sitemap()', () => {
  it('includes the main collection routes with the correct pluralized paths', () => {
    const urls = sitemap().map((entry) => entry.url);

    assert.ok(urls.includes('https://promptrecovery.co.uk/services/'));
    assert.ok(urls.includes('https://promptrecovery.co.uk/blog/'));
    assert.ok(urls.includes('https://promptrecovery.co.uk/areas/'));
    assert.ok(!urls.includes('https://promptrecovery.co.uk/area/'));
  });

  it('emits unique trailing-slash URLs', () => {
    const urls = sitemap().map((entry) => entry.url);

    assert.equal(new Set(urls).size, urls.length, 'expected sitemap URLs to be unique');

    for (const url of urls) {
      assert.ok(url.endsWith('/'), `expected "${url}" to end with a trailing slash`);
    }
  });

  it('includes the known MDX-backed detail pages', () => {
    const urls = sitemap().map((entry) => entry.url);

    assert.ok(urls.includes('https://promptrecovery.co.uk/blog/what-to-do-when-your-car-breaks-down-on-the-motorway/'));
    assert.ok(urls.includes('https://promptrecovery.co.uk/services/breakdown-recovery-watford/'));
    assert.ok(urls.includes('https://promptrecovery.co.uk/areas/rickmansworth/'));
  });
});
