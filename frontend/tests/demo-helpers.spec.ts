import { test, expect } from '@playwright/test';
import { toEmployeesCsv } from '../lib/demo/export';
import { getRecruitmentProgress, getEligibility } from '../lib/demo/recruitment';
import { getReminderStage, nextReminderDeadline } from '../lib/demo/reminders';
import {
  nextExpenseStatus,
  getExpenseTotals,
  nextInvoiceStatus,
  getInvoiceSummary,
} from '../lib/demo/expenses';
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

test('expense status advances only forward', () => {
  expect(nextExpenseStatus('Pengajuan')).toBe('Dalam Proses');
  expect(nextExpenseStatus('Dalam Proses')).toBe('Sudah Dibayar');
  expect(nextExpenseStatus('Sudah Dibayar')).toBeNull();
});

test('expense totals sum by status', () => {
  const rows = [
    { amount: 100, status: 'Sudah Dibayar' as const },
    { amount: 50, status: 'Dalam Proses' as const },
  ];
  expect(getExpenseTotals(rows)).toEqual({ total: 150, paid: 100, inProcess: 50, submitted: 0 });
});

test('invoice status advances and summary counts', () => {
  expect(nextInvoiceStatus('Belum Dibuat')).toBe('Dalam Pengerjaan');
  expect(nextInvoiceStatus('Dalam Pengerjaan')).toBe('Sudah Dikirim');
  expect(nextInvoiceStatus('Sudah Dikirim')).toBeNull();
  expect(getInvoiceSummary([
    { invoice_status: 'Sudah Dikirim' },
    { invoice_status: 'Dalam Pengerjaan' },
    { invoice_status: 'Belum Dibuat' },
  ])).toEqual({ sent: 1, inProgress: 1, notCreated: 1 });
});
