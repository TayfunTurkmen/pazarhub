import { test, expect } from '@playwright/test';

test.describe('Homepage & Search', () => {
    test('homepage loads and search works', async ({ page }) => {
        await page.goto('/tr');
        await expect(page.locator('body')).toBeVisible();

        await page.goto('/tr/search?query=daire');
        await expect(page.getByText(/ilan/i).first()).toBeVisible();
    });

    test('listing detail page opens', async ({ page }) => {
        await page.goto('/tr/listing/1001');
        await expect(page.locator('h1')).toContainText(/.+/);
    });
});
