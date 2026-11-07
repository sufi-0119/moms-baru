'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useDemoData } from '@/lib/demo/DemoDataProvider';
import { DemoBanner } from '@/components/demo/DemoBanner';

const KALLA_LOGO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA7_nxc3iXJc1_XyjhhynevdSzFDX9tplTW7XjyxFAn_OFuSGB0sD6x_s4Zcdo7lcFNrqqdNUMGvvz6-wjc1k_jbguVjxiYTfTdxFFmmB3XLHCcB-E2OCttycP9hGpL_5DhhSSaOWAB0Hl9VM3fJCQjS4RXdz2OnAsvhdJvkpt5PU-C-bg7O543tOWqbrpCFzLc0PtJn431d_XEEbreLstPcbfzTWQggBpfUv9dfUNXTUR9Ni2GY2GO';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'fa-chart-pie',
  },
  {
    href: '/employees',
    label: 'Karyawan & Driver',
    icon: 'fa-users-gear',
  },
  {
    href: '/reminder-workflow',
    label: 'Reminder Workflow',
    icon: 'fa-bell-concierge',
    badgeTone: 'warning',
  },
  {
    href: '/recruitment',
    label: 'Rekrutmen Driver',
    icon: 'fa-user-check',
  },
  {
    href: '/expenses',
    label: 'Monitoring Biaya',
    icon: 'fa-wallet',
  },
  {
    href: '/culture-hub',
    label: 'Culture Hub',
    icon: 'fa-images',
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useDemoData();
  const [signingOut, setSigningOut] = useState(false);

  const badges: Record<string, number | undefined> = {
    '/employees': state.employees.length,
    '/reminder-workflow': state.reminders.filter((item) => item.reminder_status === 'Aktif').length,
    '/recruitment': state.candidates.length,
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
    } finally {
      router.replace('/');
    }
  };

  return (
    <div className="flex min-h-screen bg-canvas text-forest-950">
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-shrink-0 select-none flex-col justify-between border-r border-slate-800 bg-[#121620] text-slate-300">
        <div>
          {/* Brand */}
          <div className="flex h-20 items-center gap-3 border-b border-slate-800 bg-[#0E121A] px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Kalla Transport & Logistics"
                className="h-7 w-auto object-contain"
                src={KALLA_LOGO}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight tracking-wider text-white">KALLA</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-400">
                Transport &amp; Logistics (Cabang Luwu Raya)
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-1 p-4">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Menu Utama
            </div>

            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;

              if (active) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-lg bg-[#107C41] px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-900/30"
                  >
                    <div className="flex items-center gap-3">
                      <i className={`fa-solid ${item.icon} w-5 text-center text-white`} />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </div>
                    {badges[item.href] ? (
                      <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold">
                        {badges[item.href]}
                      </span>
                    ) : null}
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <i className={`fa-solid ${item.icon} w-5 text-center text-slate-400`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                  {badges[item.href] ? (
                    <span
                      className={
                        item.badgeTone === 'warning'
                          ? 'shrink-0 rounded-full border border-amber-500/30 bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400'
                          : 'shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300'
                      }
                    >
                      {badges[item.href]}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer / Logout */}
        <div className="border-t border-slate-800/80 bg-[#0E121A] p-4">
          <div className="mb-3 flex items-center justify-between px-1 text-xs text-slate-400" />
          <button
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700/60 px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-rose-800 hover:bg-rose-950/40 hover:text-white disabled:opacity-60"
            disabled={signingOut}
            onClick={handleSignOut}
            type="button"
          >
            <LogOut className="h-3.5 w-3.5 text-rose-400" />
            <span>{signingOut ? 'Keluar...' : 'Keluar Sistem'}</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 pl-64">
        <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col px-7 pb-8 pt-6">
          <DemoBanner />
          {children}
        </div>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  notificationCount = 2,
}: {
  title: string;
  subtitle: string;
  notificationCount?: number;
}) {
  return (
    <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-start gap-3">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">
            {title}
          </h1>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <div className="relative hidden md:block md:w-[280px] lg:w-[320px] xl:w-[340px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" strokeWidth={1.8} />
          <input
            className="h-10 w-full rounded-full border border-gray-300 bg-white pl-11 pr-4 text-[12px] shadow-sm placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
            placeholder="Cari nama, ID, jabatan, atau proyek..."
            type="text"
          />
        </div>
        <button
          aria-label="Notifikasi"
          className="relative grid h-10 w-10 place-items-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          type="button"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
            {notificationCount}
          </span>
        </button>
        <div className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-white/70">
          <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-sm font-semibold text-emerald-700 ring-2 ring-white">
            HR
          </span>
          <div className="hidden text-left lg:block">
            <span className="block whitespace-nowrap text-[11px] font-semibold leading-tight text-gray-900">
              HR Operations Manager
            </span>
            <span className="flex items-center gap-1 text-[9px] text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Divisi People & Culture Kalla
            </span>
          </div>
          <ChevronDown className="hidden h-3.5 w-3.5 text-gray-400 sm:block" />
        </div>
      </div>
    </header>
  );
}
