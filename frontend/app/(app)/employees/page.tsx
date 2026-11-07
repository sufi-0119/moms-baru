'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/AppShell';
import { EmployeeModal } from './EmployeeModal';
import { useDemoData } from '@/lib/demo/DemoDataProvider';
import { nextId } from '@/lib/demo/store';
import { toEmployeesCsv } from '@/lib/demo/export';
import type { EmployeeData, EmployeeRecord } from '@/lib/demo/types';
import { useToast } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { X, User, Phone, Briefcase, Award, Heart, GraduationCap, Shield, Search, Trash2 } from 'lucide-react';

export default function EmployeesPage() {
  const { state, dispatch } = useDemoData();
  const { showToast } = useToast();
  const employees = state.employees;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<'Driver' | 'Karyawan'>('Karyawan');
  const [selectedTab, setSelectedTab] = useState<'all' | 'karyawan' | 'driver'>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRecord | null>(null);
  const [editingEmployeeData, setEditingEmployeeData] = useState<EmployeeRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EmployeeRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const openAddModal = (category: 'Driver' | 'Karyawan') => {
    setEditingEmployeeData(null);
    setModalCategory(category);
    setModalOpen(true);
  };

  const openEditModal = (emp: EmployeeRecord) => {
    setEditingEmployeeData(emp);
    setModalCategory(emp.category);
    setModalOpen(true);
  };

  const handleSaveModalData = (data: EmployeeData) => {
    if (editingEmployeeData) {
      dispatch({
        type: 'employee/update',
        employee: {
          ...editingEmployeeData,
          ...data,
          id: editingEmployeeData.id,
        } as EmployeeRecord,
      });
      showToast(`Data pegawai ${data.name} berhasil diperbarui.`);
    } else {
      const id = nextId(modalCategory === 'Driver' ? 'DRV' : 'EMP', employees.map((item) => item.id));
      const initials = data.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      const newEmployee: EmployeeRecord = {
        ...data,
        id,
        nikCompany: data.nikCompany || id,
        category: modalCategory,
        initials: initials || 'PE',
        active: true,
        urgent: false,
        remaining: '12 Bulan Lagi',
      };
      dispatch({ type: 'employee/add', employee: newEmployee });
      showToast(`Pegawai baru ${data.name} berhasil ditambahkan.`);
    }

    setModalOpen(false);
    setEditingEmployeeData(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    dispatch({ type: 'employee/delete', id: deleteTarget.id });
    showToast(`Data ${deleteTarget.name} dihapus dari demo.`, 'info');
    setDeleteTarget(null);
  };

  const handleExportExcel = () => {
    const csv = toEmployeesCsv(filteredList);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data_karyawan_driver_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`${filteredList.length} baris diekspor ke CSV.`);
  };

  const filteredList = employees.filter((emp) => {
    const normalized = searchQuery.trim().toLowerCase();
    if (selectedTab === 'karyawan' && emp.category !== 'Karyawan') return false;
    if (selectedTab === 'driver' && emp.category !== 'Driver') return false;
    if (!normalized) return true;
    return (
      emp.name.toLowerCase().includes(normalized) ||
      emp.nikKtp.toLowerCase().includes(normalized) ||
      emp.nikCompany.toLowerCase().includes(normalized) ||
      emp.position.toLowerCase().includes(normalized)
    );
  });

  return (
    <>
      <PageHeader
        title="Database Karyawan & Driver"
        subtitle="Kelola master data personil Kalla Transport & Logistics. Tracking kontrak, sertifikasi, dan status operasional real-time."
        notificationCount={5}
      />

      <div className="mt-6 space-y-6">
        {/* KPI Metrics Row */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-300">
            <div>
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Tenaga Kerja</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <h3 className="text-2xl font-extrabold text-gray-900">{employees.length}</h3>
                    <span className="text-xs font-normal text-gray-500">Orang</span>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-lg text-emerald-600">
                  <i className="fa-solid fa-users" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Action Toolbar */}
        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Tabs */}
            <div className="flex max-w-fit items-center gap-1.5 rounded-lg bg-gray-100/90 p-1">
              {([
                { id: 'all', label: 'Semua Data', count: employees.length },
                { id: 'karyawan', label: 'Karyawan Staff & Ops', count: employees.filter(e => e.category === 'Karyawan').length },
                { id: 'driver', label: 'Driver Project Vale', count: employees.filter(e => e.category === 'Driver').length },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`rounded-md px-4 py-2 text-xs font-bold transition-all ${
                    selectedTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label} <span className="ml-1 rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px]">{tab.count}</span>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="relative">
                <span className="sr-only">Cari karyawan atau driver</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  className="h-10 w-full min-w-[200px] rounded-lg border border-gray-300 pl-9 pr-3 text-xs focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cari nama, NIK, jabatan..."
                  type="search"
                  value={searchQuery}
                />
              </label>
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3.5 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <i className="fa-regular fa-file-excel text-emerald-700" />
                <span>Export Excel</span>
              </button>
              <button
                onClick={() => openAddModal('Driver')}
                className="flex items-center gap-2 rounded-lg border border-emerald-600 px-3.5 py-2.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                <i className="fa-solid fa-id-card" />
                <span>+ Tambah Driver</span>
              </button>
              <button
                onClick={() => openAddModal('Karyawan')}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-emerald-700/20 hover:bg-emerald-700 active:scale-95"
              >
                <i className="fa-solid fa-user-plus" />
                <span>+ Tambah Karyawan</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Data Table Section */}
      <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800">Daftar Tenaga Kerja Terdaftar</span>
            <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-600">
              Total {filteredList.length} data
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50/90 font-semibold uppercase tracking-wider text-gray-600">
              <tr>
                <th className="px-4 py-3.5">NIK / NID</th>
                <th className="px-4 py-3.5">Nama Lengkap & Detail</th>
                <th className="px-4 py-3.5">Posisi & Jabatan</th>
                <th className="px-4 py-3.5">Wilayah / Project Site</th>
                <th className="px-4 py-3.5">Status Hubungan Kerja</th>
                <th className="px-4 py-3.5">Sisa Masa Kontrak</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-normal">
              {filteredList.map((emp) => (
                <tr key={emp.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3.5">
                    <div className="font-mono font-bold text-gray-800">{emp.id}</div>
                    <div className="block text-[10px] font-normal text-gray-400">{emp.nikKtp}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-bold text-[10px] ${
                          emp.category === 'Driver'
                            ? 'border-amber-300 bg-amber-100 text-amber-900'
                            : 'border-emerald-300 bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {emp.initials}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{emp.name}</div>
                        <div className="text-[11px] text-gray-500">{emp.emailPersonal}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-gray-800">{emp.position}</div>
                    <div className="text-[10px] text-gray-400">{emp.jobLevel}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-gray-800">{emp.site}</div>
                    <div className="text-[10px] text-gray-500">{emp.addressDomisili}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`rounded-md px-2.5 py-1 text-[11px] font-bold border ${
                        emp.contractStatus.includes('Kartap')
                          ? 'border-emerald-200 bg-emerald-100 text-emerald-800'
                          : 'border-amber-200 bg-amber-100 text-amber-800'
                      }`}
                    >
                      {emp.contractStatus}
                    </span>
                    <div className="mt-0.5 text-[10px] text-gray-500">{emp.skNumber}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-gray-700">{emp.remaining}</div>
                    <div className="text-[10px] text-gray-500">{emp.contractEnd}</div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600" /> Aktif
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        title="Lihat Detail Profil Lengkap (8 Bagian)"
                        onClick={() => setSelectedEmployee(emp)}
                        className="flex h-7 w-7 items-center justify-center rounded bg-gray-100 text-gray-600 transition-colors hover:bg-emerald-100 hover:text-emerald-700"
                      >
                        <i className="fa-regular fa-eye" />
                      </button>
                      <button
                        title="Edit Data Personil (Form Pop-up 8 Bagian)"
                        onClick={() => openEditModal(emp)}
                        className="flex h-7 w-7 items-center justify-center rounded bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100 hover:text-emerald-800"
                      >
                        <i className="fa-solid fa-pen-to-square" />
                      </button>
                      <button
                        title="Hapus data personil"
                        onClick={() => setDeleteTarget(emp)}
                        className="flex h-7 w-7 items-center justify-center rounded bg-rose-50 text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700"
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
        {filteredList.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="Tidak ada data yang cocok"
              description="Ubah kata kunci pencarian atau pilih tab kategori lain untuk melihat data demo."
            />
          </div>
        ) : null}
      </section>

      {/* MODAL VIEW DETAIL DATA DIRI LENGKAP (8 BAGIAN) */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-slate-900 px-6 py-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 text-lg">
                  {selectedEmployee.initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedEmployee.name}</h3>
                  <p className="text-xs text-slate-300">{selectedEmployee.position} &bull; {selectedEmployee.site}</p>
                </div>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content (8 Group Sections) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Bagian 1: Identitas */}
              <div className="rounded-xl border border-gray-200 p-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b pb-2 mb-3">
                  <User className="h-4 w-4" /> 1. Identitas Pribadi
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><span className="text-gray-400 block text-[10px]">Nama Lengkap</span><strong>{selectedEmployee.name}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Panggilan</span><strong>{selectedEmployee.nickname || '-'}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Tempat, Tgl Lahir</span><strong>{selectedEmployee.birthPlace}, {selectedEmployee.birthDate}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Jenis Kelamin</span><strong>{selectedEmployee.gender}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Agama</span><strong>{selectedEmployee.religion}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Golongan Darah</span><strong>{selectedEmployee.blood}</strong></div>
                </div>
              </div>

              {/* Bagian 2: Kontak & Domisili */}
              <div className="rounded-xl border border-gray-200 p-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b pb-2 mb-3">
                  <Phone className="h-4 w-4" /> 2. Kontak & Domisili
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2"><span className="text-gray-400 block text-[10px]">Alamat KTP</span><strong>{selectedEmployee.addressKtp}</strong></div>
                  <div className="md:col-span-2"><span className="text-gray-400 block text-[10px]">Alamat Domisili</span><strong>{selectedEmployee.addressDomisili}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">No Telepon / WA</span><strong>{selectedEmployee.phone}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Email Pribadi</span><strong>{selectedEmployee.emailPersonal}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Email Kalla</span><strong>{selectedEmployee.emailKalla || '-'}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Email Outlook</span><strong>{selectedEmployee.emailOutlook || '-'}</strong></div>
                </div>
              </div>

              {/* Bagian 3: Dokumen Legal */}
              <div className="rounded-xl border border-gray-200 p-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b pb-2 mb-3">
                  <Shield className="h-4 w-4" /> 3. Dokumen Legalitas
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><span className="text-gray-400 block text-[10px]">NIK KTP</span><strong className="font-mono">{selectedEmployee.nikKtp}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">No. Kartu Keluarga</span><strong className="font-mono">{selectedEmployee.noKk}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">NPWP</span><strong className="font-mono">{selectedEmployee.npwp || '-'}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">BPJS Kesehatan</span><strong className="font-mono">{selectedEmployee.bpjsKesehatan || '-'}</strong></div>
                  <div className="md:col-span-2"><span className="text-gray-400 block text-[10px]">BPJS Ketenagakerjaan</span><strong className="font-mono">{selectedEmployee.bpjsKetenagakerjaan || '-'}</strong></div>
                </div>
              </div>

              {/* Bagian 4: Pendidikan */}
              <div className="rounded-xl border border-gray-200 p-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b pb-2 mb-3">
                  <GraduationCap className="h-4 w-4" /> 4. Riwayat Pendidikan
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><span className="text-gray-400 block text-[10px]">Jenjang Terakhir</span><strong>{selectedEmployee.educationLevel}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Institusi / Sekolah</span><strong>{selectedEmployee.schoolName}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Jurusan</span><strong>{selectedEmployee.major || '-'}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Tahun Lulus</span><strong>{selectedEmployee.graduationYear || '-'}</strong></div>
                </div>
              </div>

              {/* Bagian 5 & 6: Pekerjaan & Kontrak */}
              <div className="rounded-xl border border-gray-200 p-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b pb-2 mb-3">
                  <Briefcase className="h-4 w-4" /> 5 &amp; 6. Pekerjaan, Penempatan &amp; Kontrak
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><span className="text-gray-400 block text-[10px]">NID / NIK Perusahaan</span><strong className="font-mono">{selectedEmployee.nikCompany}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Posisi / Jabatan</span><strong>{selectedEmployee.position}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Wilayah Kerja</span><strong>{selectedEmployee.site}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Status Hubungan Kerja</span><strong className="text-emerald-700">{selectedEmployee.contractStatus}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Tanggal Masuk</span><strong>{selectedEmployee.joinDate}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">No. SK Kontrak</span><strong className="font-mono">{selectedEmployee.skNumber || '-'}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Masa Kontrak</span><strong>{selectedEmployee.contractStart} s/d {selectedEmployee.contractEnd}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Sisa Masa Kontrak</span><strong className="text-amber-700">{selectedEmployee.remaining}</strong></div>
                </div>
              </div>

              {/* Bagian 7: Keluarga */}
              <div className="rounded-xl border border-gray-200 p-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b pb-2 mb-3">
                  <Heart className="h-4 w-4" /> 7. Data Keluarga &amp; Kontak Darurat
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><span className="text-gray-400 block text-[10px]">Status Nikah</span><strong>{selectedEmployee.maritalStatus}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Nama Pasangan</span><strong>{selectedEmployee.spouseName || '-'}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Jumlah Anak</span><strong>{selectedEmployee.childrenCount} Orang</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Nama Ibu Kandung</span><strong>{selectedEmployee.motherName || '-'}</strong></div>
                  <div className="md:col-span-2"><span className="text-gray-400 block text-[10px]">Kontak Darurat</span><strong>{selectedEmployee.emergencyName} ({selectedEmployee.emergencyPhone})</strong></div>
                </div>
              </div>

              {/* Bagian 8: Pelengkap, APD & MCU */}
              <div className="rounded-xl border border-gray-200 p-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b pb-2 mb-3">
                  <Award className="h-4 w-4" /> 8. Data Pelengkap, APD &amp; MCU
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><span className="text-gray-400 block text-[10px]">Ukuran Baju</span><strong>{selectedEmployee.uniformSize}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Ukuran Sepatu Safety</span><strong>{selectedEmployee.shoeSize}</strong></div>
                  <div className="md:col-span-2"><span className="text-gray-400 block text-[10px]">Hasil MCU Terakhir</span><strong className="text-emerald-700">{selectedEmployee.mcuStatus}</strong></div>
                  <div><span className="text-gray-400 block text-[10px]">Nama Bank</span><strong>{selectedEmployee.bankName || '-'}</strong></div>
                  <div className="md:col-span-2"><span className="text-gray-400 block text-[10px]">No Rekening</span><strong className="font-mono">{selectedEmployee.bankAccount || '-'} a.n {selectedEmployee.accountHolder || '-'}</strong></div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex justify-between items-center shrink-0">
              <button
                onClick={() => {
                  const emp = selectedEmployee;
                  setSelectedEmployee(null);
                  openEditModal(emp);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700"
              >
                <i className="fa-solid fa-pen-to-square" />
                <span>Buka Form Edit Personil</span>
              </button>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="rounded-lg border border-gray-300 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        description={deleteTarget ? `Data ${deleteTarget.name} akan dihapus dari data demo. Tindakan ini tidak memengaruhi data produksi.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        open={deleteTarget !== null}
        title="Hapus data personil?"
      />

      {/* MODAL MULTI-STEP 8 BAGIAN (TAMBAH & EDIT) */}
      <EmployeeModal
        key={`${modalOpen}-${editingEmployeeData?.id ?? 'new'}-${modalCategory}`}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingEmployeeData(null); }}
        category={modalCategory}
        initialData={editingEmployeeData}
        onSave={handleSaveModalData}
      />
    </>
  );
}
