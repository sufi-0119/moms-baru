import { test, expect } from '@playwright/test';

test('login page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Login MOMS' })).toBeVisible();
});

test('protected page redirects when logged out', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/$/);
});

test('login page has no horizontal overflow on mobile, tablet, and desktop', async ({ page }) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(0);
  }
});
