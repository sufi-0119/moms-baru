'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type GuardStatus = 'checking' | 'allowed' | 'redirecting';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<GuardStatus>('checking');

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        if (data.session) {
          setStatus('allowed');
          return;
        }
        setStatus('redirecting');
        router.replace('/');
      })
      .catch(() => {
        if (!active) return;
        setStatus('redirecting');
        router.replace('/');
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session) {
        setStatus('allowed');
      } else {
        setStatus('redirecting');
        router.replace('/');
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (status !== 'allowed') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-gray-500">
        Memeriksa sesi demo...
      </div>
    );
  }

  return <>{children}</>;
}
