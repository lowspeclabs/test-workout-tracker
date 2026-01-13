
import { test, expect } from '@playwright/test';

test('Verify Stats Page Charts', async ({ page }) => {
  await page.goto('http://localhost:3000/stats');
  await page.waitForSelector('.headline');

  // Wait for canvas elements (charts) to be present
  await page.waitForSelector('canvas');

  // Check for Stat Cards
  await expect(page.locator('text=Strength progression')).toBeVisible();
  await expect(page.locator('text=Weekly adherence')).toBeVisible();
  await expect(page.locator('text=Training focus')).toBeVisible();

  await page.screenshot({ path: '/home/jules/verification/stats_charts.png', fullPage: true });
});
