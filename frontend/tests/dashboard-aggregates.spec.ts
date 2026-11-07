import { test, expect } from '@playwright/test';
import { buildDashboardData } from '../lib/demo/aggregates';
import { createDemoSeed } from '../lib/demo/store';

const NOW = new Date('2026-11-05T00:00:00.000Z');
const EMPTY = {
  year: 'ALL',
  quarter: 'ALL',
  month: 'ALL',
  category: 'ALL',
  status: 'ALL',
  from: '',
  to: '',
};

test('cards follow seed data', () => {
  const seed = createDemoSeed(NOW);
  const data = buildDashboardData(seed, EMPTY, NOW);
  expect(data.cards.totalEmployees).toBe(seed.employees.filter((e) => e.category === 'Karyawan').length);
  expect(data.cards.totalDrivers).toBe(seed.employees.filter((e) => e.category === 'Driver').length);
  expect(data.cards.totalExpenses).toBe(seed.expenses.reduce((sum, e) => sum + e.amount, 0));
});

test('quarter filter narrows expense series', () => {
  const seed = createDemoSeed(NOW);
  const q4 = buildDashboardData(seed, { ...EMPTY, year: '2026', quarter: 'Q4' }, NOW);
  expect(
    q4.expenseMonthly.every(
      (p) => p.label.startsWith('Okt') || p.label.startsWith('Nov') || p.label.startsWith('Des'),
    ),
  ).toBe(true);
});
