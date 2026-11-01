'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/AppShell';
import { supabase } from '@/lib/supabase';
import {
  Users,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Eye,
  ShieldCheck,
  Building,
  HardHat,
  X,
  FileSpreadsheet
} from 'lucide-react';

interface StageInfo {
  key: keyof RecruitmentCandidate['stages_data'];
  name: string;
  group: 'Internal HO' | 'Internal Cabang' | 'Eksternal';
}

const ORDERED_STAGES: StageInfo[] = [
  { key: 'berkas', name: '1. Seleksi Berkas', group: 'Internal HO' },
  { key: 'interview', name: '2. Interview HO & User', group: 'Internal HO' },
  { key: 'tpub', name: '3. Tes TPUB', group: 'Internal HO' },
  { key: 'praktik', name: '4. Tes Praktik & Skill', group: 'Internal Cabang' },
  { key: 'kontrak', name: '5. Kontrak Kerja', group: 'Internal Cabang' },
  { key: 'bpjs', name: '6. BPJS & Asuransi', group: 'Internal Cabang' },
  { key: 'pkwt', name: '7. Pelaporan PKWT', group: 'Internal Cabang' },
  { key: 'osc', name: '8. Registrasi OSC', group: 'Internal Cabang' },
  { key: 'mcu', name: '9. MCU Fit To Work', group: 'Internal Cabang' },
  { key: 'gip_ebs', name: '10. Training GIP & EBS', group: 'Eksternal' },
  { key: 'badge', name: '11. Badge Number', group: 'Eksternal' },
  { key: 'sdt_teori', name: '12. SDT Teori', group: 'Eksternal' },
  { key: 'simper', name: '13. SDT Praktik & SIMPER', group: 'Eksternal' },
];

export interface RecruitmentCandidate {
  id: string;
  name: string;
  phone: string;
  recommender: string; // Orang yang merekomendasikan
  recommendation: string; // Penempatan
  current_stage: string;
  stage_group: 'Internal HO' | 'Internal Cabang' | 'Eksternal';
  eligibility_status: 'Layak Kerja' | 'Belum Layak Kerja';
  progress_pct: number;
  notes: string;
  created_at: string;
  stages_data: {
    berkas: { completed: boolean; date?: string };
    interview: { completed: boolean; date?: string };
    tpub: { completed: boolean; date?: string };
    praktik: { completed: boolean; date?: string };
    kontrak: { completed: boolean; date?: string };
    bpjs: { completed: boolean; date?: string };
    pkwt: { completed: boolean; date?: string };
    osc: { completed: boolean; date?: string };
    mcu: { completed: boolean; date?: string };
    gip_ebs: { completed: boolean; date?: string };
    badge: { completed: boolean; date?: string };
    sdt_teori: { completed: boolean; date?: string };
    simper: { completed: boolean; date?: string };
  };
}

const INITIAL_CANDIDATES: RecruitmentCandidate[] = [
  {
    id: 'REC-2025-001',
    name: 'Ahmad Faisal',
    phone: '081244556677',
    recommender: 'Pak Joko (Foreman Hauling)',
    recommendation: 'Operasional Hauling Vale',
    current_stage: '13. SDT Praktik & SIMPER',
    stage_group: 'Eksternal',
    eligibility_status: 'Layak Kerja',
    progress_pct: 100,
    notes: 'Seluruh tahap selesai, lulus pengujian SIMPER PT Vale dengan predikat memuaskan.',
    created_at: '2025-02-10',
    stages_data: {
      berkas: { completed: true, date: '2025-02-10' },
      interview: { completed: true, date: '2025-02-12' },
      tpub: { completed: true, date: '2025-02-15' },
      praktik: { completed: true, date: '2025-02-18' },
      kontrak: { completed: true, date: '2025-02-20' },
      bpjs: { completed: true, date: '2025-02-21' },
      pkwt: { completed: true, date: '2025-02-22' },
      osc: { completed: true, date: '2025-02-23' },
      mcu: { completed: true, date: '2025-02-24' },
      gip_ebs: { completed: true, date: '2025-02-26' },
      badge: { completed: true, date: '2025-02-27' },
      sdt_teori: { completed: true, date: '2025-02-28' },
      simper: { completed: true, date: '2025-03-02' }
    }
  },
  {
    id: 'REC-2025-002',
    name: 'Bambang Sutrisno',
    phone: '082199887766',
    recommender: 'Irfan Hakim (Supervisor)',
    recommendation: 'Driver Dump Truck CLM',
    current_stage: '8. Registrasi OSC',
    stage_group: 'Internal Cabang',
    eligibility_status: 'Belum Layak Kerja',
    progress_pct: 62,
    notes: 'Sedang menunggu jadwal registrasi OSC dan MCU lanjutan dari RS Inco.',
    created_at: '2025-02-14',
    stages_data: {
      berkas: { completed: true, date: '2025-02-14' },
      interview: { completed: true, date: '2025-02-16' },
      tpub: { completed: true, date: '2025-02-18' },
      praktik: { completed: true, date: '2025-02-21' },
      kontrak: { completed: true, date: '2025-02-23' },
      bpjs: { completed: true, date: '2025-02-24' },
      pkwt: { completed: true, date: '2025-02-25' },
      osc: { completed: true, date: '2025-02-26' },
      mcu: { completed: false },
      gip_ebs: { completed: false },
      badge: { completed: false },
      sdt_teori: { completed: false },
      simper: { completed: false }
    }
  },
  {
    id: 'REC-2025-003',
    name: 'Reza Pratama',
    phone: '085233441122',
    recommender: 'Andi Baso (HSE Officer)',
    recommendation: 'Logistics Transport Hub',
    current_stage: '2. Interview HO & User',
    stage_group: 'Internal HO',
    eligibility_status: 'Belum Layak Kerja',
    progress_pct: 15,
    notes: 'Dijadwalkan interview user cabang pada tanggal 5 Maret.',
    created_at: '2025-02-25',
    stages_data: {
      berkas: { completed: true, date: '2025-02-25' },
      interview: { completed: true, date: '2025-02-26' },
      tpub: { completed: false },
      praktik: { completed: false },
      kontrak: { completed: false },
      bpjs: { completed: false },
      pkwt: { completed: false },
      osc: { completed: false },
      mcu: { completed: false },
      gip_ebs: { completed: false },
      badge: { completed: false },
      sdt_teori: { completed: false },
      simper: { completed: false }
    }
  }
];

export default function RecruitmentPage() {
  const [candidates, setCandidates] = useState<RecruitmentCandidate[]>(INITIAL_CANDIDATES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEligibility, setFilterEligibility] = useState<string>('ALL');
  const [filterStageGroup, setFilterStageGroup] = useState<string>('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<RecruitmentCandidate | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    phone: '',
    recommender: '',
    recommendation: 'Operasional Hauling Vale',
    notes: ''
  });

  const filteredCandidates = candidates.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.recommendation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.recommender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchElig = filterEligibility === 'ALL' || c.eligibility_status === filterEligibility;
    const matchGroup = filterStageGroup === 'ALL' || c.stage_group === filterStageGroup;
    return matchSearch && matchElig && matchGroup;
  });

  const totalCandidates = candidates.length;
  const readyCandidates = candidates.filter((c) => c.eligibility_status === 'Layak Kerja').length;
  const inProgressCandidates = totalCandidates - readyCandidates;

  const handleExportExcel = () => {
    const headers = ['ID', 'Nama Driver', 'No Telepon', 'Rekomendator', 'Penempatan', 'Tahap Terkini', 'Kelayakan', 'Progres (%)', 'Keterangan'];
    const rows = filteredCandidates.map(c => [
      c.id,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.recommender}"`,
      `"${c.recommendation}"`,
      `"${c.current_stage}"`,
      c.eligibility_status,
      `${c.progress_pct}%`,
      `"${c.notes}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_rekrutmen_driver_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Logika Otomatis:
   * Jika klik satu tahapan (targetIndex), maka SEMUA tahapan dari index 0 s/d targetIndex otomatis dicentang (completed: true),
   * dan tahapan setelah targetIndex otomatis di-uncheck (completed: false).
   * Tahap Terkini otomatis diperbarui mengikuti targetIndex.
   * Jika targetIndex adalah tahapan terakhir (13/13), maka status kelayakan otomatis menjadi 'Layak Kerja'.
   */
  const handleSelectStage = (candidateId: string, targetIndex: number) => {
    setCandidates(prev => prev.map(c => {
      if (c.id !== candidateId) return c;

      const updatedStages = { ...c.stages_data };
      ORDERED_STAGES.forEach((st, idx) => {
        if (idx <= targetIndex) {
          updatedStages[st.key] = { completed: true, date: updatedStages[st.key]?.date || new Date().toISOString().split('T')[0] };
        } else {
          updatedStages[st.key] = { completed: false };
        }
      });

      const totalSteps = ORDERED_STAGES.length;
      const completedSteps = targetIndex + 1;
      const pct = Math.round((completedSteps / totalSteps) * 100);
      const isAllDone = completedSteps === totalSteps;

      const activeStageObj = ORDERED_STAGES[targetIndex];

      const updatedCandidate: RecruitmentCandidate = {
        ...c,
        stages_data: updatedStages,
        progress_pct: pct,
        current_stage: isAllDone ? '13. SDT Praktik & SIMPER (Selesai)' : activeStageObj.name,
        stage_group: activeStageObj.group,
        eligibility_status: isAllDone ? 'Layak Kerja' : 'Belum Layak Kerja',
      };

      if (selectedCandidate && selectedCandidate.id === candidateId) {
        setSelectedCandidate(updatedCandidate);
      }
      return updatedCandidate;
    }));
  };

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.name.trim()) return;

    const newId = `REC-2025-00${candidates.length + 1}`;
    const created: RecruitmentCandidate = {
      id: newId,
      name: newCandidate.name,
      phone: newCandidate.phone || '-',
      recommender: newCandidate.recommender || '-',
      recommendation: newCandidate.recommendation,
      current_stage: '1. Seleksi Berkas',
      stage_group: 'Internal HO',
      eligibility_status: 'Belum Layak Kerja',
      progress_pct: 8,
      notes: newCandidate.notes || 'Kandidat baru terdaftar.',
      created_at: new Date().toISOString().split('T')[0],
      stages_data: {
        berkas: { completed: true, date: new Date().toISOString().split('T')[0] },
        interview: { completed: false },
        tpub: { completed: false },
        praktik: { completed: false },
        kontrak: { completed: false },
        bpjs: { completed: false },
        pkwt: { completed: false },
        osc: { completed: false },
        mcu: { completed: false },
        gip_ebs: { completed: false },
        badge: { completed: false },
        sdt_teori: { completed: false },
        simper: { completed: false }
      }
    };

    setCandidates([created, ...candidates]);
    setShowAddModal(false);
    setNewCandidate({ name: '', phone: '', recommender: '', recommendation: 'Operasional Hauling Vale', notes: '' });
  };

  return (
    <>
      <PageHeader
        title="Monitoring Rekrutmen Driver Project"
        subtitle="Pantau progres 13 tahapan seleksi driver project dari seleksi berkas hingga terbit SIMPER & sertifikat layak kerja."
        notificationCount={3}
      />

      <div className="mt-6 space-y-6">
        {/* KPI Cards Row */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-emerald-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Kandidat
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-gray-900">{totalCandidates}</h3>
              <span className="text-xs text-gray-500">Orang</span>
            </div>
            <p className="mt-2 text-[11px] text-gray-400">Terdaftar di database seleksi</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Layak Kerja
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-emerald-700">{readyCandidates}</h3>
              <span className="text-xs text-emerald-800">Siap Operasional</span>
            </div>
            <p className="mt-2 text-[11px] text-emerald-600">Lolos 13 tahap seleksi</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Belum Layak Kerja
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-amber-700">{inProgressCandidates}</h3>
              <span className="text-xs text-amber-800">Dalam Proses</span>
            </div>
            <p className="mt-2 text-[11px] text-amber-600">Menyelesaikan tahap seleksi</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Standar Pipeline
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-purple-700">13 Tahap</h3>
              <span className="text-xs text-gray-500">HO, Cabang & Eksternal</span>
            </div>
            <p className="mt-2 text-[11px] text-gray-400">Standar keselamatan Kalla & Vale</p>
          </div>
        </section>

        {/* Toolbar & Filters */}
        <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative min-w-[280px] flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama driver, rekomendator, ID, atau penempatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs text-gray-800 placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
              <span>Export Excel</span>
            </button>

            <select
              value={filterEligibility}
              onChange={(e) => setFilterEligibility(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 focus:border-emerald-600 focus:outline-none"
            >
              <option value="ALL">Semua Kelayakan</option>
              <option value="Layak Kerja">Layak Kerja</option>
              <option value="Belum Layak Kerja">Belum Layak Kerja</option>
            </select>

            <select
              value={filterStageGroup}
              onChange={(e) => setFilterStageGroup(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 focus:border-emerald-600 focus:outline-none"
            >
              <option value="ALL">Semua Grup Tahapan</option>
              <option value="Internal HO">Internal HO</option>
              <option value="Internal Cabang">Internal Cabang</option>
              <option value="Eksternal">Eksternal</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Kandidat</span>
            </button>
          </div>
        </section>

        {/* Tabel Rekapitulasi Utama */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-800">Tabel Rekapitulasi Kandidat Driver</span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                {filteredCandidates.length} Terdaftar
              </span>
            </div>
            <p className="text-xs text-gray-400">Klik &quot;Detail &amp; Update Tahapan&quot; untuk memperbarui progres</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50/70 font-semibold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="px-4 py-3.5">ID / Nama Driver</th>
                  <th className="px-4 py-3.5">Rekomendator & Penempatan</th>
                  <th className="px-4 py-3.5">Tahap Terkini</th>
                  <th className="px-4 py-3.5">Progres 13 Tahap</th>
                  <th className="px-4 py-3.5 text-center">Status Kelayakan</th>
                  <th className="px-4 py-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-normal">
                {filteredCandidates.map((c) => (
                  <tr key={c.id} className="transition hover:bg-gray-50/60">
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-[11px] font-bold text-gray-500">{c.id}</div>
                      <div className="text-sm font-bold text-gray-900">{c.name}</div>
                      <div className="text-[11px] text-gray-400">{c.phone}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-800">{c.recommendation}</div>
                      <div className="text-[11px] text-emerald-700">Rekomendasi: {c.recommender}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700">
                        {c.current_stage}
                      </span>
                      <div className="mt-0.5 text-[10px] text-gray-400">{c.stage_group}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full ${
                              c.progress_pct === 100 ? 'bg-emerald-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${c.progress_pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-gray-700">{c.progress_pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          c.eligibility_status === 'Layak Kerja'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.eligibility_status === 'Layak Kerja' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {c.eligibility_status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => setSelectedCandidate(c)}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
                      >
                        <Eye className="h-3.5 w-3.5" /> Detail &amp; Update Tahapan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* DETAIL & SEKUENS EDIT TAHAPAN MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-700">
                  {selectedCandidate.id}
                </span>
                <h3 className="text-xl font-black text-gray-900">{selectedCandidate.name}</h3>
                <p className="text-xs text-gray-500">
                  Rekomendator: <strong>{selectedCandidate.recommender}</strong> &bull; Penempatan: {selectedCandidate.recommendation}
                </p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Status Banner */}
              <div
                className={`flex items-center justify-between rounded-2xl p-4 ${
                  selectedCandidate.eligibility_status === 'Layak Kerja'
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border border-amber-200 bg-amber-50 text-amber-900'
                }`}
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">Status Kelayakan Final</p>
                  <p className="text-lg font-black">{selectedCandidate.eligibility_status} ({selectedCandidate.progress_pct}%)</p>
                  <p className="mt-0.5 text-xs">Tahap Terkini: <strong>{selectedCandidate.current_stage}</strong></p>
                </div>
                {selectedCandidate.eligibility_status === 'Layak Kerja' && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md">
                    <CheckCircle2 className="h-4 w-4" /> SELESAI (LAYAK KERJA)
                  </span>
                )}
              </div>

              {/* 13 Steps Sequential Selector */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900">Alur 13 Tahap Seleksi (Klik Tahapan Untuk Mengupdate)</h4>
                  <span className="text-[11px] text-gray-400">Tahap sebelumnya otomatis tercentang</span>
                </div>

                {/* Group A: Internal HO */}
                <div className="rounded-2xl border border-gray-200 p-4">
                  <h5 className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span>A. Internal HO</span>
                  </h5>
                  <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {ORDERED_STAGES.slice(0, 3).map((st, idx) => {
                      const isDone = selectedCandidate.stages_data[st.key]?.completed;
                      return (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => handleSelectStage(selectedCandidate.id, idx)}
                          className={`flex items-center justify-between rounded-xl p-2.5 text-xs transition border text-left cursor-pointer ${
                            isDone ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <span>{st.name}</span>
                          <span className={isDone ? 'text-emerald-700 font-bold' : 'text-gray-400'}>
                            {isDone ? '✓ Lolos' : 'Pending'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Group B: Internal Cabang */}
                <div className="rounded-2xl border border-gray-200 p-4">
                  <h5 className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <HardHat className="h-4 w-4 text-emerald-600" />
                    <span>B. Internal Cabang</span>
                  </h5>
                  <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {ORDERED_STAGES.slice(3, 9).map((st, subIdx) => {
                      const idx = subIdx + 3;
                      const isDone = selectedCandidate.stages_data[st.key]?.completed;
                      return (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => handleSelectStage(selectedCandidate.id, idx)}
                          className={`flex items-center justify-between rounded-xl p-2.5 text-xs transition border text-left cursor-pointer ${
                            isDone ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <span>{st.name}</span>
                          <span className={isDone ? 'text-emerald-700 font-bold' : 'text-gray-400'}>
                            {isDone ? '✓ Lolos' : 'Pending'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Group C: Eksternal */}
                <div className="rounded-2xl border border-gray-200 p-4">
                  <h5 className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <ShieldCheck className="h-4 w-4 text-amber-600" />
                    <span>C. Eksternal Tambang (PT Vale / Mitra)</span>
                  </h5>
                  <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {ORDERED_STAGES.slice(9, 13).map((st, subIdx) => {
                      const idx = subIdx + 9;
                      const isDone = selectedCandidate.stages_data[st.key]?.completed;
                      return (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => handleSelectStage(selectedCandidate.id, idx)}
                          className={`flex items-center justify-between rounded-xl p-2.5 text-xs transition border text-left cursor-pointer ${
                            isDone ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <span>{st.name}</span>
                          <span className={isDone ? 'text-emerald-700 font-bold' : 'text-gray-400'}>
                            {isDone ? '✓ Lolos' : 'Pending'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Selesai &amp; Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH KANDIDAT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Tambah Kandidat Rekrutmen Driver</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCandidate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700">Nama Lengkap Driver *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Andi Muhammad Rusli"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Nomor HP / WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: 081234567890"
                  value={newCandidate.phone}
                  onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Rekomendator (Orang yang merekomendasikan) *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Irfan Hakim (Supervisor Operasional)"
                  value={newCandidate.recommender}
                  onChange={(e) => setNewCandidate({ ...newCandidate, recommender: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Rekomendasi Penempatan Proyek *</label>
                <select
                  value={newCandidate.recommendation}
                  onChange={(e) => setNewCandidate({ ...newCandidate, recommendation: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Operasional Hauling Vale">Operasional Hauling Vale</option>
                  <option value="Driver Dump Truck CLM">Driver Dump Truck CLM</option>
                  <option value="Logistics Transport Hub">Logistics Transport Hub</option>
                  <option value="Heavy Equipment Trailer">Heavy Equipment Trailer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Keterangan</label>
                <textarea
                  rows={3}
                  placeholder="Keterangan berkas atau pengalaman sebelumnya..."
                  value={newCandidate.notes}
                  onChange={(e) => setNewCandidate({ ...newCandidate, notes: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                >
                  Simpan Kandidat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
