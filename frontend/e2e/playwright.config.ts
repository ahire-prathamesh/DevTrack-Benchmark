import { defineConfig, devices } from '@playwright/test';

const pythonCmd = process.platform === 'win32' ? '.venv\\Scripts\\python.exe' : '.venv/bin/python';

export default defineConfig({
  testDir: './',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: `${pythonCmd} -m backend.app`,
      url: 'http://localhost:5000/api/projects',
      cwd: '../../',
      env: {
        DEVTRACK_DB: 'backend/test_e2e.db',
      },
      reuseExistingServer: !process.env.CI,
      timeout: 15000,
    },
    {
      command: 'npm.cmd run dev',
      url: 'http://localhost:5173',
      cwd: '../',
      reuseExistingServer: !process.env.CI,
      timeout: 15000,
    },
  ],
});
