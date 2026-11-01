'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/AppShell';
import Link from 'next/link';
import {
  Users,
  BellRing,
  UserPlus,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Wallet,
  Building,
  HardHat,
  Filter,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

export default function DashboardPage() {
  // Visual Analytic Filters state
  const [filterPeriod, setFilterPeriod] = useState('ALL');
  const [filterQuarter, setFilterQuarter] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const handleResetFilter = () => {
    setFilterPeriod('ALL');
    setFilterQuarter('ALL');
    setFilterCategory('ALL');
    setFilterStatus('ALL');
  };

  return (
    <>
      <PageHeader
        title="Dashboard Operasional HC & GA"
        subtitle="Gambaran menyeluruh aktivitas HC & GA Cabang Luwu Raya · PT Bumi Jasa Utama (Kalla Transport & Logistics)"
      />

      <div className="mt-5 space-y-6">
        {/* 1.3 VISUAL FILTER ANALITIK SECTION */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-emerald-700" />
              <span className="text-xs font-bold text-gray-800">Visual Filter Analitik</span>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Periode Aktif: Q1 2025 (Jan - Mar)
              </span>
            </div>
            <button
              onClick={handleResetFilter}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Filter</span>
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500">Tahun</label>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 focus:border-emerald-600 focus:outline-none"
              >
                <option value="ALL">Semua Tahun</option>
                <option value="2025">2025 (Tahun Berjalan)</option>
                <option value="2024">2024</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500">Kuartal</label>
              <select
                value={filterQuarter}
                onChange={(e) => setFilterQuarter(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 focus:border-emerald-600 focus:outline-none"
              >
                <option value="ALL">Semua Kuartal</option>
                <option value="Q1">Q1 (Jan - Mar)</option>
                <option value="Q2">Q2 (Apr - Jun)</option>
                <option value="Q3">Q3 (Jul - Sep)</option>
                <option value="Q4">Q4 (Okt - Des)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500">Kategori Modul</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 focus:border-emerald-600 focus:outline-none"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="driver">Driver & Hauling</option>
                <option value="karyawan">Karyawan Staff</option>
                <option value="biaya">Biaya & Operasional</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500">Status Operasi</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 focus:border-emerald-600 focus:outline-none"
              >
                <option value="ALL">Semua Status</option>
                <option value="aktif">Aktif & Berjalan</option>
                <option value="urgent">Perlu Perhatian Segera</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          </div>
        </section>

        {/* 1.2 SUMMARY KPI CARDS (7 KARTU UTAMA) */}
        <section className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:grid-cols-7">
          {/* Card 1: Total Karyawan */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-emerald-300">
            <p className="text-[11px] font-semibold text-gray-500">Total Karyawan</p>
            <h3 className="mt-1.5 text-2xl font-black text-gray-900">184</h3>
            <p className="mt-1 text-[10px] text-emerald-700 font-semibold">132 Tetap &bull; 52 Kontrak</p>
          </div>

          {/* Card 2: Total Driver Project */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-emerald-300">
            <p className="text-[11px] font-semibold text-gray-500">Driver Project</p>
            <h3 className="mt-1.5 text-2xl font-black text-gray-900">72</h3>
            <p className="mt-1 text-[10px] text-emerald-700 font-semibold">Site Vale & CLM</p>
          </div>

          {/* Card 3: Rekrutmen Aktif */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-blue-800">Rekrutmen Aktif</p>
            <h3 className="mt-1.5 text-2xl font-black text-blue-800">12</h3>
            <p className="mt-1 text-[10px] text-blue-700 font-semibold">4 Siap SIMPER</p>
          </div>

          {/* Card 4: Reminder Aktif */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-amber-800">Reminder Aktif</p>
            <h3 className="mt-1.5 text-2xl font-black text-amber-800">28</h3>
            <p className="mt-1 text-[10px] text-amber-700 font-semibold">3 Hari H</p>
          </div>

          {/* Card 5: Reminder Selesai */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-emerald-800">Reminder Selesai</p>
            <h3 className="mt-1.5 text-2xl font-black text-emerald-800">94</h3>
            <p className="mt-1 text-[10px] text-emerald-700 font-semibold">Tepat Waktu (77%)</p>
          </div>

          {/* Card 6: Total Pengajuan Biaya */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-gray-500">Pengajuan Biaya</p>
            <h3 className="mt-1.5 text-lg font-black text-gray-900">Rp 33.7 Jt</h3>
            <p className="mt-1 text-[10px] text-gray-500">5 Transaksi</p>
          </div>

          {/* Card 7: Total Biaya Dibayar */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4 shadow-sm">
            <p className="text-[11px] font-semibold text-emerald-800">Biaya Dibayar</p>
            <h3 className="mt-1.5 text-lg font-black text-emerald-800">Rp 17.3 Jt</h3>
            <p className="mt-1 text-[10px] text-emerald-700 font-semibold">51% Terbayar</p>
          </div>
        </section>

        {/* ANALYTICS SECTION GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 1.4 ANALITIK KARYAWAN */}
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Analitik Personil Karyawan</h3>
                <p className="text-[11px] text-gray-500">Distribusi jabatan, status kontrak, dan pertumbuhan kuartal</p>
              </div>
              <Link href="/employees" className="text-xs font-bold text-emerald-700 hover:underline">
                Kelola Database →
              </Link>
            </div>

            <div className="mt-4 space-y-4">
              {/* Status Perbandingan Tetap vs Kontrak */}
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-800">Karyawan Tetap (72% &bull; 132 Org)</span>
                  <span className="text-amber-800">PKWT / Kontrak (28% &bull; 52 Org)</span>
                </div>
                <div className="mt-1.5 flex h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div className="bg-emerald-600" style={{ width: '72%' }} />
                  <div className="bg-amber-500" style={{ width: '28%' }} />
                </div>
              </div>

              {/* Sebaran Jabatan Bar Chart Simulation */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-gray-700">Komposisi Bidang Pekerjaan</span>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-gray-600">
                      <span>Hauling Operations & Driver</span>
                      <span className="font-bold text-gray-900">112 Orang (44%)</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-emerald-600" style={{ width: '44%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-gray-600">
                      <span>Fleet Maintenance & Mekanik Alat</span>
                      <span className="font-bold text-gray-900">58 Orang (23%)</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: '23%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-gray-600">
                      <span>Logistik & Supply Chain</span>
                      <span className="font-bold text-gray-900">46 Orang (18%)</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: '18%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-gray-600">
                      <span>Admin, HR & HSE Compliance</span>
                      <span className="font-bold text-gray-900">40 Orang (15%)</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-slate-400" style={{ width: '15%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 1.5 ANALITIK DRIVER PROJECT */}
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Analitik Driver Project</h3>
                <p className="text-[11px] text-gray-500">Pipeline seleksi 13 tahap & status kelayakan kerja</p>
              </div>
              <Link href="/recruitment" className="text-xs font-bold text-emerald-700 hover:underline">
                Buka Pipeline →
              </Link>
            </div>

            <div className="mt-4 space-y-4">
              {/* Ratio Layak vs Belum Layak */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3">
                  <span className="text-[10px] font-bold uppercase text-emerald-800">Layak Kerja (SIMPER Terbit)</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <h4 className="text-2xl font-black text-emerald-700">68</h4>
                    <span className="text-xs text-emerald-800">Driver</span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-emerald-600">94.4% Siap Operasi</p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3">
                  <span className="text-[10px] font-bold uppercase text-amber-800">Belum Layak (Tahap Seleksi)</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <h4 className="text-2xl font-black text-amber-700">4</h4>
                    <span className="text-xs text-amber-800">Kandidat</span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-amber-600">Menyelesaikan MCU/SDT</p>
                </div>
              </div>

              {/* 13 Tahap Mini Breakdown */}
              <div className="rounded-2xl bg-gray-50 p-3.5">
                <span className="block text-xs font-bold text-gray-800">Distribusi Kandidat Berjalan</span>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-white p-2 border border-gray-100">
                    <span className="block font-black text-blue-700">1</span>
                    <span className="text-[10px] text-gray-500">Internal HO</span>
                  </div>
                  <div className="rounded-xl bg-white p-2 border border-gray-100">
                    <span className="block font-black text-emerald-700">2</span>
                    <span className="text-[10px] text-gray-500">Internal Cabang</span>
                  </div>
                  <div className="rounded-xl bg-white p-2 border border-gray-100">
                    <span className="block font-black text-amber-700">1</span>
                    <span className="text-[10px] text-gray-500">Eksternal (SDT)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 1.6 ANALITIK BIAYA */}
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Analitik Pengeluaran & Biaya</h3>
                <p className="text-[11px] text-gray-500">Komposisi Operasional vs Lainnya & status disbursement</p>
              </div>
              <Link href="/expenses" className="text-xs font-bold text-emerald-700 hover:underline">
                Monitoring Biaya →
              </Link>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400">Total Periode Ini</span>
                  <h4 className="text-xl font-black text-gray-900">Rp 33.700.000</h4>
                </div>
                <div className="text-right">
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    51% Lunas
                  </span>
                  <p className="mt-1 text-[11px] text-gray-500">Sisa proses: Rp 16.4 Jt</p>
                </div>
              </div>

              {/* Komposisi Biaya */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-blue-700">Biaya Operasional (85% &bull; Rp 28.6 Jt)</span>
                  <span className="text-purple-700">Lainnya / Rapat (15% &bull; Rp 5.1 Jt)</span>
                </div>
                <div className="flex h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div className="bg-blue-600" style={{ width: '85%' }} />
                  <div className="bg-purple-500" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </section>

          {/* 1.7 ANALITIK REMINDER WORKFLOW */}
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Analitik Siklus Reminder Workflow</h3>
                <p className="text-[11px] text-gray-500">Siklus berjangka H-7, H-3, H-1, dan Hari H</p>
              </div>
              <Link href="/reminder-workflow" className="text-xs font-bold text-emerald-700 hover:underline">
                Buka Reminder →
              </Link>
            </div>

            <div className="mt-4 space-y-4">
              {/* Stages Distribution */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-2.5">
                  <span className="block text-[10px] font-bold text-gray-500">H-7</span>
                  <span className="text-base font-black text-emerald-700">12</span>
                  <span className="block text-[9px] text-gray-400">Tugas</span>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-2.5">
                  <span className="block text-[10px] font-bold text-gray-500">H-3</span>
                  <span className="text-base font-black text-amber-600">8</span>
                  <span className="block text-[9px] text-gray-400">Tugas</span>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-2.5">
                  <span className="block text-[10px] font-bold text-gray-500">H-1</span>
                  <span className="text-base font-black text-rose-600">5</span>
                  <span className="block text-[9px] text-gray-400">Tugas</span>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-2.5">
                  <span className="block text-[10px] font-bold text-rose-700">Hari H</span>
                  <span className="text-base font-black text-rose-700">3</span>
                  <span className="block text-[9px] text-rose-600">Hari Ini</span>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 text-xs">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Tingkat Penyelesaian Sebelum Hari H:</span>
                  <span className="font-bold text-emerald-700">77% (94 Selesai)</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 1.8 CULTURE & IMPLEMENTATION PREVIEW */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Culture & Improvement Implementation Cabang
                </h3>
              </div>
              <p className="text-[11px] text-gray-500">
                Dokumentasi terbaru aktivitas nilai budaya dan program inovasi operasional
              </p>
            </div>
            <Link
              href="/culture-hub"
              className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
            >
              Lihat Seluruh Galeri Culture <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                Culture
              </span>
              <h4 className="mt-2 text-xs font-bold text-gray-900">Daily Safety Morning Talk</h4>
              <p className="mt-1 line-clamp-2 text-[11px] text-gray-500">
                Briefing K3 dan penanaman Kalla Values sebelum hauling shift tambang Sorowako.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-800">
                Improvement
              </span>
              <h4 className="mt-2 text-xs font-bold text-gray-900">Optimasi Rute Bypass Km 14</h4>
              <p className="mt-1 line-clamp-2 text-[11px] text-gray-500">
                Efisiensi cycle time sebesar 20% dan penghematan solar 60 L/hari/unit.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800">
                Achievement
              </span>
              <h4 className="mt-2 text-xs font-bold text-gray-900">Zero Accident 1 Juta Jam</h4>
              <p className="mt-1 line-clamp-2 text-[11px] text-gray-500">
                Piagam penghargaan emas dari Manajemen PT Vale Indonesia atas capaian 0 LTI.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
