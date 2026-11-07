'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/AppShell';
import type { RecruitmentCandidate } from '@/lib/demo/types';
import { useDemoData } from '@/lib/demo/DemoDataProvider';
import { nextId } from '@/lib/demo/store';
import {
  applyStageUpdate,
  getEligibility,
  getRecruitmentProgress,
  ORDERED_STAGE_KEYS,
} from '@/lib/demo/recruitment';
import { useToast } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
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
  FileSpreadsheet,
  Trash2
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


export default function RecruitmentPage() {
  const { state, dispatch } = useDemoData();
  const { showToast } = useToast();
  const candidates = state.candidates;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEligibility, setFilterEligibility] = useState<string>('ALL');
  const [filterStageGroup, setFilterStageGroup] = useState<string>('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<RecruitmentCandidate | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<RecruitmentCandidate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RecruitmentCandidate | null>(null);
  const emptyForm = {
    name: '',
    phone: '',
    recommender: '',
    recommendation: 'Operasional Hauling Vale',
    notes: ''
  };
  const [newCandidate, setNewCandidate] = useState(emptyForm);

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
    const candidate = candidates.find((item) => item.id === candidateId);
    if (!candidate) return;

    const stages = { ...candidate.stages_data };
    ORDERED_STAGE_KEYS.forEach((key, index) => {
      stages[key] =
        index <= targetIndex
          ? { completed: true, date: stages[key]?.date ?? new Date().toISOString().split('T')[0] }
          : { completed: false };
    });

    const progress = getRecruitmentProgress(stages);
    const isAllDone = progress >= 100;
    const activeStageObj = ORDERED_STAGES[targetIndex];

    const updatedCandidate: RecruitmentCandidate = {
      ...candidate,
      stages_data: stages,
      progress_pct: progress,
      current_stage: isAllDone ? '13. SDT Praktik & SIMPER (Selesai)' : activeStageObj.name,
      stage_group: activeStageObj.group,
      eligibility_status: getEligibility(progress),
    };

    dispatch({ type: 'candidate/update', candidate: updatedCandidate });

    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate(updatedCandidate);
    }
    showToast(`Progres ${candidate.name} diperbarui menjadi ${progress}%.`, 'info');
  };

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.name.trim()) return;

    if (editingCandidate) {
      dispatch({
        type: 'candidate/update',
        candidate: {
          ...editingCandidate,
          name: newCandidate.name,
          phone: newCandidate.phone || '-',
          recommender: newCandidate.recommender || '-',
          recommendation: newCandidate.recommendation,
          notes: newCandidate.notes || editingCandidate.notes,
        },
      });
      showToast(`Data kandidat ${newCandidate.name} diperbarui.`);
      setShowAddModal(false);
      setEditingCandidate(null);
      setNewCandidate(emptyForm);
      return;
    }

    const newId = nextId('REC', candidates.map((item) => item.id));
    const base: RecruitmentCandidate = {
      id: newId,
      name: newCandidate.name,
      phone: newCandidate.phone || '-',
      recommender: newCandidate.recommender || '-',
      recommendation: newCandidate.recommendation,
      current_stage: '1. Seleksi Berkas',
      stage_group: 'Internal HO',
      eligibility_status: 'Belum Layak Kerja',
      progress_pct: 0,
      notes: newCandidate.notes || 'Kandidat baru terdaftar.',
      created_at: new Date().toISOString().split('T')[0],
      stages_data: {
        berkas: { completed: false },
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
    const created = applyStageUpdate(base, 'berkas', true);

    dispatch({ type: 'candidate/add', candidate: created });
    showToast(`Kandidat ${created.name} berhasil ditambahkan.`);
    setShowAddModal(false);
    setNewCandidate(emptyForm);
  };

  const handleDeleteCandidate = () => {
    if (!deleteTarget) return;
    dispatch({ type: 'candidate/delete', id: deleteTarget.id });
    showToast(`Kandidat ${deleteTarget.name} dihapus dari demo.`, 'info');
    setDeleteTarget(null);
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
              onClick={() => {
                setEditingCandidate(null);
                setNewCandidate(emptyForm);
                setShowAddModal(true);
              }}
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
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedCandidate(c)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
                        >
                          <Eye className="h-3.5 w-3.5" /> Detail &amp; Update Tahapan
                        </button>
                        <button
                          aria-label={`Edit kandidat ${c.name}`}
                          onClick={() => {
                            setEditingCandidate(c);
                            setNewCandidate({
                              name: c.name,
                              phone: c.phone,
                              recommender: c.recommender,
                              recommendation: c.recommendation,
                              notes: c.notes,
                            });
                            setShowAddModal(true);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                        >
                          <i className="fa-solid fa-pen-to-square text-xs" />
                        </button>
                        <button
                          aria-label={`Hapus kandidat ${c.name}`}
                          onClick={() => setDeleteTarget(c)}
                          className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCandidates.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="Tidak ada kandidat yang cocok"
                description="Ubah kata kunci, status kelayakan, atau grup tahapan untuk melihat kandidat demo."
              />
            </div>
          ) : null}
        </section>
      </div>

      <ConfirmDialog
        description={deleteTarget ? `Kandidat ${deleteTarget.name} akan dihapus dari data demo. Data produksi tidak terpengaruh.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteCandidate}
        open={deleteTarget !== null}
        title="Hapus kandidat?"
      />

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
                            {isDone ? 'âœ“ Lolos' : 'Pending'}
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
                            {isDone ? 'âœ“ Lolos' : 'Pending'}
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
                            {isDone ? 'âœ“ Lolos' : 'Pending'}
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
              <h3 className="text-base font-bold text-gray-900">
                {editingCandidate ? 'Edit Kandidat Rekrutmen Driver' : 'Tambah Kandidat Rekrutmen Driver'}
              </h3>
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
