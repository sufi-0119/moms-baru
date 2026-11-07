import type { ExpenseItem } from './types';

export function nextExpenseStatus(
  status: ExpenseItem['status'],
): ExpenseItem['status'] | null {
  if (status === 'Pengajuan') return 'Dalam Proses';
  if (status === 'Dalam Proses') return 'Sudah Dibayar';
  return null;
}

export function getExpenseTotals(
  rows: Pick<ExpenseItem, 'amount' | 'status'>[],
): { total: number; paid: number; inProcess: number; submitted: number } {
  return rows.reduce(
    (totals, row) => {
      totals.total += row.amount;
      if (row.status === 'Sudah Dibayar') totals.paid += row.amount;
      if (row.status === 'Dalam Proses') totals.inProcess += row.amount;
      if (row.status === 'Pengajuan') totals.submitted += row.amount;
      return totals;
    },
    { total: 0, paid: 0, inProcess: 0, submitted: 0 },
  );
}

export function nextInvoiceStatus(
  status: ExpenseItem['invoice_status'],
): ExpenseItem['invoice_status'] | null {
  if (status === 'Belum Dibuat') return 'Dalam Pengerjaan';
  if (status === 'Dalam Pengerjaan') return 'Sudah Dikirim';
  return null;
}

export function getInvoiceSummary(
  rows: Pick<ExpenseItem, 'invoice_status'>[],
): { sent: number; inProgress: number; notCreated: number } {
  return rows.reduce(
    (summary, row) => {
      if (row.invoice_status === 'Sudah Dikirim') summary.sent += 1;
      if (row.invoice_status === 'Dalam Pengerjaan') summary.inProgress += 1;
      if (row.invoice_status === 'Belum Dibuat') summary.notCreated += 1;
      return summary;
    },
    { sent: 0, inProgress: 0, notCreated: 0 },
  );
}
