'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/AppShell';
import { useDemoData } from '@/lib/demo/DemoDataProvider';
import {
  buildDashboardData,
  MONTH_LABELS,
  type ChartPoint,
  type DashboardFilters,
} from '@/lib/demo/aggregates';
import { Filter, RotateCcw, Users, HardHat, UserCheck, BellRing, Wallet, CheckCircle2, ImageIcon } from 'lucide-react';

const DEFAULT_FILTERS: DashboardFilters = {
  year: 'ALL',
  quarter: 'ALL',
  month: 'ALL',
  category: 'ALL',
  status: 'ALL',
  from: '',
  to: '',
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

function BarList({ points, tone = 'emerald' }: { points: ChartPoint[]; tone?: 'emerald' | 'amber' | 'blue' }) {
  const max = Math.max(1, ...points.map((point) => point.value));
  const color =
    tone === 'amber' ? 'bg-amber-500' : tone === 'blue' ? 'bg-blue-600' : 'bg-emerald-600';

  return (
    <div className="space-y-2.5">
      {points.map((point) => (
        <div key={point.label}>
          <div className="flex items-center justify-between text-[11px] text-gray-600">
            <span className="truncate pr-2">{point.label}</span>
            <span className="font-bold text-gray-900">{point.value}</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(2, (point.value / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Card({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
          <h3 className="mt-1.5 text-2xl font-black text-gray-900">{value}</h3>
          <p className="mt-1 text-[10px] font-semibold text-gray-500">{hint}</p>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
          {icon}
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { state } = useDemoData();
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);

  const data = buildDashboardData(state, filters, new Date());
  const years = [...new Set(state.employees.map((item) => item.joinDate.slice(0, 4)))].sort();
  const paidPercent =
    data.cards.totalExpenses > 0
      ? Math.round((data.cards.paidExpenses / data.cards.totalExpenses) * 100)
      : 0;

  const update = (key: keyof DashboardFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <>
      <PageHeader
        title="Dashboard Operasional"
        subtitle="Gambaran menyeluruh aktivitas HC & GA Cabang Luwu Raya - PT Bumi Jasa Utama (Kalla Transport & Logistics). Seluruh angka dihitung dari data demo."
      />

      <div className="mt-5 space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-emerald-700" />
              <span className="text-xs font-bold text-gray-800">Visual Filter Analitik</span>
            </div>
            <button
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-2.5 py-1 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-50"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              type="button"
            >
              <RotateCcw className="h-3 w-3" /> Reset Filter
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Tahun
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-800"
                onChange={(event) => update('year', event.target.value)}
                value={filters.year}
              >
                <option value="ALL">Semua</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </label>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Kuartal
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-800"
                onChange={(event) => update('quarter', event.target.value)}
                value={filters.quarter}
              >
                <option value="ALL">Semua</option>
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </label>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Bulan
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-800"
                onChange={(event) => update('month', event.target.value)}
                value={filters.month}
              >
                <option value="ALL">Semua</option>
                {MONTH_LABELS.map((label, index) => (
                  <option key={label} value={String(index + 1)}>{label}</option>
                ))}
              </select>
            </label>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Kategori
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-800"
                onChange={(event) => update('category', event.target.value)}
                value={filters.category}
              >
                <option value="ALL">Semua</option>
                <option value="Operasional">Operasional (Biaya)</option>
                <option value="Lainnya">Lainnya (Biaya)</option>
                <option value="Culture">Culture</option>
                <option value="Implementation/Improvement">Improvement</option>
                <option value="Achievement/Recognition">Prestasi</option>
              </select>
            </label>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Status
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-800"
                onChange={(event) => update('status', event.target.value)}
                value={filters.status}
              >
                <option value="ALL">Semua</option>
                <option value="Pengajuan">Pengajuan</option>
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Sudah Dibayar">Sudah Dibayar</option>
              </select>
            </label>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Dari Tanggal
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-800"
                onChange={(event) => update('from', event.target.value)}
                type="date"
                value={filters.from}
              />
            </label>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Sampai Tanggal
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-800"
                onChange={(event) => update('to', event.target.value)}
                type="date"
                value={filters.to}
              />
            </label>
          </div>

          <p className="mt-3 text-[11px] text-gray-500">
            Periode aktif: <span className="font-semibold text-gray-800">{data.periodLabel}</span>
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card
            hint={`${data.cards.contractComposition.permanent} tetap, ${data.cards.contractComposition.contract} kontrak`}
            icon={<Users className="h-4 w-4" />}
            label="Total Karyawan"
            value={data.cards.totalEmployees}
          />
          <Card
            hint="Driver project terdaftar"
            icon={<HardHat className="h-4 w-4" />}
            label="Total Driver"
            value={data.cards.totalDrivers}
          />
          <Card
            hint="Masih dalam 13 tahap seleksi"
            icon={<UserCheck className="h-4 w-4" />}
            label="Rekrutmen Aktif"
            value={data.cards.activeRecruitment}
          />
          <Card
            hint={`${data.cards.completedReminders} reminder selesai`}
            icon={<BellRing className="h-4 w-4" />}
            label="Reminder Aktif"
            value={data.cards.activeReminders}
          />
          <Card
            hint="Seluruh pengajuan biaya"
            icon={<Wallet className="h-4 w-4" />}
            label="Total Pengajuan Biaya"
            value={formatRupiah(data.cards.totalExpenses)}
          />
          <Card
            hint={`${paidPercent}% dari total pengajuan`}
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Biaya Sudah Dibayar"
            value={formatRupiah(data.cards.paidExpenses)}
          />
          <Card
            hint={`${data.reminderDistribution.find((point) => point.label === 'Hari H')?.value ?? 0} jatuh tempo hari ini`}
            icon={<BellRing className="h-4 w-4" />}
            label="Reminder Selesai"
            value={data.cards.completedReminders}
          />
          <Card
            hint={`${data.recruitmentByStage.length} grup tahapan berkandidat`}
            icon={<UserCheck className="h-4 w-4" />}
            label="Kandidat Terdaftar"
            value={state.candidates.length}
          />
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900">Analitik Personil Karyawan</h3>
            <p className="mt-1 text-[11px] text-gray-500">Pertumbuhan karyawan per tahun bergabung</p>
            <div className="mt-4">
              <BarList points={data.employeeGrowth} />
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900">Komposisi Kontrak & Jabatan</h3>
            <p className="mt-1 text-[11px] text-gray-500">Tetap vs kontrak dan jabatan terbanyak</p>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <BarList points={data.contractComposition} tone="amber" />
              <BarList points={data.employeesByPosition} />
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900">Analitik Driver Project</h3>
            <p className="mt-1 text-[11px] text-gray-500">Kandidat per grup tahapan seleksi</p>
            <div className="mt-4">
              <BarList points={data.recruitmentByStage} tone="blue" />
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900">Analitik Pengeluaran & Biaya</h3>
            <p className="mt-1 text-[11px] text-gray-500">Tren 12 bulan dan komposisi kategori</p>
            <div className="mt-4">
              <BarList points={data.expenseMonthly} tone="amber" />
            </div>
            <div className="mt-5 border-t border-gray-100 pt-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Per kategori</p>
              <BarList points={data.expenseByCategory} />
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900">Siklus Reminder Workflow</h3>
            <p className="mt-1 text-[11px] text-gray-500">Distribusi tahap H-7 sampai Hari H</p>
            <div className="mt-4">
              <BarList points={data.reminderDistribution} />
            </div>
            <div className="mt-5 border-t border-gray-100 pt-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Per kategori</p>
              <BarList points={data.reminderByCategory} tone="amber" />
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Culture Hub Terbaru</h3>
                <p className="mt-1 text-[11px] text-gray-500">Dokumentasi budaya dan improvement terakhir</p>
              </div>
              <ImageIcon className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="mt-4 space-y-3">
              {data.culturePreview.length === 0 ? (
                <p className="text-xs text-gray-500">Belum ada dokumentasi pada periode ini.</p>
              ) : (
                data.culturePreview.map((post) => (
                  <Link
                    className="block rounded-xl border border-gray-100 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                    href="/culture-hub"
                    key={post.id}
                  >
                    <p className="text-xs font-bold text-gray-900">{post.title}</p>
                    <p className="mt-1 line-clamp-2 text-[11px] text-gray-500">{post.description}</p>
                    <p className="mt-1 text-[10px] font-semibold text-emerald-700">
                      {post.category} &bull; {post.date}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
