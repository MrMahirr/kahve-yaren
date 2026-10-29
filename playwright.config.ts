import { defineConfig, devices } from '@playwright/test'

const PORT = 4173

// Tarayıcı testleri build edilmiş sürümde (vite preview) çalışır.
// Ayrı tarayıcı indirmemek için sistemdeki Chrome kullanılır (channel: 'chrome').
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // Her test ayrı bir Chrome açar; yerel makinede aşırı paralellik zamanlamaları bozuyor.
  workers: 4,
  expect: { timeout: 10_000 },
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'masaustu', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    { name: 'mobil', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
