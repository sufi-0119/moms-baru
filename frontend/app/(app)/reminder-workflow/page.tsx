'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/AppShell';
import {
  BellRing,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Mail,
  RotateCcw,
  Calendar,
  X,
  FileText
} from 'lucide-react';

export interface ReminderItem {
  id: string;
  task_name: string;
  category: 'Driver' | 'BPJS' | 'Catering' | 'Employee' | 'Facility';
  deadline: string;
  stage: 'H-7' | 'H-3' | 'H-1' | 'Hari H';
  repeat_cycle: 'Tidak berulang' | 'Monthly' | 'Quarterly' | 'Yearly';
  pic: string;
  recipient_email: string;
  notes: string;
  work_status: 'Belum Selesai' | 'Selesai';
  reminder_status: 'Aktif' | 'Selesai';
  last_sent: string;
}

const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'REM-2025-001',
    task_name: 'Perpanjangan SIM BII Umum Driver Hauling Vale',
    category: 'Driver',
    deadline: '2025-03-02',
    stage: 'Hari H',
    repeat_cycle: 'Yearly',
    pic: 'Irfan Hakim',
    recipient_email: 'irfan.hakim@kalla.co.id',
    notes: 'Wajib verifikasi kelayakan fisik & sertifikat safety SIM B2 Pertambangan',
    work_status: 'Belum Selesai',
    reminder_status: 'Aktif',
    last_sent: 'Hari H terkirim (08:15 WITA)'
  },
  {
    id: 'REM-2025-002',
    task_name: 'Pembayaran Iuran BPJS Ketenagakerjaan Tim Driver',
    category: 'BPJS',
    deadline: '2025-03-05',
    stage: 'H-3',
    repeat_cycle: 'Monthly',
    pic: 'Siti Rahmawati',
    recipient_email: 'siti.rahma@kalla.co.id',
    notes: 'Rekap 256 data NIK & premi asuransi wajib disinkronkan ke bank payroll',
    work_status: 'Belum Selesai',
    reminder_status: 'Aktif',
    last_sent: 'H-3 terkirim (09:00 WITA)'
  },
  {
    id: 'REM-2025-003',
    task_name: 'Verifikasi Higienitas Katering Mess Site Sorowako',
    category: 'Catering',
    deadline: '2025-03-03',
    stage: 'H-1',
    repeat_cycle: 'Monthly',
    pic: 'Nur Fadillah',
    recipient_email: 'nur.fadillah@kalla.co.id',
    notes: 'Inspeksi standar nutrisi dan katering shift malam vendor PT Boga Nusantara',
    work_status: 'Belum Selesai',
    reminder_status: 'Aktif',
    last_sent: 'H-1 terkirim (06:00 WITA)'
  },
  {
    id: 'REM-2025-004',
    task_name: 'Audit APD & Seragam Lapangan Driver Project',
    category: 'Driver',
    deadline: '2025-02-28',
    stage: 'H-7',
    repeat_cycle: 'Quarterly',
    pic: 'Andi Baso',
    recipient_email: 'andi.baso@kalla.co.id',
    notes: 'Sudah diselesaikan sebelum Hari H. Seluruh reminder otomatis dihentikan.',
    work_status: 'Selesai',
    reminder_status: 'Selesai',
    last_sent: 'Dihentikan (Pekerjaan Selesai)'
  },
  {
    id: 'REM-2025-005',
    task_name: 'Kalibrasi Timbangan & Uji Emisi Dump Truck Tambang',
    category: 'Facility',
    deadline: '2025-03-09',
    stage: 'H-7',
    repeat_cycle: 'Tidak berulang',
    pic: 'Nur Fadillah',
    recipient_email: 'nur.fadillah@kalla.co.id',
    notes: 'Disposisi teknisi dinas meteorologi untuk sertifikat laik jalan',
    work_status: 'Belum Selesai',
    reminder_status: 'Aktif',
    last_sent: 'H-7 terkirim (08:30 WITA)'
  }
];

export default function ReminderWorkflowPage() {
  const [reminders, setReminders] = useState<ReminderItem[]>(INITIAL_REMINDERS);
  const [activeTab, setActiveTab] = useState<'tasks' | 'history'>('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterWorkStatus, setFilterWorkStatus] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Reminder State
  const [newReminder, setNewReminder] = useState({
    task_name: '',
    deadline: '',
    pic: '',
    recipient_email: '',
    notes: '',
    category: 'Driver' as ReminderItem['category'],
    repeat_cycle: 'Tidak berulang' as ReminderItem['repeat_cycle']
  });

  const filteredReminders = reminders.filter((r) => {
    const matchSearch =
      r.task_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.pic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === 'ALL' || r.category === filterCategory;
    const matchWork = filterWorkStatus === 'ALL' || r.work_status === filterWorkStatus;
    return matchSearch && matchCat && matchWork;
  });

  const totalTasks = reminders.length;
  const completedTasks = reminders.filter((r) => r.work_status === 'Selesai').length;
  const activeTasks = totalTasks - completedTasks;

  const handleMarkComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              work_status: 'Selesai',
              reminder_status: 'Selesai',
              last_sent: 'Dihentikan (Pekerjaan Selesai)'
            }
          : r
      )
    );
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.task_name.trim() || !newReminder.deadline || !newReminder.recipient_email)
      return;

    const created: ReminderItem = {
      id: `REM-2025-00${reminders.length + 1}`,
      task_name: newReminder.task_name,
      category: newReminder.category,
      deadline: newReminder.deadline,
      stage: 'H-7',
      repeat_cycle: newReminder.repeat_cycle,
      pic: newReminder.pic || 'PIC Operasional',
      recipient_email: newReminder.recipient_email,
      notes: newReminder.notes || 'Pengingat otomatis dari workflow cabang.',
      work_status: 'Belum Selesai',
      reminder_status: 'Aktif',
      last_sent: 'Terjadwal otomatis'
    };

    setReminders([created, ...reminders]);
    setShowAddModal(false);
    setNewReminder({
      task_name: '',
      deadline: '',
      pic: '',
      recipient_email: '',
      notes: '',
      category: 'Driver',
      repeat_cycle: 'Tidak berulang'
    });
  };

  return (
    <>
      <PageHeader
        title="Reminder Workflow"
        subtitle="Siklus pengingat berjangka H-7, H-3, H-1, dan Hari H sesuai SOP Kalla Transport & Logistics Mining Site Vale."
        notificationCount={3}
      />

      <div className="mt-6 space-y-6">
        {/* KPI CARDS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-emerald-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status Tugas
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BellRing className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-gray-900">{activeTasks} Aktif</h3>
              <span className="text-xs text-gray-400">/ {totalTasks} Total</span>
            </div>
            <p className="mt-2 text-[11px] text-emerald-600 font-semibold">
              {completedTasks} Tugas Selesai Tepat Waktu
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Distribusi Tahapan
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1 text-center">
              <div className="rounded-lg bg-gray-50 p-1">
                <span className="block text-[10px] text-gray-400 font-bold">H-7</span>
                <span className="text-xs font-bold text-gray-800">2</span>
              </div>
              <div className="rounded-lg bg-gray-50 p-1">
                <span className="block text-[10px] text-gray-400 font-bold">H-3</span>
                <span className="text-xs font-bold text-amber-600">1</span>
              </div>
              <div className="rounded-lg bg-gray-50 p-1">
                <span className="block text-[10px] text-gray-400 font-bold">H-1</span>
                <span className="text-xs font-bold text-orange-600">1</span>
              </div>
              <div className="rounded-lg bg-rose-50 p-1">
                <span className="block text-[10px] text-rose-600 font-bold">Hari H</span>
                <span className="text-xs font-bold text-rose-700">1</span>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-gray-400">Siklus pengiriman 4 tahap</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Kategori Terbanyak
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Filter className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-lg font-black text-gray-900">Driver & Fleet</h3>
              <p className="text-xs text-amber-700 font-medium">SIM B2, MCU, Sertifikasi Mining</p>
            </div>
            <p className="mt-2 text-[11px] text-gray-400">Paling sensitif terhadap audit Vale</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Dispatch Email Otomatis
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Mail className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-emerald-700">100%</h3>
              <span className="text-xs text-emerald-800">Terkirim</span>
            </div>
            <p className="mt-2 text-[11px] text-emerald-600">Pemeriksaan cron tiap 15 menit</p>
          </div>
        </section>

        {/* TOOLBAR */}
        <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative min-w-[280px] flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari tugas reminder, ID task, atau PIC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs text-gray-800 placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 focus:border-emerald-600 focus:outline-none"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Driver">Driver & Fleet</option>
              <option value="BPJS">BPJS & Asuransi</option>
              <option value="Catering">Catering & Mess</option>
              <option value="Employee">Employee</option>
              <option value="Facility">Facility & Alat</option>
            </select>

            <select
              value={filterWorkStatus}
              onChange={(e) => setFilterWorkStatus(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 focus:border-emerald-600 focus:outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="Belum Selesai">Belum Selesai</option>
              <option value="Selesai">Selesai</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Reminder</span>
            </button>
          </div>
        </section>

        {/* TABEL REMINDER */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-800">Daftar Pengingat Berjalan</span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                {filteredReminders.length} Tugas
              </span>
            </div>
            <p className="text-xs text-gray-400">Email hanya dikirim pada H-7, H-3, H-1, dan Hari H</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50/70 font-semibold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="px-4 py-3.5">ID / Tugas</th>
                  <th className="px-4 py-3.5">Kategori</th>
                  <th className="px-4 py-3.5">Deadline & Siklus</th>
                  <th className="px-4 py-3.5">PIC & Email Penerima</th>
                  <th className="px-4 py-3.5 text-center">Status Pekerjaan</th>
                  <th className="px-4 py-3.5 text-center">Status Reminder</th>
                  <th className="px-4 py-3.5">Reminder Terakhir</th>
                  <th className="px-4 py-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-normal">
                {filteredReminders.map((r) => (
                  <tr key={r.id} className="transition hover:bg-gray-50/60">
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-[11px] font-bold text-emerald-700">{r.id}</div>
                      <div className="text-sm font-bold text-gray-900">{r.task_name}</div>
                      <div className="text-[11px] text-gray-400">{r.notes}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                        {r.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-900">{r.deadline}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            r.stage === 'Hari H'
                              ? 'bg-rose-100 text-rose-800'
                              : r.stage === 'H-1'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Tahap {r.stage}
                        </span>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 font-medium">
                          {r.repeat_cycle}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-900">{r.pic}</div>
                      <div className="text-[11px] text-gray-400">{r.recipient_email}</div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          r.work_status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.work_status === 'Selesai' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {r.work_status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          r.reminder_status === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {r.reminder_status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[11px] font-medium text-gray-600">{r.last_sent}</div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {r.work_status === 'Belum Selesai' ? (
                        <button
                          onClick={() => handleMarkComplete(r.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-100 active:scale-95"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Selesaikan
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-gray-400">Tuntas</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* POPUP TAMBAH REMINDER (5 FIELD WAJIB SESUAI PRD) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Tambah Reminder Task Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddReminder} className="mt-4 space-y-4">
              {/* Field 1: Nama Tugas */}
              <div>
                <label className="block text-xs font-bold text-gray-700">1. Nama Tugas *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Perpanjangan Sertifikat K3 Driver Dump Truck"
                  value={newReminder.task_name}
                  onChange={(e) => setNewReminder({ ...newReminder, task_name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Field 2: Deadline & Repeat */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700">2. Tanggal Deadline *</label>
                  <input
                    type="date"
                    required
                    value={newReminder.deadline}
                    onChange={(e) => setNewReminder({ ...newReminder, deadline: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700">Siklus Pengulangan *</label>
                  <select
                    value={newReminder.repeat_cycle}
                    onChange={(e) => setNewReminder({ ...newReminder, repeat_cycle: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Tidak berulang">Tidak berulang (H-7 s/d Hari H)</option>
                    <option value="Monthly">Monthly (Tiap Bulan)</option>
                    <option value="Quarterly">Quarterly (Triwulan)</option>
                    <option value="Yearly">Yearly (Tahunan)</option>
                  </select>
                </div>
              </div>

              {/* Field 3: PIC */}
              <div>
                <label className="block text-xs font-bold text-gray-700">3. PIC Penanggung Jawab *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Irfan Hakim"
                  value={newReminder.pic}
                  onChange={(e) => setNewReminder({ ...newReminder, pic: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Field 4: Email Penerima */}
              <div>
                <label className="block text-xs font-bold text-gray-700">4. Email Penerima Reminder *</label>
                <input
                  type="email"
                  required
                  placeholder="irfan.hakim@kalla.co.id"
                  value={newReminder.recipient_email}
                  onChange={(e) =>
                    setNewReminder({ ...newReminder, recipient_email: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Field 5: Keterangan / Catatan */}
              <div>
                <label className="block text-xs font-bold text-gray-700">5. Catatan / Keterangan (Opsional)</label>
                <textarea
                  rows={3}
                  placeholder="Instruksi tambahan bagi penerima pengingat..."
                  value={newReminder.notes}
                  onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
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
                  Simpan Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
