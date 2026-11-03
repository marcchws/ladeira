import { defineConfig, devices } from '@playwright/test';

// Runs against the production build: `npm run build` first. The preview server is started here, unless BASE_URL
// points at one already running (Astro refuses a second preview of the same project).
const external = process.env.BASE_URL;
const port = 4377;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: external ?? `http://localhost:${port}` },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: external ? undefined : { command: `npx astro preview --port ${port}`, url: `http://localhost:${port}`, reuseExistingServer: false },
});
