import { defineConfig } from '@playwright/test';


export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  maxFailures: process.env.CI ? 3 : undefined,
  reporter: [ ['html', { open: 'always' }],
              ['list']
            ],
  use: {
    trace: 'on-first-retry',
    //for automatic authorization
    extraHTTPHeaders: {
      'Authorization': `Token ${process.env.USER_TOKEN}`
    },
    httpCredentials: {
      username: '',
      password: ''
    }
  },

  projects: [
    {
      name: 'api-testing',
      //dependencies:["smoke-tests"]
    },
    {
      name: 'ui-testing',
      testMatch: /.*ui-tests.*/,
      use: {
        baseURL: 'https://conduit.bondaracademy.com/',
        browserName: 'chromium',
        headless: true,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        video: 'on-first-retry',
        screenshot: 'on',
        trace: 'on',
      },
    },
    {
      name: 'smoke-tests',
      testMatch: './tests/smoke-tests',
    },
  ],
});
