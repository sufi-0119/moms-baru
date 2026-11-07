import { test, expect } from '@playwright/test';
import { toEmployeesCsv } from '../lib/demo/export';
import { createDemoSeed } from '../lib/demo/store';

const NOW = new Date('2026-11-05T00:00:00.000Z');

test('employee csv has header and escaped values', () => {
  const seed = createDemoSeed(NOW);
  const row = { ...seed.employees[0], name: 'Budi, "Demo"' };
  const csv = toEmployeesCsv([row]);
  expect(csv.split('\n')[0]).toContain('Nama');
  expect(csv).toContain('"Budi, ""Demo"""');
});
