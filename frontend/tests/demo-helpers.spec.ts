import { test, expect } from '@playwright/test';
import { toEmployeesCsv } from '../lib/demo/export';
import { getRecruitmentProgress, getEligibility } from '../lib/demo/recruitment';
import { getReminderStage, nextReminderDeadline } from '../lib/demo/reminders';
import { createDemoSeed } from '../lib/demo/store';

const NOW = new Date('2026-11-05T00:00:00.000Z');

test('employee csv has header and escaped values', () => {
  const seed = createDemoSeed(NOW);
  const row = { ...seed.employees[0], name: 'Budi, "Demo"' };
  const csv = toEmployeesCsv([row]);
  expect(csv.split('\n')[0]).toContain('Nama');
  expect(csv).toContain('"Budi, ""Demo"""');
});

test('recruitment progress counts completed stages', () => {
  const seed = createDemoSeed(NOW);
  const stages = seed.candidates[0].stages_data;
  expect(getRecruitmentProgress(stages)).toBeGreaterThanOrEqual(0);
  expect(getRecruitmentProgress(stages)).toBeLessThanOrEqual(100);
  expect(getEligibility(100)).toBe('Layak Kerja');
  expect(getEligibility(99)).toBe('Belum Layak Kerja');
});

test('reminder stage follows deadline distance', () => {
  expect(getReminderStage('2026-11-12', NOW)).toBe('H-7');
  expect(getReminderStage('2026-11-08', NOW)).toBe('H-3');
  expect(getReminderStage('2026-11-06', NOW)).toBe('H-1');
  expect(getReminderStage('2026-11-05', NOW)).toBe('Hari H');
  expect(getReminderStage('2026-11-04', NOW)).toBe('Terlambat');
});

test('repeating reminders advance by cycle', () => {
  expect(nextReminderDeadline('2026-11-05', 'Monthly')).toBe('2026-12-05');
  expect(nextReminderDeadline('2026-11-05', 'Quarterly')).toBe('2027-02-05');
  expect(nextReminderDeadline('2026-11-05', 'Yearly')).toBe('2027-11-05');
  expect(nextReminderDeadline('2026-11-05', 'Tidak berulang')).toBeNull();
});
