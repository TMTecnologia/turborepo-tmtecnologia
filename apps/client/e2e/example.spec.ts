import { expect, test } from '@playwright/test';

test('should navigate to the about page', async ({ page }) => {
  await page.goto('/');
  // The new page should contain an h1 with "About Page"
  await expect(page.locator('h1')).toContainText('Create T3 App');
});
