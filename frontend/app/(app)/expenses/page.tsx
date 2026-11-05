'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/AppShell';
import { supabase } from '@/lib/supabase';
import {
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Plus,
  FileText,
  Eye,
  X,
  FileSpreadsheet,
  Edit2
} from 'lucide-react';

export interface ExpenseItem {
  id: string;
  expense_date: string;
  description: string;
  category: 'Operasional' | 'Lainnya';
  amount: number;
  status: 'Pengajuan' | 'Dalam Proses' | 'Sudah Dibayar';
  notes: string;
  document_url?: string;
  submitted_by: string;
}

const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'EXP-2025-001',
    expense_date: '2025-02-28',
    description: 'Biaya Pengurusan SIM BII & Pengujian SIMPER 4 Driver Vale',
    category: 'Operasional',
    amount: 3200000,
    status: 'Sudah Dibayar',
    notes: 'Kuitansi lunas dari Satlantas & Departemen Training Vale Sorowako.',
    document_url: 'receipt_sim_vale.pdf',
    submitted_by: 'Irfan Hakim'
  },
  {
    id: 'EXP-2025-002',
    expense_date: '2025-02-27',
    description: 'Pelunasan MCU Laboratorium Semester I di RS Inco',
    category: 'Operasional',
    amount: 14500000,
    status: 'Dalam Proses',
    notes: 'Menunggu tanda tangan persetujuan transfer finance HO.',
    document_url: 'invoice_rsinco_mcu.pdf',
    submitted_by: 'Siti Rahmawati'
  },
  {
    id: 'EXP-2025-003',
    expense_date: '2025-02-25',
    description: 'Pengadaan APD & Rompi Reflektor Standar Tambang',
    category: 'Operasional',
    amount: 8750000,
    status: 'Sudah Dibayar',
    notes: 'Pembayaran transfer vendor safety equipment Makassar.',
    document_url: 'invoice_apd_safety.pdf',
    submitted_by: 'Andi Baso'
  },
  {
    id: 'EXP-2025-004',
    expense_date: '2025-02-24',
    description: 'Konsumsi Rapat Koordinasi Tahunan dengan Manajemen PT Vale',
    category: 'Lainnya',
    amount: 1850000,
    status: 'Pengajuan',
    notes: 'Pengajuan reimburse makan siang tim operasional & klien.',
    submitted_by: 'Nur Fadillah'
  },
  {
    id: 'EXP-2025-005',
    expense_date: '2025-02-20',
    description: 'Penggantian Sparepart Filter Udara Dump Truck Unit #14',
    category: 'Operasional',
    amount: 5400000,
    status: 'Sudah Dibayar',
    notes: 'Faktur suku cadang asli Komatsu dari dealer resmi.',
    document_url: 'faktur_komatsu.pdf',
    submitted_by: 'Irfan Hakim'
  }
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New expense form state
  const [newExpense, setNewExpense] = useState({
    description: '',
    category: 'Operasional' as 'Operasional' | 'Lainnya',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    status: 'Pengajuan' as 'Pengajuan' | 'Dalam Proses' | 'Sudah Dibayar',
    notes: '',
    submitted_by: 'Admin HC/GA Cabang'
  });

  // Supabase fetch with fallback
  useEffect(() => {
    async function loadExpenses() {
      try {
        const { data, error } = await supabase.from('expenses').select('*');
        if (data && data.length > 0 && !error) {
          const mapped: ExpenseItem[] = data.map((d: Record<string, unknown>, idx: number) => ({
            id: typeof d.id === 'string' || typeof d.id === 'number' ? `EXP-${d.id}` : `EXP-2025-00${idx + 1}`,
            expense_date: typeof d.expense_date === 'string' ? d.expense_date : '2025-02-28',
            description: typeof d.title === 'string' ? d.title : typeof d.description === 'string' ? d.description : 'Pengeluaran Operasional',
            category: d.category === 'Lainnya' ? 'Lainnya' : 'Operasional',
            amount: Number(d.amount) || 0,
            status:
              d.status === 'paid'
                ? 'Sudah Dibayar'
                : d.status === 'reviewing' || d.status === 'approved'
                ? 'Dalam Proses'
                : 'Pengajuan',
            notes: typeof d.notes === 'string' ? d.notes : '',
            submitted_by: 'Admin HC/GA'
          }));
          setExpenses(mapped);
        }
      } catch {
        // Fallback to initial state
      }
    }
    loadExpenses();
  }, []);

  const filteredExpenses = expenses.filter((item) => {
    const matchSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.submitted_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === 'ALL' || item.category === filterCategory;
    const matchStat = filterStatus === 'ALL' || item.status === filterStatus;
    return matchSearch && matchCat && matchStat;
  });

  // Calculate metrics
  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const paidAmount = expenses
    .filter((e) => e.status === 'Sudah Dibayar')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const inProcessAmount = expenses
    .filter((e) => e.status === 'Dalam Proses')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const submittedAmount = expenses
    .filter((e) => e.status === 'Pengajuan')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleExportExcel = () => {
    const headers = ['ID Biaya', 'Tanggal', 'Deskripsi Biaya', 'Kategori', 'Nominal (IDR)', 'Status', 'PIC', 'Catatan'];
    const rows = filteredExpenses.map(exp => [
      exp.id,
      exp.expense_date,
      `"${exp.description}"`,
      exp.category,
      exp.amount,
      exp.status,
      `"${exp.submitted_by}"`,
      `"${exp.notes}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `monitoring_biaya_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description.trim() || !newExpense.amount) return;

    const created: ExpenseItem = {
      id: `EXP-2025-00${expenses.length + 1}`,
      description: newExpense.description,
      category: newExpense.category,
      amount: Number(newExpense.amount),
      expense_date: newExpense.expense_date,
      status: newExpense.status,
      notes: newExpense.notes || 'Pengajuan baru dari cabang.',
      submitted_by: newExpense.submitted_by
    };

    setExpenses([created, ...expenses]);
    setShowAddModal(false);
    setNewExpense({
      description: '',
      category: 'Operasional',
      amount: '',
      expense_date: new Date().toISOString().split('T')[0],
      status: 'Pengajuan',
      notes: '',
      submitted_by: 'Admin HC/GA Cabang'
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;
    setExpenses(prev => prev.map(item => item.id === editingExpense.id ? editingExpense : item));
    setEditingExpense(null);
    alert(`Data biaya ${editingExpense.id} berhasil diperbarui!`);
  };

  return (
    <>
      <PageHeader
        title="Monitoring Biaya & Pengeluaran Cabang"
        subtitle="Tracking real-time alur pengajuan, verifikasi, hingga status pembayaran biaya operasional dan reimburse Cabang Luwu Raya."
        notificationCount={2}
      />

      <div className="mt-6 space-y-6">
        {/* KPI Cards Row */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-emerald-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Seluruh Pengeluaran
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-xl font-black text-gray-900">{formatRupiah(totalAmount)}</h3>
            </div>
            <p className="mt-2 text-[11px] text-gray-400">Total akumulasi periode aktif</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Sudah Dibayar
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-xl font-black text-emerald-700">{formatRupiah(paidAmount)}</h3>
            </div>
            <p className="mt-2 text-[11px] text-emerald-600">Selesai disbursement HO</p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-800">
                Dalam Proses Review
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-xl font-black text-blue-700">{formatRupiah(inProcessAmount)}</h3>
            </div>
            <p className="mt-2 text-[11px] text-blue-600">Tahap review finance & atasan</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Pengajuan Baru
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-xl font-black text-amber-700">{formatRupiah(submittedAmount)}</h3>
            </div>
            <p className="mt-2 text-[11px] text-amber-600">Menunggu antrean approval</p>
          </div>
        </section>

        {/* Toolbar & Filter Bar */}
        <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative min-w-[280px] flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari deskripsi biaya, ID transaksi, atau PIC..."
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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 focus:border-emerald-600 focus:outline-none"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Operasional">Operasional</option>
              <option value="Lainnya">Lainnya</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 focus:border-emerald-600 focus:outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="Pengajuan">Pengajuan</option>
              <option value="Dalam Proses">Dalam Proses</option>
              <option value="Sudah Dibayar">Sudah Dibayar</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Pengajuan Biaya</span>
            </button>
          </div>
        </section>

        {/* Tabel Monitoring Biaya */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-800">Daftar Transaksi & Biaya Cabang</span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                {filteredExpenses.length} Data
              </span>
            </div>
            <p className="text-xs text-gray-400">Pencatatan resmi keuangan Cabang Luwu Raya</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50/70 font-semibold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="px-4 py-3.5">ID / Tanggal</th>
                  <th className="px-4 py-3.5">Deskripsi Biaya & PIC</th>
                  <th className="px-4 py-3.5">Kategori</th>
                  <th className="px-4 py-3.5 text-right">Nominal (IDR)</th>
                  <th className="px-4 py-3.5 text-center">Status Pembayaran</th>
                  <th className="px-4 py-3.5 text-center">Dokumen</th>
                  <th className="px-4 py-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-normal">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="transition hover:bg-gray-50/60">
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-[11px] font-bold text-gray-500">{exp.id}</div>
                      <div className="text-[11px] text-gray-400">{exp.expense_date}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-sm font-bold text-gray-900">{exp.description}</div>
                      <div className="text-[11px] text-gray-500">Diajukan oleh: {exp.submitted_by}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          exp.category === 'Operasional'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-gray-900">
                      {formatRupiah(exp.amount)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          exp.status === 'Sudah Dibayar'
                            ? 'bg-emerald-100 text-emerald-800'
                            : exp.status === 'Dalam Proses'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {exp.status === 'Sudah Dibayar' && <CheckCircle2 className="h-3 w-3" />}
                        {exp.status === 'Dalam Proses' && <Clock className="h-3 w-3" />}
                        {exp.status === 'Pengajuan' && <AlertCircle className="h-3 w-3" />}
                        {exp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {exp.document_url ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <FileText className="h-3.5 w-3.5" /> Ada
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          title="Lihat Detail Biaya"
                          onClick={() => setSelectedExpense(exp)}
                          className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 transition hover:bg-emerald-100 hover:text-emerald-800"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          title="Edit Perkembangan Biaya"
                          onClick={() => setEditingExpense({ ...exp })}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-800"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* MODAL DETAIL BIAYA */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-700">
                  {selectedExpense.id}
                </span>
                <h3 className="text-lg font-black text-gray-900">{selectedExpense.description}</h3>
              </div>
              <button
                onClick={() => setSelectedExpense(null)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                <span className="text-gray-500">Nominal Pengeluaran</span>
                <span className="font-mono text-base font-black text-gray-900">
                  {formatRupiah(selectedExpense.amount)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-100 p-2.5">
                  <span className="block text-[10px] text-gray-400">Tanggal Pengajuan</span>
                  <span className="font-semibold text-gray-800">{selectedExpense.expense_date}</span>
                </div>
                <div className="rounded-xl border border-gray-100 p-2.5">
                  <span className="block text-[10px] text-gray-400">Kategori</span>
                  <span className="font-semibold text-gray-800">{selectedExpense.category}</span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 p-2.5">
                <span className="block text-[10px] text-gray-400">Diajukan Oleh</span>
                <span className="font-semibold text-gray-800">{selectedExpense.submitted_by}</span>
              </div>

              <div className="rounded-xl border border-gray-100 p-2.5">
                <span className="block text-[10px] text-gray-400">Catatan / Bukti Transaksi</span>
                <p className="mt-0.5 text-gray-700">{selectedExpense.notes}</p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-900">
                <span className="block text-[10px] font-bold uppercase">Status Pembayaran Terkini</span>
                <p className="mt-0.5 text-sm font-bold">{selectedExpense.status}</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedExpense(null)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT STATUS & PERKEMBANGAN BIAYA */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Edit Perkembangan Biaya: {editingExpense.id}</h3>
              <button onClick={() => setEditingExpense(null)} className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700">Deskripsi Biaya</label>
                <input
                  type="text"
                  value={editingExpense.description}
                  onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700">Kategori</label>
                  <select
                    value={editingExpense.category}
                    onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value as ExpenseItem['category'] })}
                    className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Operasional">Operasional</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">Status Biaya (Perkembangan) *</label>
                  <select
                    value={editingExpense.status}
                    onChange={(e) => setEditingExpense({ ...editingExpense, status: e.target.value as ExpenseItem['status'] })}
                    className="mt-1 w-full rounded-xl border border-emerald-600 bg-emerald-50/50 p-2.5 font-bold text-emerald-900 focus:outline-none"
                  >
                    <option value="Pengajuan">Pengajuan</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Sudah Dibayar">Sudah Dibayar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700">Nominal (IDR)</label>
                <input
                  type="number"
                  value={editingExpense.amount}
                  onChange={(e) => setEditingExpense({ ...editingExpense, amount: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 font-mono focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700">Catatan / Bukti Perkembangan</label>
                <textarea
                  rows={3}
                  value={editingExpense.notes}
                  onChange={(e) => setEditingExpense({ ...editingExpense, notes: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setEditingExpense(null)} className="rounded-xl border border-gray-300 px-4 py-2">
                  Batal
                </button>
                <button type="submit" className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-700">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH BIAYA DENGAN SECTION STATUS BIAYA */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Tambah Pengajuan Biaya Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700">Deskripsi Pengeluaran *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Pembayaran Iuran BPJS Ketenagakerjaan Tim Driver"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Kategori *</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        category: e.target.value as 'Operasional' | 'Lainnya'
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Operasional">Operasional</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700">Status Biaya Awal *</label>
                  <select
                    value={newExpense.status}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        status: e.target.value as 'Pengajuan' | 'Dalam Proses' | 'Sudah Dibayar'
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-emerald-600 bg-emerald-50/50 p-2.5 text-xs font-bold text-emerald-900 focus:outline-none"
                  >
                    <option value="Pengajuan">Pengajuan (Baru diajukan)</option>
                    <option value="Dalam Proses">Dalam Proses (Review HO)</option>
                    <option value="Sudah Dibayar">Sudah Dibayar (Lunas)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Tanggal Transaksi</label>
                  <input
                    type="date"
                    value={newExpense.expense_date}
                    onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700">Nominal (Rupiah) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Misal: 4500000"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 p-2.5 text-xs font-mono focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Catatan / Bukti Pendukung</label>
                <textarea
                  rows={3}
                  placeholder="Keterangan nomor faktur, kuitansi, atau rincian transaksi..."
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
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
                  Simpan Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
