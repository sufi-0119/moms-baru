import React from 'react';
import AppShell from '@/components/AppShell';
import { DemoDataProvider } from '@/lib/demo/DemoDataProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthGuard } from '@/components/demo/AuthGuard';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoDataProvider>
      <ToastProvider>
        <AuthGuard>
          <AppShell>{children}</AppShell>
        </AuthGuard>
      </ToastProvider>
    </DemoDataProvider>
  );
}
