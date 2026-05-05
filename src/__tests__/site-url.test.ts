import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { joinUrl, normalizeBasePath, resolveSiteUrl } from '../lib/site-url';

describe('normalizeBasePath()', () => {
  it('normalizes optional path prefixes for static hosts', () => {
    assert.equal(normalizeBasePath(''), '');
    assert.equal(normalizeBasePath('/promptrecovery.co.uk/'), '/promptrecovery.co.uk');
    assert.equal(normalizeBasePath('promptrecovery.co.uk'), '/promptrecovery.co.uk');
  });
});

describe('joinUrl()', () => {
  it('joins an origin and path without duplicate slashes', () => {
    assert.equal(
      joinUrl('https://promptrecoveryuk.github.io/', '/promptrecovery.co.uk'),
      'https://promptrecoveryuk.github.io/promptrecovery.co.uk'
    );
    assert.equal(joinUrl('https://promptrecovery.co.uk', ''), 'https://promptrecovery.co.uk');
  });
});

describe('resolveSiteUrl()', () => {
  it('builds the regular GitHub Pages project URL from origin and base path', () => {
    assert.equal(
      resolveSiteUrl('https://promptrecoveryuk.github.io', '/promptrecovery.co.uk'),
      'https://promptrecoveryuk.github.io/promptrecovery.co.uk'
    );
  });
});
