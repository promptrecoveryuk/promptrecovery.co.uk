import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';

const DEFAULT_URL =
  'https://www.google.com/maps/place/Prompt+Recovery/@51.6803232,-0.4016088,640m/data=!3m1!1e3!4m18!1m9!3m8!1s0xa470618e0a0b3b7f:0xc97900f577ce9f7c!2sPrompt+Recovery!8m2!3d51.68032!4d-0.3967379!9m1!1b1!16s%2Fg%2F11xgsxw_k3!3m7!1s0xa470618e0a0b3b7f:0xc97900f577ce9f7c!8m2!3d51.68032!4d-0.3967379!9m1!1b1!16s%2Fg%2F11xgsxw_k3!5m2!1e1!1e4?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D';
const DEFAULT_OUT = 'src/app/data/static-google-reviews.json';
const DEFAULT_TIMEOUT_MS = 45_000;
const DEFAULT_IDLE_TIMEOUT_MS = 8_000;
const DEFAULT_MAX_SCROLLS = 300;
const DEFAULT_STABLE_ROUNDS = 3;
const DEFAULT_ARTIFACT_DIR = '/private/tmp/prompt-recovery-google-reviews-scraper';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const EXTRACTOR_SCRIPT = path.join(SCRIPT_DIR, 'browser-script.js');

function printHelp() {
  console.log(`Usage:
  npm run scrape-reviews -- [options]

Options:
  --url <url>              Google Maps reviews URL to scrape.
  --out <path>             Output JSON file. Defaults to ${DEFAULT_OUT}.
  --headed                 Run a visible browser. Useful if Google asks for consent or verification.
  --headless               Run headless. This is the default.
  --max-scrolls <number>   Stop after this many scroll passes. Defaults to ${DEFAULT_MAX_SCROLLS}.
  --timeout <ms>           Page/navigation timeout. Defaults to ${DEFAULT_TIMEOUT_MS}.
  --idle-timeout <ms>      Wait this long for more reviews after each scroll. Defaults to ${DEFAULT_IDLE_TIMEOUT_MS}.
  --slow-mo <ms>           Slow Playwright actions down for debugging.
  --artifact-dir <path>    Save failure screenshots/HTML here. Defaults to ${DEFAULT_ARTIFACT_DIR}.
  --user-data-dir <path>   Reuse a persistent browser profile, useful for signed-in Google Maps sessions.
  --channel <name>         Playwright browser channel, for example chrome.
  --debug                  Log detailed scroll state.
  --help                   Show this help text.

Examples:
  npm run scrape-reviews
  npm run scrape-reviews -- --headed
  npm run scrape-reviews -- --out /tmp/google-reviews.json --max-scrolls 5
`);
}

function readOptionValue(argv, index, flag) {
  const value = argv[index + 1];

  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${flag}`);
  }

  return value;
}

function readNumberOption(argv, index, flag) {
  const value = Number(readOptionValue(argv, index, flag));

  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${flag} must be a positive number`);
  }

  return value;
}

function parseArgs(argv) {
  const options = {
    url: DEFAULT_URL,
    out: DEFAULT_OUT,
    headless: true,
    maxScrolls: DEFAULT_MAX_SCROLLS,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    idleTimeoutMs: DEFAULT_IDLE_TIMEOUT_MS,
    slowMo: 0,
    artifactDir: DEFAULT_ARTIFACT_DIR,
    userDataDir: process.env.GOOGLE_MAPS_USER_DATA_DIR ?? null,
    channel: process.env.PLAYWRIGHT_BROWSER_CHANNEL ?? undefined,
    debug: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--headed') {
      options.headless = false;
    } else if (arg === '--headless') {
      options.headless = true;
    } else if (arg === '--debug') {
      options.debug = true;
    } else if (arg === '--url') {
      options.url = readOptionValue(argv, i, arg);
      i += 1;
    } else if (arg.startsWith('--url=')) {
      options.url = arg.slice('--url='.length);
    } else if (arg === '--out') {
      options.out = readOptionValue(argv, i, arg);
      i += 1;
    } else if (arg.startsWith('--out=')) {
      options.out = arg.slice('--out='.length);
    } else if (arg === '--max-scrolls') {
      options.maxScrolls = readNumberOption(argv, i, arg);
      i += 1;
    } else if (arg.startsWith('--max-scrolls=')) {
      options.maxScrolls = Number(arg.slice('--max-scrolls='.length));
    } else if (arg === '--timeout') {
      options.timeoutMs = readNumberOption(argv, i, arg);
      i += 1;
    } else if (arg.startsWith('--timeout=')) {
      options.timeoutMs = Number(arg.slice('--timeout='.length));
    } else if (arg === '--idle-timeout') {
      options.idleTimeoutMs = readNumberOption(argv, i, arg);
      i += 1;
    } else if (arg.startsWith('--idle-timeout=')) {
      options.idleTimeoutMs = Number(arg.slice('--idle-timeout='.length));
    } else if (arg === '--slow-mo') {
      options.slowMo = readNumberOption(argv, i, arg);
      i += 1;
    } else if (arg.startsWith('--slow-mo=')) {
      options.slowMo = Number(arg.slice('--slow-mo='.length));
    } else if (arg === '--artifact-dir') {
      options.artifactDir = readOptionValue(argv, i, arg);
      i += 1;
    } else if (arg.startsWith('--artifact-dir=')) {
      options.artifactDir = arg.slice('--artifact-dir='.length);
    } else if (arg === '--user-data-dir') {
      options.userDataDir = readOptionValue(argv, i, arg);
      i += 1;
    } else if (arg.startsWith('--user-data-dir=')) {
      options.userDataDir = arg.slice('--user-data-dir='.length);
    } else if (arg === '--channel') {
      options.channel = readOptionValue(argv, i, arg);
      i += 1;
    } else if (arg.startsWith('--channel=')) {
      options.channel = arg.slice('--channel='.length);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  for (const [name, value] of [
    ['--max-scrolls', options.maxScrolls],
    ['--timeout', options.timeoutMs],
    ['--idle-timeout', options.idleTimeoutMs],
    ['--slow-mo', options.slowMo],
  ]) {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`${name} must be a positive number`);
    }
  }

  return options;
}

async function clickFirstVisible(locators) {
  for (const locator of locators) {
    try {
      const count = Math.min(await locator.count(), 10);

      for (let i = 0; i < count; i += 1) {
        const item = locator.nth(i);

        if (await item.isVisible({ timeout: 2_000 })) {
          await item.click({ timeout: 5_000 });
          return true;
        }
      }
    } catch {
      // Try the next consent/reviews control shape.
    }
  }

  return false;
}

async function dismissGoogleConsent(page) {
  await clickFirstVisible([
    page.getByRole('button', { name: /^Reject all$/i }),
    page.getByRole('button', { name: /^Accept all$/i }),
    page.getByRole('button', { name: /^I agree$/i }),
    page.getByRole('button', { name: /^Agree$/i }),
  ]);
}

async function isLimitedGoogleMapsView(page) {
  return page.evaluate(() => document.body?.innerText.includes("You're seeing a limited view of Google Maps") ?? false);
}

async function clickRatingSummary(page) {
  return page.evaluate(() => {
    function isVisible(el) {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
    }

    const ratingEls = [...document.querySelectorAll('[aria-label*="stars"], [aria-label*="star"]')].filter((el) => {
      const ariaLabel = el.getAttribute('aria-label') ?? '';

      return isVisible(el) && /^\d(?:\.\d)?\s+stars?\s*$/i.test(ariaLabel);
    });

    for (const ratingEl of ratingEls) {
      const clickable =
        ratingEl.closest('button, a, [role="button"]') ??
        ratingEl.closest('[jsaction]') ??
        ratingEl.parentElement?.closest('[jsaction]');

      if (clickable && isVisible(clickable)) {
        clickable.click();
        return true;
      }

      ratingEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      return true;
    }

    return false;
  });
}

async function openReviewsPane(page) {
  const clickedReviewsControl = await clickFirstVisible([
    page.getByRole('tab', { name: /^Reviews\b/i }),
    page.getByRole('button', { name: /^Reviews\b/i }),
    page.getByRole('link', { name: /^Reviews\b/i }),
    page.getByText(/^Reviews$/i),
  ]);

  if (clickedReviewsControl) {
    return true;
  }

  return clickRatingSummary(page);
}

async function ensureReviewsAreVisible(page, timeoutMs) {
  try {
    await page.waitForSelector('div[data-review-id]', { timeout: timeoutMs });
    return;
  } catch {
    await openReviewsPane(page);

    try {
      await page.waitForSelector('div[data-review-id]', { timeout: timeoutMs });
    } catch (err) {
      if (await isLimitedGoogleMapsView(page)) {
        throw new Error(
          [
            'Google Maps is showing a limited view without review cards.',
            'Run with a persistent signed-in browser profile, for example:',
            'npm run scrape-reviews -- --headed --channel chrome --user-data-dir /private/tmp/prompt-recovery-google-maps-profile --timeout 120000',
            'After signing in, rerun the same command.',
          ].join('\n')
        );
      }

      throw err;
    }
  }
}

async function injectExtractor(page) {
  const extractor = await fs.readFile(EXTRACTOR_SCRIPT, 'utf8');

  await page.evaluate((script) => {
    window.__PROMPT_RECOVERY_GOOGLE_REVIEWS_AUTORUN__ = false;
    new Function(script)();

    if (typeof window.extractGoogleReviews !== 'function') {
      throw new Error('browser-script.js did not register window.extractGoogleReviews');
    }
  }, extractor);
}

async function expandMoreButtons(page) {
  return page.evaluate(() => {
    function isVisible(el) {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
    }

    const containers = [...document.querySelectorAll('div[data-review-id]')].filter(
      (el) => !el.parentElement?.closest('[data-review-id]')
    );
    let clicked = 0;

    for (const container of containers) {
      const moreButtons = [...container.querySelectorAll('button')].filter((button) => {
        const text = button.textContent?.trim() ?? '';
        const ariaLabel = button.getAttribute('aria-label')?.trim() ?? '';

        return isVisible(button) && (text === 'More' || ariaLabel === 'More');
      });

      for (const button of moreButtons) {
        button.click();
        clicked += 1;
      }
    }

    return clicked;
  });
}

async function getReviewState(page) {
  return page.evaluate(() => {
    function isVisible(el) {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
    }

    function topLevelReviews() {
      return [...document.querySelectorAll('div[data-review-id]')].filter(
        (el) => !el.parentElement?.closest('[data-review-id]')
      );
    }

    function findScroller() {
      const reviews = topLevelReviews();
      const seeds = [
        reviews[reviews.length - 1],
        reviews[0],
        document.querySelector('div[role="feed"]'),
        document.querySelector('.m6QErb.XiKgde'),
      ].filter(Boolean);

      for (const seed of seeds) {
        let el = seed;

        while (el && el !== document.body) {
          if (el.scrollHeight > el.clientHeight + 40) {
            return el;
          }

          el = el.parentElement;
        }
      }

      return document.scrollingElement ?? document.documentElement;
    }

    const scroller = findScroller();
    const progressBars = [...document.querySelectorAll('[role="progressbar"], .qjESne')].filter(isVisible);
    const bodyText = document.body?.innerText ?? '';

    return {
      count: topLevelReviews().length,
      scrollTop: scroller.scrollTop,
      scrollHeight: scroller.scrollHeight,
      clientHeight: scroller.clientHeight,
      atBottom: scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 8,
      spinnerCount: progressBars.length,
      endMarker:
        bodyText.includes("You've reached the end of the list") ||
        bodyText.includes('You have reached the end of the list'),
    };
  });
}

async function scrollReviewsToBottom(page) {
  return page.evaluate(() => {
    function topLevelReviews() {
      return [...document.querySelectorAll('div[data-review-id]')].filter(
        (el) => !el.parentElement?.closest('[data-review-id]')
      );
    }

    function findScroller() {
      const reviews = topLevelReviews();
      const seeds = [
        reviews[reviews.length - 1],
        reviews[0],
        document.querySelector('div[role="feed"]'),
        document.querySelector('.m6QErb.XiKgde'),
      ].filter(Boolean);

      for (const seed of seeds) {
        let el = seed;

        while (el && el !== document.body) {
          if (el.scrollHeight > el.clientHeight + 40) {
            return el;
          }

          el = el.parentElement;
        }
      }

      return document.scrollingElement ?? document.documentElement;
    }

    const reviews = topLevelReviews();
    const scroller = findScroller();

    scroller.scrollTop = scroller.scrollHeight;
    scroller.dispatchEvent(new Event('scroll', { bubbles: true }));
    reviews[reviews.length - 1]?.scrollIntoView({ block: 'end' });

    return {
      count: reviews.length,
      scrollTop: scroller.scrollTop,
      scrollHeight: scroller.scrollHeight,
      clientHeight: scroller.clientHeight,
    };
  });
}

async function waitForReviewsToSettle(page, previousState, idleTimeoutMs) {
  const startedAt = Date.now();
  let latestState = previousState;

  while (Date.now() - startedAt < idleTimeoutMs) {
    await page.waitForTimeout(500);
    latestState = await getReviewState(page);

    if (
      latestState.count > previousState.count ||
      latestState.scrollHeight > previousState.scrollHeight ||
      latestState.endMarker
    ) {
      while (Date.now() - startedAt < idleTimeoutMs && latestState.spinnerCount > 0) {
        await page.waitForTimeout(500);
        latestState = await getReviewState(page);
      }

      return latestState;
    }

    if (latestState.atBottom && latestState.spinnerCount === 0 && Date.now() - startedAt > 1_500) {
      return latestState;
    }
  }

  return latestState;
}

function logState(label, state) {
  console.log(
    `${label}: reviews=${state.count}, scrollTop=${Math.round(state.scrollTop)}, scrollHeight=${Math.round(
      state.scrollHeight
    )}, spinner=${state.spinnerCount}, atBottom=${state.atBottom}`
  );
}

async function collectAllReviews(page, options) {
  let stableRounds = 0;
  let previousState = await getReviewState(page);

  logState('Initial state', previousState);

  for (let scroll = 1; scroll <= options.maxScrolls; scroll += 1) {
    const expanded = await expandMoreButtons(page);

    if (expanded > 0) {
      await page.waitForTimeout(250);
    }

    const beforeScroll = await getReviewState(page);

    if (options.debug || expanded > 0) {
      console.log(`Pass ${scroll}: expanded ${expanded} More button(s)`);
    }

    await scrollReviewsToBottom(page);
    const afterScroll = await waitForReviewsToSettle(page, beforeScroll, options.idleTimeoutMs);

    if (options.debug) {
      logState(`Pass ${scroll}`, afterScroll);
    } else if (afterScroll.count !== beforeScroll.count) {
      console.log(`Loaded ${afterScroll.count} reviews`);
    }

    const contentChanged =
      afterScroll.count !== previousState.count || afterScroll.scrollHeight !== previousState.scrollHeight;

    if (afterScroll.endMarker) {
      console.log('Google Maps reported the end of the reviews list.');
      break;
    }

    if (!contentChanged && afterScroll.atBottom && afterScroll.spinnerCount === 0) {
      stableRounds += 1;
    } else {
      stableRounds = 0;
    }

    if (stableRounds >= DEFAULT_STABLE_ROUNDS) {
      console.log(`No new reviews loaded for ${stableRounds} consecutive pass(es).`);
      break;
    }

    previousState = afterScroll;
  }

  let expanded = 0;
  let totalExpanded = 0;

  do {
    expanded = await expandMoreButtons(page);
    totalExpanded += expanded;

    if (expanded > 0) {
      await page.waitForTimeout(250);
    }
  } while (expanded > 0);

  if (totalExpanded > 0) {
    console.log(`Expanded ${totalExpanded} remaining More button(s).`);
  }

  return page.evaluate(() => window.extractGoogleReviews());
}

async function writeReviews(outPath, reviews) {
  const resolvedOutPath = path.resolve(process.cwd(), outPath);

  await fs.mkdir(path.dirname(resolvedOutPath), { recursive: true });
  await fs.writeFile(resolvedOutPath, `${JSON.stringify(reviews, null, 2)}\n`, 'utf8');

  return resolvedOutPath;
}

async function saveFailureArtifacts(page, artifactDir) {
  const resolvedArtifactDir = path.resolve(process.cwd(), artifactDir);
  const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
  const screenshotPath = path.join(resolvedArtifactDir, `google-reviews-${timestamp}.png`);
  const htmlPath = path.join(resolvedArtifactDir, `google-reviews-${timestamp}.html`);

  await fs.mkdir(resolvedArtifactDir, { recursive: true });

  try {
    await page.screenshot({ path: screenshotPath, fullPage: true });
  } catch (err) {
    console.error('Could not save failure screenshot:', err);
  }

  try {
    await fs.writeFile(htmlPath, await page.content(), 'utf8');
  } catch (err) {
    console.error('Could not save failure HTML:', err);
  }

  console.error(`Saved scraper failure artifacts to ${resolvedArtifactDir}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const contextOptions = {
    bypassCSP: true,
    locale: 'en-GB',
    timezoneId: 'Europe/London',
    viewport: { width: 1440, height: 1200 },
  };
  const browserLaunchOptions = {
    channel: options.channel,
    headless: options.headless,
    slowMo: options.slowMo,
  };
  const browser = options.userDataDir ? null : await chromium.launch(browserLaunchOptions);
  let context;
  let page;

  try {
    context = options.userDataDir
      ? await chromium.launchPersistentContext(path.resolve(process.cwd(), options.userDataDir), {
          ...contextOptions,
          ...browserLaunchOptions,
        })
      : await browser.newContext(contextOptions);
    page = context.pages()[0] ?? (await context.newPage());

    page.setDefaultTimeout(options.timeoutMs);

    console.log(`Opening Google Maps reviews URL (${options.headless ? 'headless' : 'headed'} mode)`);
    await page.goto(options.url, { waitUntil: 'domcontentloaded', timeout: options.timeoutMs });
    await dismissGoogleConsent(page);
    await ensureReviewsAreVisible(page, options.timeoutMs);
    await injectExtractor(page);

    const reviews = await collectAllReviews(page, options);
    const outPath = await writeReviews(options.out, reviews);
    const reviewPhotoCount = reviews.filter((review) => review.reviewPhoto).length;

    console.log(`Wrote ${reviews.length} reviews to ${outPath} (${reviewPhotoCount} with review photos)`);
  } catch (err) {
    if (page) {
      await saveFailureArtifacts(page, options.artifactDir);
    }

    throw err;
  } finally {
    await context?.close();
    await browser?.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
