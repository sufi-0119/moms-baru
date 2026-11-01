'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/AppShell';
import { supabase } from '@/lib/supabase';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Mail,
  Eye,
  Edit2,
  ChevronRight,
  ShieldCheck,
  Building,
  HardHat,
  FileText,
  X
} from 'lucide-react';

export interface RecruitmentCandidate {
  id: string;
  name: string;
  phone: string;
  recommendation: string;
  current_stage: string;
  stage_group: 'Internal HO' | 'Internal Cabang' | 'Eksternal';
  eligibility_status: 'Layak Kerja' | 'Belum Layak Kerja';
  progress_pct: number;
  notes: string;
  created_at: string;
  email_sent: boolean;
  stages_data: {
    // Internal HO
    berkas: { completed: boolean; date?: string; notes?: string };
    interview: { completed: boolean; date?: string; notes?: string };
    tpub: { completed: boolean; date?: string; notes?: string };
    // Internal Cabang
    praktik: { completed: boolean; date?: string; notes?: string };
    kontrak: { completed: boolean; date?: string; notes?: string };
    bpjs: { completed: boolean; date?: string; notes?: string };
    pkwt: { completed: boolean; date?: string; notes?: string };
    osc: { completed: boolean; date?: string; notes?: string };
    mcu: { completed: boolean; date?: string; notes?: string };
    // Eksternal
    gip_ebs: { completed: boolean; date?: string; notes?: string };
    badge: { completed: boolean; date?: string; notes?: string };
    sdt_teori: { completed: boolean; date?: string; notes?: string };
    sdt_praktik: { completed: boolean; date?: string; notes?: string };
    simper: { completed: boolean; date?: string; notes?: string };
  };
}

const INITIAL_CANDIDATES: RecruitmentCandidate[] = [
  {
    id: 'REC-2025-001',
    name: 'Ahmad Faisal',
    phone: '081244556677',
    recommendation: 'Operasional Hauling Vale',
    current_stage: 'SIMPER',
    stage_group: 'Eksternal',
    eligibility_status: 'Layak Kerja',
    progress_pct: 100,
    notes: 'Seluruh tahap selesai, lulus pengujian SIMPER PT Vale dengan predikat memuaskan.',
    created_at: '2025-02-10',
    email_sent: true,
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
      sdt_praktik: { completed: true, date: '2025-03-01' },
      simper: { completed: true, date: '2025-03-02' }
    }
  },
  {
    id: 'REC-2025-002',
    name: 'Bambang Sutrisno',
    phone: '082199887766',
    recommendation: 'Driver Dump Truck CLM',
    current_stage: 'MCU',
    stage_group: 'Internal Cabang',
    eligibility_status: 'Belum Layak Kerja',
    progress_pct: 65,
    notes: 'Sedang menunggu hasil laboratorium MCU lanjutan dari RS Inco.',
    created_at: '2025-02-14',
    email_sent: false,
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
      sdt_praktik: { completed: false },
      simper: { completed: false }
    }
  },
  {
    id: 'REC-2025-003',
    name: 'Reza Pratama',
    phone: '085233441122',
    recommendation: 'Logistics Transport Hub',
    current_stage: 'Interview',
    stage_group: 'Internal HO',
    eligibility_status: 'Belum Layak Kerja',
    progress_pct: 15,
    notes: 'Dijadwalkan interview user cabang pada tanggal 5 Maret.',
    created_at: '2025-02-25',
    email_sent: false,
    stages_data: {
      berkas: { completed: true, date: '2025-02-25' },
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
      sdt_praktik: { completed: false },
      simper: { completed: false }
    }
  },
  {
    id: 'REC-2025-004',
    name: 'Wahyu Hidayat',
    phone: '081399445522',
    recommendation: 'Heavy Equipment Trailer',
    current_stage: 'SIMPER',
    stage_group: 'Eksternal',
    eligibility_status: 'Layak Kerja',
    progress_pct: 100,
    notes: 'Kandidat telah lolos pengesahan dokumen dan siap dipindahtugaskan ke operasional tambang.',
    created_at: '2025-02-05',
    email_sent: false,
    stages_data: {
      berkas: { completed: true },
      interview: { completed: true },
      tpub: { completed: true },
      praktik: { completed: true },
      kontrak: { completed: true },
      bpjs: { completed: true },
      pkwt: { completed: true },
      osc: { completed: true },
      mcu: { completed: true },
      gip_ebs: { completed: true },
      badge: { completed: true },
      sdt_teori: { completed: true },
      sdt_praktik: { completed: true },
      simper: { completed: true }
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
    recommendation: 'Operasional Hauling Vale',
    notes: ''
  });

  // Fetch from Supabase with fallback to local state
  useEffect(() => {
    async function loadCandidates() {
      try {
        const { data, error } = await supabase.from('recruitment_candidates').select('*');
        if (data && data.length > 0 && !error) {
          // Map DB columns to local state
          const mapped: RecruitmentCandidate[] = data.map((d: any, idx: number) => ({
            id: d.id ? `REC-${d.id}` : `REC-2025-00${idx + 1}`,
            name: d.name || 'Kandidat',
            phone: d.phone || '08123456789',
            recommendation: d.position_applied || 'Operasional Hauling Vale',
            current_stage: d.status || 'Interview',
            stage_group: 'Internal Cabang',
            eligibility_status: d.status === 'onboarding' ? 'Layak Kerja' : 'Belum Layak Kerja',
            progress_pct: d.status === 'onboarding' ? 100 : 50,
            notes: d.notes || '',
            created_at: d.created_at || '2025-02-20',
            email_sent: false,
            stages_data: INITIAL_CANDIDATES[0].stages_data
          }));
          setCandidates(mapped);
        }
      } catch {
        // Safe fallback to initial state
      }
    }
    loadCandidates();
  }, []);

  const filteredCandidates = candidates.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.recommendation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchElig = filterEligibility === 'ALL' || c.eligibility_status === filterEligibility;
    const matchGroup = filterStageGroup === 'ALL' || c.stage_group === filterStageGroup;
    return matchSearch && matchElig && matchGroup;
  });

  const totalCandidates = candidates.length;
  const readyCandidates = candidates.filter((c) => c.eligibility_status === 'Layak Kerja').length;
  const inProgressCandidates = totalCandidates - readyCandidates;

  const handleSendOperationalEmail = (candidate: RecruitmentCandidate) => {
    if (candidate.email_sent) {
      alert(`Email rekomendasi operasional untuk ${candidate.name} sudah dikirim sebelumnya.`);
      return;
    }
    const confirmSend = window.confirm(
      `Kirim email rekomendasi driver layak kerja untuk ${candidate.name} kepada Tim Operasional Cabang Luwu Raya?`
    );
    if (confirmSend) {
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidate.id ? { ...c, email_sent: true } : c))
      );
      if (selectedCandidate && selectedCandidate.id === candidate.id) {
        setSelectedCandidate({ ...selectedCandidate, email_sent: true });
      }
      alert(`Notifikasi email rekomendasi berhasil dikirim ke fleet.ops@kalla.co.id.`);
    }
  };

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.name.trim()) return;

    const newId = `REC-2025-00${candidates.length + 1}`;
    const created: RecruitmentCandidate = {
      id: newId,
      name: newCandidate.name,
      phone: newCandidate.phone || '08123456789',
      recommendation: newCandidate.recommendation,
      current_stage: 'Seleksi Berkas',
      stage_group: 'Internal HO',
      eligibility_status: 'Belum Layak Kerja',
      progress_pct: 10,
      notes: newCandidate.notes || 'Kandidat baru terdaftar.',
      created_at: new Date().toISOString().split('T')[0],
      email_sent: false,
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
        sdt_praktik: { completed: false },
        simper: { completed: false }
      }
    };

    setCandidates([created, ...candidates]);
    setShowAddModal(false);
    setNewCandidate({ name: '', phone: '', recommendation: 'Operasional Hauling Vale', notes: '' });
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
            <p className="mt-2 text-[11px] text-amber-600">Menyelesaikan tahap HO / Cabang</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Pipeline 13 Tahap
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-purple-700">3 Level</h3>
              <span className="text-xs text-gray-500">HO, Cabang & Eksternal</span>
            </div>
            <p className="mt-2 text-[11px] text-gray-400">Standar keselamatan Kalla & Vale</p>
          </div>
        </section>

        {/* 13 Tahapan Pipeline Overview Banner */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-gray-900">Alur Standar 13 Tahapan Rekrutmen Driver</h4>
              <p className="text-xs text-gray-500">Monitoring per tahapan dari internal hingga sertifikasi lapangan.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
              SOP Terverifikasi
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* HO Group */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Building className="h-4 w-4 text-blue-600" />
                <span>A. Internal HO (3 Tahap)</span>
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-blue-800">
                <li>1. Seleksi Berkas</li>
                <li>2. Interview HO & User</li>
                <li>3. Tes TPUB</li>
              </ul>
            </div>

            {/* Cabang Group */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <HardHat className="h-4 w-4 text-emerald-600" />
                <span>B. Internal Cabang (6 Tahap)</span>
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-emerald-800">
                <li>4. Tes Praktik & Skill Drive</li>
                <li>5. Penandatanganan Kontrak</li>
                <li>6. Rekomendasi BPJS & Asuransi</li>
                <li>7. Pelaporan PKWT Disnaker</li>
                <li>8. Registrasi OSC & Safety</li>
                <li>9. MCU Full Lab (Fit To Work)</li>
              </ul>
            </div>

            {/* Eksternal Group */}
            <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                <span>C. Eksternal Tambang (5 Tahap)</span>
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-amber-800">
                <li>10. Training GIP & EBS Site</li>
                <li>11. Penerbitan Badge Number</li>
                <li>12. Training SDT Teori</li>
                <li>13. Training SDT Praktik & SIMPER</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Toolbar & Filters */}
        <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative min-w-[280px] flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama driver, ID, atau rekomendasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs text-gray-800 placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
            <p className="text-xs text-gray-400">Diperbarui real-time dari proses seleksi cabang</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50/70 font-semibold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="px-4 py-3.5">ID / Nama Driver</th>
                  <th className="px-4 py-3.5">Rekomendasi Penempatan</th>
                  <th className="px-4 py-3.5">Tahap Terkini</th>
                  <th className="px-4 py-3.5">Progres 13 Tahap</th>
                  <th className="px-4 py-3.5 text-center">Status Kelayakan</th>
                  <th className="px-4 py-3.5 text-center">Email Operasional</th>
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
                      <div className="text-[10px] text-gray-400">Cabang Luwu Raya</div>
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
                      {c.eligibility_status === 'Layak Kerja' ? (
                        c.email_sent ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Terkirim
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSendOperationalEmail(c)}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-600 bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-50 active:scale-95"
                          >
                            <Mail className="h-3.5 w-3.5" /> Kirim Rekomendasi
                          </button>
                        )
                      ) : (
                        <span className="text-[11px] text-gray-400">Belum Memenuhi</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => setSelectedCandidate(c)}
                        className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-emerald-100 hover:text-emerald-800"
                      >
                        <Eye className="h-3.5 w-3.5" /> Detail Tahapan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* DETAIL MODAL 13 TAHAPAN */}
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
                  Rekomendasi: {selectedCandidate.recommendation} &bull; No: {selectedCandidate.phone}
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
                  <p className="text-lg font-black">{selectedCandidate.eligibility_status}</p>
                  <p className="mt-0.5 text-xs">{selectedCandidate.notes}</p>
                </div>
                {selectedCandidate.eligibility_status === 'Layak Kerja' && (
                  <div>
                    {selectedCandidate.email_sent ? (
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-200/80 px-3 py-1.5 text-xs font-bold text-emerald-900">
                        <CheckCircle2 className="h-4 w-4" /> Email Terkirim
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendOperationalEmail(selectedCandidate)}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-800"
                      >
                        <Mail className="h-4 w-4" /> Kirim Email Operasional
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 13 Steps Breakdown Checklist */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900">Rincian Progres 13 Tahapan Seleksi</h4>

                {/* Group A */}
                <div className="rounded-2xl border border-gray-200 p-4">
                  <h5 className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span>A. Internal HO</span>
                  </h5>
                  <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 text-xs">
                      <span>1. Seleksi Berkas</span>
                      <span className="font-bold text-emerald-700">✓ Selesai</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 text-xs">
                      <span>2. Interview</span>
                      <span className={selectedCandidate.progress_pct >= 20 ? 'font-bold text-emerald-700' : 'text-gray-400'}>
                        {selectedCandidate.progress_pct >= 20 ? '✓ Selesai' : 'Belum'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 text-xs">
                      <span>3. TPUB</span>
                      <span className={selectedCandidate.progress_pct >= 30 ? 'font-bold text-emerald-700' : 'text-gray-400'}>
                        {selectedCandidate.progress_pct >= 30 ? '✓ Selesai' : 'Belum'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Group B */}
                <div className="rounded-2xl border border-gray-200 p-4">
                  <h5 className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <HardHat className="h-4 w-4 text-emerald-600" />
                    <span>B. Internal Cabang</span>
                  </h5>
                  <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 text-xs">
                      <span>4. Tes Praktik</span>
                      <span className={selectedCandidate.progress_pct >= 40 ? 'font-bold text-emerald-700' : 'text-gray-400'}>
                        {selectedCandidate.progress_pct >= 40 ? '✓ Selesai' : 'Belum'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 text-xs">
                      <span>5. Kontrak</span>
                      <span className={selectedCandidate.progress_pct >= 50 ? 'font-bold text-emerald-700' : 'text-gray-400'}>
                        {selectedCandidate.progress_pct >= 50 ? '✓ Selesai' : 'Belum'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 text-xs">
                      <span>6. Rekomendasi BPJS</span>
                      <span className={selectedCandidate.progress_pct >= 60 ? 'font-bold text-emerald-700' : 'text-gray-400'}>
                        {selectedCandidate.progress_pct >= 60 ? '✓ Selesai' : 'Belum'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 text-xs">
                      <span>7. Pelaporan PKWT</span>
                      <span className={selectedCandidate.progress_pct >= 65 ? 'font-bold text-emerald-700' : 'text-gray-400'}>
                        {selectedCandidate.progress_pct >= 65 ? '✓ Selesai' : 'Belum'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 text-xs">
                      <span>8. Registrasi OSC</span>
                      <span className={selectedCandidate.progress_pct >= 70 ? 'font-bold text-emerald-700' : 'text-gray-400'}>
                        {selectedCandidate.progress_pct >= 70 ? '✓ Selesai' : 'Belum'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 text-xs">
                      <span>9. MCU Fit To Work</span>
                      <span className={selectedCandidate.progress_pct >= 75 ? 'font-bold text-emerald-700' : 'text-gray-400'}>
                        {selectedCandidate.progress_pct >= 75 ? '✓ Selesai' : 'Belum'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Group C */}
                <div className="rounded-2xl border border-gray-200 p-4">
                  <h5 className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <ShieldCheck className="h-4 w-4 text-amber-600" />
                    <span>C. Eksternal Tambang</span>
                  </h5>
                  <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 text-xs">
                      <span>10. Training GIP & EBS</span>
                      <span className={selectedCandidate.progress_pct >= 85 ? 'font-bold text-emerald-700' : 'text-gray-400'}>
                        {selectedCandidate.progress_pct >= 85 ? '✓ Selesai' : 'Belum'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 text-xs">
                      <span>11. Badge Number</span>
                      <span className={selectedCandidate.progress_pct >= 90 ? 'font-bold text-emerald-700' : 'text-gray-400'}>
                        {selectedCandidate.progress_pct >= 90 ? '✓ Selesai' : 'Belum'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 text-xs">
                      <span>12. SDT Teori & Praktik</span>
                      <span className={selectedCandidate.progress_pct >= 95 ? 'font-bold text-emerald-700' : 'text-gray-400'}>
                        {selectedCandidate.progress_pct >= 95 ? '✓ Selesai' : 'Belum'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 text-xs">
                      <span>13. Terbit SIMPER</span>
                      <span className={selectedCandidate.progress_pct === 100 ? 'font-bold text-emerald-700' : 'text-gray-400'}>
                        {selectedCandidate.progress_pct === 100 ? '✓ Selesai' : 'Belum'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Tutup Rincian
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
                <label className="block text-xs font-bold text-gray-700">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  placeholder="Misal: 081234567890"
                  value={newCandidate.phone}
                  onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Rekomendasi Penempatan Proyek</label>
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
                <label className="block text-xs font-bold text-gray-700">Catatan Awal</label>
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
