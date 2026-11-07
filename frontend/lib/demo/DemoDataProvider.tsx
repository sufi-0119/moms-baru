'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useSyncExternalStore,
} from 'react';
import { createDemoSeed, demoReducer, loadDemoState, saveDemoState } from './store';
import type { DemoAction, DemoState } from './types';

interface DemoDataContextValue {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
  reset: () => void;
}

const DemoDataContext = createContext<DemoDataContextValue | null>(null);

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const [state, dispatch] = useReducer(demoReducer, undefined, () => loadDemoState());

  useEffect(() => {
    saveDemoState(state);
  }, [state]);

  const reset = useCallback(() => {
    dispatch({ type: 'demo/reset', state: createDemoSeed(new Date()) });
  }, []);

  const value = useMemo(() => ({ state, dispatch, reset }), [state, reset]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-gray-500">
        Memuat data demo...
      </div>
    );
  }

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData(): DemoDataContextValue {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error('useDemoData must be used inside DemoDataProvider');
  }
  return context;
}
