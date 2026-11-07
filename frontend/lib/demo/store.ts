import { createDemoSeed } from './seed';
import type { DemoAction, DemoState } from './types';

export { createDemoSeed };

export const DEMO_STORAGE_KEY = 'moms-demo-data-v1';

function replaceById<T extends { id: string }>(items: T[], next: T): T[] {
  return items.map((item) => (item.id === next.id ? next : item));
}

function removeById<T extends { id: string }>(items: T[], id: string): T[] {
  return items.filter((item) => item.id !== id);
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'employee/add':
      return { ...state, employees: [action.employee, ...state.employees] };
    case 'employee/update':
      return { ...state, employees: replaceById(state.employees, action.employee) };
    case 'employee/delete':
      return { ...state, employees: removeById(state.employees, action.id) };
    case 'candidate/add':
      return { ...state, candidates: [action.candidate, ...state.candidates] };
    case 'candidate/update':
      return { ...state, candidates: replaceById(state.candidates, action.candidate) };
    case 'candidate/delete':
      return { ...state, candidates: removeById(state.candidates, action.id) };
    case 'reminder/add':
      return { ...state, reminders: [action.reminder, ...state.reminders] };
    case 'reminder/update':
      return { ...state, reminders: replaceById(state.reminders, action.reminder) };
    case 'reminder/delete':
      return { ...state, reminders: removeById(state.reminders, action.id) };
    case 'reminder/toggle':
      return {
        ...state,
        reminders: state.reminders.map((reminder) => {
          if (reminder.id !== action.id) return reminder;
          const isDone = reminder.work_status === 'Selesai';
          return {
            ...reminder,
            work_status: isDone ? 'Belum Selesai' : 'Selesai',
            reminder_status: isDone ? 'Aktif' : 'Selesai',
            last_sent: isDone ? 'Pengingat diaktifkan kembali' : 'Dihentikan (Pekerjaan Selesai)',
          };
        }),
      };
    case 'expense/add':
      return { ...state, expenses: [action.expense, ...state.expenses] };
    case 'expense/update':
      return { ...state, expenses: replaceById(state.expenses, action.expense) };
    case 'expense/delete':
      return { ...state, expenses: removeById(state.expenses, action.id) };
    case 'expense/setStatus':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.id ? { ...expense, status: action.status } : expense,
        ),
      };
    case 'culture/add':
      return { ...state, culturePosts: [action.post, ...state.culturePosts] };
    case 'culture/update':
      return { ...state, culturePosts: replaceById(state.culturePosts, action.post) };
    case 'culture/delete':
      return { ...state, culturePosts: removeById(state.culturePosts, action.id) };
    case 'demo/reset':
      return action.state;
    default:
      return state;
  }
}

function getDefaultStorage(): Storage | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.localStorage;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isDemoState(value: unknown): value is DemoState {
  if (!isRecord(value)) return false;
  return (
    value.version === 1 &&
    typeof value.seededAt === 'string' &&
    Array.isArray(value.employees) &&
    Array.isArray(value.candidates) &&
    Array.isArray(value.reminders) &&
    Array.isArray(value.expenses) &&
    Array.isArray(value.culturePosts)
  );
}

export function loadDemoState(storage?: Pick<Storage, 'getItem'>): DemoState {
  const target = storage ?? getDefaultStorage();
  if (!target) return createDemoSeed(new Date());

  try {
    const raw = target.getItem(DEMO_STORAGE_KEY);
    if (!raw) return createDemoSeed(new Date());
    const parsed: unknown = JSON.parse(raw);
    return isDemoState(parsed) ? parsed : createDemoSeed(new Date());
  } catch {
    return createDemoSeed(new Date());
  }
}

export function saveDemoState(
  state: DemoState,
  storage?: Pick<Storage, 'setItem'>,
): void {
  const target = storage ?? getDefaultStorage();
  if (!target) return;
  target.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
}

export function nextId(prefix: string, existing: string[]): string {
  const normalized = prefix.replace(/-+$/, '');
  const pattern = new RegExp(`^${normalized}-(\\d+)$`);
  let highest = 0;

  for (const id of existing) {
    const match = pattern.exec(id);
    if (!match) continue;
    highest = Math.max(highest, Number(match[1]));
  }

  return `${normalized}-${String(highest + 1).padStart(3, '0')}`;
}
