import type { DemoState, ExpenseItem, ReminderItem } from './types';
import { getReminderStage } from './reminders';
import { getRecruitmentProgress } from './recruitment';

export interface DashboardFilters {
  year: string;
  quarter: string;
  month: string;
  category: string;
  status: string;
  from: string;
  to: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DashboardData {
  cards: {
    totalEmployees: number;
    totalDrivers: number;
    activeRecruitment: number;
    activeReminders: number;
    completedReminders: number;
    totalExpenses: number;
    paidExpenses: number;
    contractComposition: { permanent: number; contract: number };
  };
  employeeGrowth: ChartPoint[];
  employeesByPosition: ChartPoint[];
  contractComposition: ChartPoint[];
  recruitmentByStage: ChartPoint[];
  expenseMonthly: ChartPoint[];
  expenseYearly: ChartPoint[];
  expenseByCategory: ChartPoint[];
  reminderDistribution: ChartPoint[];
  reminderByCategory: ChartPoint[];
  culturePreview: DemoState['culturePosts'];
  periodLabel: string;
}

export const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

const QUARTER_MONTHS: Record<string, number[]> = {
  Q1: [0, 1, 2],
  Q2: [3, 4, 5],
  Q3: [6, 7, 8],
  Q4: [9, 10, 11],
};

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function matchesPeriod(dateValue: string | undefined, filters: DashboardFilters): boolean {
  const date = parseDate(dateValue);
  if (!date) return false;
  const iso = date.toISOString().slice(0, 10);

  if (filters.from && iso < filters.from) return false;
  if (filters.to && iso > filters.to) return false;
  if (filters.year !== 'ALL' && String(date.getUTCFullYear()) !== filters.year) return false;
  if (filters.quarter !== 'ALL' && !QUARTER_MONTHS[filters.quarter]?.includes(date.getUTCMonth())) {
    return false;
  }
  if (filters.month !== 'ALL' && String(date.getUTCMonth() + 1) !== filters.month) return false;
  return true;
}

function sumBy(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function topEntries(map: Map<string, number>, limit = 6): ChartPoint[] {
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function monthlySeries(rows: ExpenseItem[], filters: DashboardFilters, now: Date): ChartPoint[] {
  if (filters.year !== 'ALL' && filters.quarter !== 'ALL') {
    const year = Number(filters.year);
    return (QUARTER_MONTHS[filters.quarter] ?? []).map((monthIndex) => {
      const value = rows
        .filter((row) => matchesPeriod(row.expense_date, { ...filters, quarter: 'ALL', month: 'ALL' }))
        .filter((row) => {
          const date = parseDate(row.expense_date);
          return date !== null && date.getUTCFullYear() === year && date.getUTCMonth() === monthIndex;
        })
        .reduce((total, row) => total + row.amount, 0);
      return { label: MONTH_LABELS[monthIndex], value };
    });
  }

  const points: ChartPoint[] = [];
  for (let offset = 11; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
    const value = rows
      .filter((row) => {
        const rowDate = parseDate(row.expense_date);
        return (
          rowDate !== null &&
          rowDate.getUTCFullYear() === date.getUTCFullYear() &&
          rowDate.getUTCMonth() === date.getUTCMonth()
        );
      })
      .reduce((total, row) => total + row.amount, 0);
    points.push({ label: MONTH_LABELS[date.getUTCMonth()], value });
  }
  return points;
}

function yearlySeries(rows: ExpenseItem[]): ChartPoint[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    const date = parseDate(row.expense_date);
    if (!date) continue;
    const year = String(date.getUTCFullYear());
    map.set(year, (map.get(year) ?? 0) + row.amount);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([label, value]) => ({ label, value }));
}

function reminderDistributionOf(rows: ReminderItem[], now: Date): ChartPoint[] {
  const stages: Record<string, number> = { 'H-7': 0, 'H-3': 0, 'H-1': 0, 'Hari H': 0, Terlambat: 0 };
  for (const row of rows) {
    if (row.work_status === 'Selesai') continue;
    stages[getReminderStage(row.deadline, now)] += 1;
  }
  return Object.entries(stages).map(([label, value]) => ({ label, value }));
}

export function buildDashboardData(
  state: DemoState,
  filters: DashboardFilters,
  now: Date = new Date(),
): DashboardData {
  const employees = state.employees.filter((item) => matchesPeriod(item.joinDate, filters));
  const candidates = state.candidates.filter((item) => matchesPeriod(item.created_at, filters));
  const expenses = state.expenses.filter(
    (item) =>
      matchesPeriod(item.expense_date, filters) &&
      (filters.category === 'ALL' || item.category === filters.category) &&
      (filters.status === 'ALL' || item.status === filters.status),
  );
  const reminders = state.reminders.filter((item) => matchesPeriod(item.deadline, filters));
  const culturePosts = state.culturePosts.filter(
    (item) =>
      matchesPeriod(item.date, filters) &&
      (filters.category === 'ALL' || item.category === filters.category),
  );

  const totalEmployees = employees.filter((item) => item.category === 'Karyawan').length;
  const totalDrivers = employees.filter((item) => item.category === 'Driver').length;
  const permanent = employees.filter((item) => item.contractStatus.toLowerCase().includes('tetap')).length;
  const contract = employees.length - permanent;

  const activeRecruitment = candidates.filter((item) => getRecruitmentProgress(item.stages_data) < 100).length;

  const growthMap = new Map<string, number>();
  for (const employee of employees) {
    const date = parseDate(employee.joinDate);
    if (!date) continue;
    const year = String(date.getUTCFullYear());
    growthMap.set(year, (growthMap.get(year) ?? 0) + 1);
  }
  const employeeGrowth = [...growthMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([label, value]) => ({ label, value }));

  const positionMap = new Map<string, number>();
  for (const employee of employees) {
    positionMap.set(employee.position, (positionMap.get(employee.position) ?? 0) + 1);
  }

  const stageMap = new Map<string, number>();
  for (const candidate of candidates) {
    stageMap.set(candidate.stage_group, (stageMap.get(candidate.stage_group) ?? 0) + 1);
  }

  const categoryMap = new Map<string, number>();
  for (const expense of expenses) {
    categoryMap.set(expense.category, (categoryMap.get(expense.category) ?? 0) + expense.amount);
  }

  const reminderCategoryMap = new Map<string, number>();
  for (const reminder of reminders) {
    reminderCategoryMap.set(reminder.category, (reminderCategoryMap.get(reminder.category) ?? 0) + 1);
  }

  const activeReminders = state.reminders.filter((item) => item.reminder_status === 'Aktif').length;
  const completedReminders = state.reminders.filter((item) => item.reminder_status === 'Selesai').length;

  const periodParts = [
    filters.year !== 'ALL' ? filters.year : null,
    filters.quarter !== 'ALL' ? filters.quarter : null,
    filters.month !== 'ALL' ? MONTH_LABELS[Number(filters.month) - 1] : null,
    filters.from ? `dari ${filters.from}` : null,
    filters.to ? `sampai ${filters.to}` : null,
  ].filter(Boolean);

  return {
    cards: {
      totalEmployees,
      totalDrivers,
      activeRecruitment,
      activeReminders,
      completedReminders,
      totalExpenses: sumBy(state.expenses.map((item) => item.amount)),
      paidExpenses: sumBy(
        state.expenses.filter((item) => item.status === 'Sudah Dibayar').map((item) => item.amount),
      ),
      contractComposition: { permanent, contract },
    },
    employeeGrowth,
    employeesByPosition: topEntries(positionMap),
    contractComposition: [
      { label: 'Tetap', value: permanent },
      { label: 'Kontrak', value: contract },
    ],
    recruitmentByStage: topEntries(stageMap),
    expenseMonthly: monthlySeries(expenses, filters, now),
    expenseYearly: yearlySeries(state.expenses),
    expenseByCategory: topEntries(categoryMap),
    reminderDistribution: reminderDistributionOf(reminders, now),
    reminderByCategory: topEntries(reminderCategoryMap),
    culturePreview: [...culturePosts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3),
    periodLabel: periodParts.length > 0 ? periodParts.join(' - ') : 'Seluruh periode data demo',
  };
}

