import type {PlaywrightTestConfig} from '@playwright/test';
import {devices} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const {CI} = process.env;
const IS_CI = CI === 'true';

// macOS 27 privacy protection blocks Firefox from reading
// ~/Library/Application Support/Firefox, so it exits with
// "Could not find profile folder" before using Playwright's -profile.
// Give it a stand-in home. The real profile comes from -profile, so processes
// can share one fixed path. This config loads in the runner and every worker, so a
// unique directory per load would pile up, and deleting them on exit is
// unreliable (rmSync fails with ENOTEMPTY and hung worker shutdown).
function getFirefoxHome(): string {
  const home = join(tmpdir(), 'pw-firefox-home');
  mkdirSync(home, {recursive: true});
  return home;
}

const firefoxLaunchOptions =
  process.platform === 'darwin'
    ? {
        env: {
          ...process.env,
          CFFIXED_USER_HOME: getFirefoxHome(),
        },
      }
    : {};

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './src/__tests__',
  /* Maximum time one test can run for. */
  timeout: 150000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: IS_CI ? 4 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: firefoxLaunchOptions,
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
  webServer: IS_CI
    ? {
        command: 'pnpm run start-test-server',
        port: 4000,
        reuseExistingServer: true,
        timeout: 120 * 1000,
      }
    : undefined,
};

export default config;
