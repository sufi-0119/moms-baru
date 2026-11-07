import { test, expect } from '@playwright/test';

test('login page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Login MOMS' })).toBeVisible();
});

test('protected page redirects when logged out', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/$/);
});
