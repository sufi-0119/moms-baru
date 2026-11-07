import type { ReminderItem } from './types';

export type ReminderStageLabel = ReminderItem['stage'] | 'Terlambat';

function startOfDay(value: Date): number {
  return Date.UTC(value.getFullYear(), value.getMonth(), value.getDate());
}

export function getDaysUntil(deadline: string, now: Date): number {
  const parsed = new Date(`${deadline}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return 0;
  return Math.round((startOfDay(parsed) - startOfDay(now)) / 86_400_000);
}

export function getReminderStage(deadline: string, now: Date): ReminderStageLabel {
  const days = getDaysUntil(deadline, now);
  if (days < 0) return 'Terlambat';
  if (days === 0) return 'Hari H';
  if (days <= 1) return 'H-1';
  if (days <= 3) return 'H-3';
  return 'H-7';
}

export function nextReminderDeadline(
  deadline: string,
  cycle: ReminderItem['repeat_cycle'],
): string | null {
  if (cycle === 'Tidak berulang') return null;

  const base = new Date(`${deadline}T00:00:00Z`);
  if (Number.isNaN(base.getTime())) return null;

  const monthsToAdd = cycle === 'Monthly' ? 1 : cycle === 'Quarterly' ? 3 : 12;
  const next = new Date(base.getTime());
  next.setUTCMonth(next.getUTCMonth() + monthsToAdd);
  return next.toISOString().split('T')[0];
}

function toStage(label: ReminderStageLabel): ReminderItem['stage'] {
  return label === 'Terlambat' ? 'Hari H' : label;
}

function baseId(id: string): string {
  return id.replace(/-R-\d{4}-\d{2}-\d{2}$/, '');
}

export function completeReminder(
  item: ReminderItem,
  now: Date,
): { completed: ReminderItem; next: ReminderItem | null } {
  const nowIso = now.toISOString();
  const completed: ReminderItem = {
    ...item,
    work_status: 'Selesai',
    reminder_status: 'Selesai',
    last_sent: nowIso.split('T')[0],
    stage: toStage(getReminderStage(item.deadline, now)),
  };

  const nextDeadline = nextReminderDeadline(item.deadline, item.repeat_cycle);
  if (!nextDeadline) return { completed, next: null };

  const next: ReminderItem = {
    ...item,
    id: `${baseId(item.id)}-R-${nextDeadline}`,
    deadline: nextDeadline,
    stage: toStage(getReminderStage(nextDeadline, now)),
    work_status: 'Belum Selesai',
    reminder_status: 'Aktif',
    last_sent: '-',
    email_history: [],
  };

  return { completed, next };
}
