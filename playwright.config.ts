import { defineConfig, devices } from '@playwright/test';

/**
 * Always uses `next dev` as the test server — locally and in CI.
 *
 * Why not `npx serve out` in CI?
 *   Next.js static exports with `basePath` set embed asset paths like
 *   `/_next/...` in the HTML, but `serve out` maps requests
 *   to the `out/` root where `_next/` lives at `/_next/`, not
 *   `/_next/`. The JS never loads, React never hydrates, and
 *   any test that submits the form fails. `next dev` handles `basePath` routing
 *   correctly and avoids this entirely.
 *
 * Reuses an already-running dev server locally to avoid a slow cold start.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // Fail the build if any test has `test.only` committed accidentally.
  forbidOnly: !!process.env.CI,
  // Retry failed tests once in CI to reduce noise from flakiness.
  retries: process.env.CI ? 1 : 0,
  // Single worker in CI to avoid resource contention; auto locally.
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: 'http://localhost:3000',
    // Record a trace on the first retry to aid debugging in CI.
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
});
