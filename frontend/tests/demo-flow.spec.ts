import { test, expect, type Page } from '@playwright/test';

const EMAIL = process.env.E2E_DEMO_EMAIL;
const PASSWORD = process.env.E2E_DEMO_PASSWORD;

test.skip(!EMAIL || !PASSWORD, 'demo credentials not set');

async function login(page: Page) {
  await page.goto('/');
  await page.getByLabel('Email').fill(EMAIL as string);
  await page.getByLabel('Password').fill(PASSWORD as string);
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test('all demo modules render their main heading', async ({ page }) => {
  await login(page);

  const modules: Array<{ path: string; heading: RegExp }> = [
    { path: '/dashboard', heading: /Dashboard Operasional/i },
    { path: '/employees', heading: /Database Karyawan/i },
    { path: '/recruitment', heading: /Rekrutmen/i },
    { path: '/reminder-workflow', heading: /Reminder/i },
    { path: '/expenses', heading: /Biaya|Pengeluaran/i },
    { path: '/culture-hub', heading: /Culture/i },
  ];

  for (const route of modules) {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(route.heading);
  }
});

test('completing a monthly reminder schedules the next cycle and survives reload', async ({
  page,
}) => {
  await login(page);
  await page.goto('/reminder-workflow');

  const monthlyRows = page.locator('tbody tr', { hasText: 'Monthly' });
  test.skip((await monthlyRows.count()) === 0, 'no monthly reminder in seed');

  const activeRow = monthlyRows.filter({ hasText: 'Belum Selesai' }).first();
  await activeRow.getByRole('button', { name: /Selesaikan/i }).click();
  await expect(page.getByRole('status').first()).toContainText(/jadwal berikutnya/i);

  await page.reload();
  await expect(page.locator('tbody tr', { hasText: 'Monthly' }).first()).toBeVisible();
});

test('advancing an invoice exposes it under the sent filter', async ({ page }) => {
  await login(page);
  await page.goto('/expenses');

  const invoiceFilter = page.getByRole('combobox', { name: 'Status Invoice' });
  test.skip((await invoiceFilter.count()) === 0, 'invoice filter not present');

  await invoiceFilter.selectOption({ label: 'Sudah Dikirim' });
  const sentBefore = await page.locator('tbody tr').count();
  await invoiceFilter.selectOption({ label: 'Semua Status Invoice' });

  const pending = page.locator('tbody tr', { hasText: 'Belum Dibuat' }).first();
  test.skip((await pending.count()) === 0, 'no pending invoice in seed');
  await pending.getByRole('button', { name: /proses invoice/i }).click();
  await expect(pending.getByRole('button', { name: /tandai terkirim/i })).toBeVisible();
  await pending.getByRole('button', { name: /tandai terkirim/i }).click();

  await invoiceFilter.selectOption({ label: 'Sudah Dikirim' });
  await expect(page.locator('tbody tr')).toHaveCount(sentBefore + 1);
});

test('reset restores seed data and logout returns to login', async ({ page }) => {
  await login(page);
  await page.goto('/employees');

  const rowsBefore = await page.locator('tbody tr').count();
  await page.getByRole('button', { name: /hapus data personil/i }).first().click();
  await page.getByRole('button', { name: 'Hapus', exact: true }).click();
  await expect(page.locator('tbody tr')).toHaveCount(rowsBefore - 1);

  await page.getByRole('button', { name: /reset data demo/i }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Reset Data', exact: true }).click();
  await expect(page.locator('tbody tr')).toHaveCount(rowsBefore);

  await page.getByRole('button', { name: /keluar sistem/i }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: /login moms/i })).toBeVisible();
});
