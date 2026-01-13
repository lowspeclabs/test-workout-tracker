import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "test/e2e-web",
  retries: 1,
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
  },
  reporter: [["list"], ["html", { outputFolder: "test-results/playwright" }]],
});
