import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('demo user can login', async ({ page }) => {
        await page.goto('/tr/login');
        await page.getByLabel(/e-posta|email/i).fill('demo@example.com');
        await page.getByLabel(/^şifre$|^password$/i).fill('demo');
        await page.getByRole('button', { name: /giriş|login/i }).click();

        await page.waitForURL(/dashboard/);
        await expect(page.getByText(/hesab/i).first()).toBeVisible();
    });

    test('protected post-ad redirects when logged out', async ({ page }) => {
        await page.goto('/tr/post-ad');
        await page.waitForURL(/login/);
        await expect(page).toHaveURL(/login/);
    });
});
