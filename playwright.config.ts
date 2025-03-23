import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';
dotenv.config({ path: `./env/.env.${environment}` });

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Timeout for each test, includes test, hooks and fixtures */
  timeout: 60 * 1000,
  /* Timeout for each assertion: */
  expect: {
    timeout: 50000,
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
  },
  outputDir: 'test-results/',
});

