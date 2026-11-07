import { test, expect } from '@playwright/test';
import {
  demoReducer,
  loadDemoState,
  saveDemoState,
  createDemoSeed,
} from '../lib/demo/store';

const FIXED_NOW = new Date('2026-11-05T00:00:00.000Z');

test('seed identifiers are fictional', () => {
  const seed = createDemoSeed(FIXED_NOW);
  for (const e of seed.employees) {
    expect(e.nikKtp.startsWith('0000')).toBe(true);
    expect(e.noKk.startsWith('0000')).toBe(true);
    expect(e.phone.startsWith('0800')).toBe(true);
    expect(e.emailPersonal.endsWith('@example.test')).toBe(true);
  }
});

test('seed deadlines are relative to now', () => {
  const seed = createDemoSeed(FIXED_NOW);
  const deadlines = seed.reminders.map((r) => new Date(r.deadline).getTime());
  expect(deadlines.some((t) => Math.abs(t - FIXED_NOW.getTime()) < 30 * 86400000)).toBe(true);
});

test('adding an employee is immutable', () => {
  const seed = createDemoSeed(FIXED_NOW);
  const before = seed.employees.length;
  const next = demoReducer(seed, { type: 'employee/add', employee: seed.employees[0] });
  expect(seed.employees).toHaveLength(before);
  expect(next.employees).toHaveLength(before + 1);
});

test('load returns seed for missing or corrupt storage', () => {
  const a = loadDemoState({ getItem: () => null });
  const b = loadDemoState({ getItem: () => '{bad json' });
  expect(a.version).toBe(1);
  expect(b.version).toBe(1);
});

test('save and load round-trip', () => {
  const seed = createDemoSeed(FIXED_NOW);
  let raw: string | null = null;
  saveDemoState(seed, { setItem: (_k, v) => { raw = v; } });
  const loaded = loadDemoState({ getItem: () => raw });
  expect(loaded.expenses).toHaveLength(seed.expenses.length);
});

test('reset restores the original seed count', () => {
  const seed = createDemoSeed(FIXED_NOW);
  const changed = demoReducer(seed, { type: 'expense/delete', id: seed.expenses[0].id });
  const reset = demoReducer(changed, { type: 'demo/reset', state: seed });
  expect(reset.expenses).toHaveLength(seed.expenses.length);
});
