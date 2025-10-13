import { defineConfig } from '@playwright/test';


export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
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

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'api-testing',
      //dependencies:["smoke-tests"]
    },
    {
      name: 'smoke-tests',
      testDir: './tests/smoke-tests',
    },
  ],
});
