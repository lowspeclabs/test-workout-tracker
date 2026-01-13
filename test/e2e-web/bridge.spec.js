
import { test, expect } from '@playwright/test';

test('Webview Shell: JS Bridge Injection', async ({ page }) => {
  // 1. Start the React app (assuming it's running on localhost:3000 as per README)
  // Since we are running this in a CI/test environment, we ensure the dev server is accessible.
  // Note: This test assumes `npm run dev` is running on port 3000.
  // I will check the actual port in the run step.
  await page.goto('http://localhost:3000/profile');

  // 2. Inject the mock Android Interface
  await page.evaluate(() => {
    window.Android = {
      showToast: (msg) => {
        window.__toastMessage = msg; // Store for verification
      },
      requestNotificationPermission: () => {},
      getAppVersion: () => '1.0.0-mock'
    };
  });

  // 3. Click the "Test Native Toast" button
  // We use the text selector "Test Native Toast"
  await page.click('text=Test Native Toast');

  // 4. Verify the bridge was called
  const toastMsg = await page.evaluate(() => window.__toastMessage);
  expect(toastMsg).toBe('Hello from React!');
});
