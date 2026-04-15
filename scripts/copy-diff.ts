import { execFile } from 'node:child_process';
import { access, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { promisify } from 'node:util';

import { chromium, type Page } from '@playwright/test';

import { copyDiffTargets, type CopyDiffTarget } from './copy-diff.targets';

const execFileAsync = promisify(execFile);

const ARTIFACT_ROOT = resolve('artifacts', 'copy-diff');
const BASELINE_DIR = join(ARTIFACT_ROOT, 'baseline');
const CURRENT_DIR = join(ARTIFACT_ROOT, 'current');
const DIFF_DIR = join(ARTIFACT_ROOT, 'diff');
const REPORT_PATH = join(ARTIFACT_ROOT, 'report.html');

type CliOptions = {
  baseUrl: string;
  command: 'capture' | 'compare' | 'help';
  snapshotSet: 'baseline' | 'current';
  targets: string[] | null;
};

function parseArgs(argv: string[]): CliOptions {
  const [commandArg, ...rest] = argv;
  const command = commandArg === 'capture' || commandArg === 'compare' ? commandArg : 'help';
  const options: CliOptions = {
    baseUrl: 'http://localhost:3000',
    command,
    snapshotSet: 'current',
    targets: null,
  };

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg === '--base-url') {
      options.baseUrl = rest[index + 1] ?? options.baseUrl;
      index += 1;
    } else if (arg === '--snapshot-set') {
      const snapshotSet = rest[index + 1];
      if (snapshotSet === 'baseline' || snapshotSet === 'current') {
        options.snapshotSet = snapshotSet;
      }
      index += 1;
    } else if (arg === '--targets') {
      const targetArg = rest[index + 1] ?? '';
      options.targets = targetArg
        .split(',')
        .map((target) => target.trim())
        .filter(Boolean);
      index += 1;
    }
  }

  return options;
}

function printHelp(): void {
  process.stdout.write(`Copy diff workflow

Usage:
  npm run copy-diff:baseline
  npm run copy-diff:baseline:live
  npm run copy-diff:current
  npm run copy-diff:compare
  npm run copy-diff -- capture --snapshot-set current --targets home-page,navbar

Notes:
  - Requires a local dev server at http://localhost:3000 by default.
  - Live baseline capture uses https://promptrecovery.co.uk.
  - Install ImageMagick to generate highlighted diff images.
  - Artifacts are written to artifacts/copy-diff/.
`);
}

async function assertServerAvailable(baseUrl: string): Promise<void> {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error(`Unexpected status ${response.status}`);
    }
  } catch (error) {
    throw new Error(
      `Could not reach ${baseUrl}. Start the site first with "npm run dev", then rerun the copy-diff command.`,
      { cause: error },
    );
  }
}

async function ensureDir(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}

async function stabilisePage(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
        scroll-behavior: auto !important;
      }

      [data-carousel-prev],
      [data-carousel-next],
      [data-carousel-slide-to] {
        visibility: hidden !important;
      }

      [data-carousel-item] {
        transform: none !important;
      }

      [data-carousel-item]:not([data-carousel-item="active"]) {
        display: none !important;
      }
    `,
  });

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
}

async function applyTargetStyles(page: Page, target: CopyDiffTarget): Promise<void> {
  if (target.kind !== 'page' || !target.hideSelectors || target.hideSelectors.length === 0) return;

  const rules = target.hideSelectors.map((selector) => `${selector} { display: none !important; }`).join('\n');
  await page.addStyleTag({ content: rules });
}

async function captureSnapshots(options: CliOptions): Promise<void> {
  await assertServerAvailable(options.baseUrl);

  const outputDir = options.snapshotSet === 'baseline' ? BASELINE_DIR : CURRENT_DIR;
  await ensureDir(outputDir);

  const activeTargets = copyDiffTargets.filter(
    (target) => options.targets === null || options.targets.includes(target.id),
  );

  if (activeTargets.length === 0) {
    throw new Error('No matching copy-diff targets found.');
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1600 },
  });

  for (const target of activeTargets) {
    const url = new URL(target.route, options.baseUrl).toString();
    await page.goto(url, { waitUntil: 'networkidle' });
    await stabilisePage(page);
    await applyTargetStyles(page, target);

    if (target.kind === 'page') {
      await page.screenshot({
        animations: 'disabled',
        fullPage: true,
        path: join(outputDir, `${target.id}.png`),
      });
    } else {
      const locator = target.locate(page);
      await locator.scrollIntoViewIfNeeded();
      await locator.screenshot({
        animations: 'disabled',
        path: join(outputDir, `${target.id}.png`),
      });
    }

    process.stdout.write(`Captured ${target.id} -> ${relative(resolve(), join(outputDir, `${target.id}.png`))}\n`);
  }

  await browser.close();
}

async function resolveImageMagickCommand(): Promise<{ argsPrefix: string[]; command: string } | null> {
  try {
    await execFileAsync('magick', ['-version']);
    return { command: 'magick', argsPrefix: ['compare'] };
  } catch {}

  try {
    await execFileAsync('compare', ['-version']);
    return { command: 'compare', argsPrefix: [] };
  } catch {}

  return null;
}

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

async function listPngFiles(directory: string): Promise<string[]> {
  try {
    const files = await readdir(directory);
    return files.filter((file) => file.endsWith('.png')).sort();
  } catch {
    return [];
  }
}

async function compareSnapshots(): Promise<void> {
  await ensureDir(DIFF_DIR);
  const imagemagick = await resolveImageMagickCommand();

  const baselineFiles = await listPngFiles(BASELINE_DIR);
  const currentFiles = await listPngFiles(CURRENT_DIR);
  const imageNames = [...new Set([...baselineFiles, ...currentFiles])];

  const reportRows: string[] = [];

  for (const imageName of imageNames) {
    const baselinePath = join(BASELINE_DIR, imageName);
    const currentPath = join(CURRENT_DIR, imageName);
    const diffPath = join(DIFF_DIR, imageName);

    const baselineExists = await exists(baselinePath);
    const currentExists = await exists(currentPath);

    let status = 'matched';
    let diffCreated = false;

    if (!baselineExists || !currentExists) {
      status = !baselineExists ? 'missing baseline' : 'missing current';
    } else if (imagemagick) {
      try {
        await execFileAsync(imagemagick.command, [
          ...imagemagick.argsPrefix,
          '-metric',
          'AE',
          '-highlight-color',
          '#ff3366',
          '-lowlight-color',
          '#ffffff',
          baselinePath,
          currentPath,
          diffPath,
        ]);
        diffCreated = true;
      } catch (error) {
        const stderr = typeof error === 'object' && error && 'stderr' in error ? String(error.stderr) : '';
        const changedPixels = stderr.trim();
        if (changedPixels === '0') {
          status = 'no visible change';
          await rm(diffPath, { force: true });
        } else {
          status = `${changedPixels} changed pixels`;
          diffCreated = true;
        }
      }
    } else {
      status = 'ImageMagick not installed';
    }

    reportRows.push(`
      <section class="target">
        <h2>${escapeHtml(imageName.replace(/\.png$/, ''))}</h2>
        <p class="status">${escapeHtml(status)}</p>
        <div class="grid">
          <figure>
            <figcaption>Baseline</figcaption>
            ${baselineExists ? `<img src="${escapeHtml(relative(ARTIFACT_ROOT, baselinePath))}" alt="Baseline ${escapeHtml(imageName)}">` : '<p>Missing</p>'}
          </figure>
          <figure>
            <figcaption>Current</figcaption>
            ${currentExists ? `<img src="${escapeHtml(relative(ARTIFACT_ROOT, currentPath))}" alt="Current ${escapeHtml(imageName)}">` : '<p>Missing</p>'}
          </figure>
          <figure>
            <figcaption>Diff</figcaption>
            ${
              diffCreated
                ? `<img src="${escapeHtml(relative(ARTIFACT_ROOT, diffPath))}" alt="Diff ${escapeHtml(imageName)}">`
                : `<p>${escapeHtml(status)}</p>`
            }
          </figure>
        </div>
      </section>
    `);
  }

  await writeFile(
    REPORT_PATH,
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Copy Diff Report</title>
    <style>
      body { font-family: sans-serif; margin: 24px; color: #111827; }
      h1 { margin-bottom: 8px; }
      .meta { color: #4b5563; margin-bottom: 24px; }
      .target { border-top: 1px solid #d1d5db; padding-top: 24px; margin-top: 24px; }
      .status { font-weight: 600; }
      .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
      figure { margin: 0; }
      figcaption { font-weight: 600; margin-bottom: 8px; }
      img { border: 1px solid #d1d5db; max-width: 100%; height: auto; }
    </style>
  </head>
  <body>
    <h1>Copy Diff Report</h1>
    <p class="meta">Baseline: ${escapeHtml(relative(resolve(), BASELINE_DIR))} | Current: ${escapeHtml(relative(resolve(), CURRENT_DIR))}</p>
    ${reportRows.join('\n')}
  </body>
</html>`,
  );

  process.stdout.write(`Report written to ${relative(resolve(), REPORT_PATH)}\n`);
  if (!imagemagick) {
    process.stdout.write('ImageMagick not found. Install it locally to generate highlighted diff images.\n');
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (options.command === 'help') {
    printHelp();
    return;
  }

  if (options.command === 'capture') {
    await captureSnapshots(options);
    return;
  }

  await compareSnapshots();
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
