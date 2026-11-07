'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/AppShell';
import { EmployeeModal } from './EmployeeModal';
import type { EmployeeData } from '@/lib/demo/types';
import { X, User, Phone, Briefcase, Award, Heart, GraduationCap, Shield } from 'lucide-react';

interface EmployeeItem extends EmployeeData {
  id: string;
  initials: string;
  active: boolean;
  urgent: boolean;
  remaining: string;
}

const INITIAL_EMPLOYEES: EmployeeItem[] = [
  {
    id: 'KL-20220814',
    nikCompany: 'KL-20220814',
    nikKtp: '7312019950001',
    noKk: '7312019950002',
    npwp: '12.345.678.9-001.000',
    bpjsKesehatan: '000123456789',
    bpjsKetenagakerjaan: '1900123456',
    initials: 'IP',
    name: 'Ilham Pratama, S.T.',
    nickname: 'Ilham',
    birthPlace: 'Makassar',
    birthDate: '1992-08-14',
    gender: 'Laki-laki',
    religion: 'Islam',
    blood: 'O+',
    addressKtp: 'Jl. Urip Sumoharjo No. 45, Makassar',
    addressDomisili: 'Mess Kalla Transport, Sorowako, Luwu Timur',
    emailPersonal: 'ilham.pratama@gmail.com',
    emailKalla: 'ilham.pratama@kalla.co.id',
    emailOutlook: 'ilham.pratama@outlook.com',
    phone: '081244556677',
    position: 'Fleet Maintenance Supervisor',
    jobLevel: 'Supervisor / Foreman',
    site: 'Project Vale Sorowako',
    contractStatus: 'PKWT-2',
    joinDate: '2022-08-14',
    skNumber: '088/HR-VALE/2023',
    skDate: '2023-01-15',
    contractStart: '2024-03-01',
    contractEnd: '2025-02-28',
    remaining: '11 Hari Lagi',
    maritalStatus: 'Menikah',
    spouseName: 'Nurhaliza, S.Pd',
    childrenCount: 2,
    motherName: 'Hj. Aminah',
    emergencyName: 'Andi Pratama (Adik)',
    emergencyPhone: '081299887766',
    educationLevel: 'Sarjana (S1 / D4)',
    schoolName: 'Universitas Hasanuddin (UNHAS)',
    major: 'Teknik Mesin',
    graduationYear: '2015',
    uniformSize: 'XL',
    shoeSize: '43',
    mcuStatus: 'Fit To Work (Valid s/d Des 2025)',
    bankAccount: '123-00-9876543-2',
    bankName: 'Bank Mandiri',
    accountHolder: 'Ilham Pratama',
    active: true,
    urgent: true,
  },
  {
    id: 'DR-20210045',
    nikCompany: 'DR-20210045',
    nikKtp: '7324021990004',
    noKk: '7324021990005',
    npwp: '22.345.678.9-002.000',
    bpjsKesehatan: '000223456789',
    bpjsKetenagakerjaan: '1900223456',
    initials: 'AM',
    name: 'Andi Muhammad Reza',
    nickname: 'Reza',
    birthPlace: 'Luwu Timur',
    birthDate: '1990-04-12',
    gender: 'Laki-laki',
    religion: 'Islam',
    blood: 'A+',
    addressKtp: 'Desa Magani, Kec. Nuha, Kab. Luwu Timur',
    addressDomisili: 'Desa Magani, Sorowako',
    emailPersonal: 'reza.hauling@gmail.com',
    emailKalla: 'reza.hauling@kalla.co.id',
    position: 'Heavy Dump Truck Operator (HD785)',
    jobLevel: 'Operator / Driver',
    site: 'Project Vale Sorowako',
    contractStatus: 'Kartap (Tetap)',
    joinDate: '2021-05-10',
    skNumber: '014/DIR-KALLA/2021',
    skDate: '2021-05-10',
    contractStart: '2021-05-10',
    contractEnd: '2042-05-10',
    remaining: 'Tetap (Permanen)',
    maritalStatus: 'Menikah',
    spouseName: 'Ratnasari',
    childrenCount: 3,
    motherName: 'Maryam',
    emergencyName: 'Ratnasari (Istri)',
    emergencyPhone: '082188776655',
    educationLevel: 'SMA / SMK Sederajat',
    schoolName: 'SMKN 1 Malili',
    major: 'Teknik Kendaraan Ringan',
    graduationYear: '2008',
    uniformSize: 'L',
    shoeSize: '42',
    mcuStatus: 'Fit To Work (Valid)',
    bankAccount: '152-00-1122334-4',
    bankName: 'Bank Mandiri',
    accountHolder: 'Andi Muhammad Reza',
    phone: '082199887766',
    active: true,
    urgent: false,
  },
  {
    id: 'DR-20230198',
    nikCompany: 'DR-20230198',
    nikKtp: '7403011993008',
    noKk: '7403011993009',
    npwp: '33.345.678.9-003.000',
    bpjsKesehatan: '000323456789',
    bpjsKetenagakerjaan: '1900323456',
    initials: 'BS',
    name: 'Budi Santoso',
    nickname: 'Budi',
    birthPlace: 'Kolaka',
    birthDate: '1993-11-20',
    gender: 'Laki-laki',
    religion: 'Islam',
    blood: 'B+',
    addressKtp: 'Jl. Pahlawan No. 18, Pomalaa, Kolaka',
    addressDomisili: 'Mess Logistik Site Pomalaa',
    emailPersonal: 'budi.santoso@gmail.com',
    emailKalla: 'budi.santoso@kalla.co.id',
    position: 'Fuel & Water Truck Driver',
    jobLevel: 'Operator / Driver',
    site: 'Regional Kendari & Kolaka',
    contractStatus: 'PKWT-1',
    joinDate: '2023-10-01',
    skNumber: '112/HR-KDR/2024',
    skDate: '2024-01-02',
    contractStart: '2024-10-01',
    contractEnd: '2025-09-30',
    remaining: '7 Bulan Lagi',
    maritalStatus: 'Menikah',
    spouseName: 'Dewi Lestari',
    childrenCount: 1,
    motherName: 'Kartini',
    emergencyName: 'Dewi Lestari (Istri)',
    emergencyPhone: '085299881122',
    educationLevel: 'SMA / SMK Sederajat',
    schoolName: 'SMK Negeri 2 Kolaka',
    major: 'Teknik Mesin Otomotif',
    graduationYear: '2011',
    uniformSize: 'M',
    shoeSize: '41',
    mcuStatus: 'Fit To Work (Valid)',
    bankAccount: '112-00-5544332-1',
    bankName: 'Bank Mandiri',
    accountHolder: 'Budi Santoso',
    phone: '085233441122',
    active: true,
    urgent: false,
  }
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeItem[]>(INITIAL_EMPLOYEES);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<'Driver' | 'Karyawan'>('Karyawan');
  const [selectedTab, setSelectedTab] = useState<'all' | 'karyawan' | 'driver'>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeItem | null>(null);
  const [editingEmployeeData, setEditingEmployeeData] = useState<EmployeeItem | null>(null);

  const openAddModal = (category: 'Driver' | 'Karyawan') => {
    setEditingEmployeeData(null);
    setModalCategory(category);
    setModalOpen(true);
  };

  const openEditModal = (emp: EmployeeItem) => {
    setEditingEmployeeData(emp);
    setModalCategory(emp.jobLevel.toLowerCase().includes('driver') || emp.position.toLowerCase().includes('driver') ? 'Driver' : 'Karyawan');
    setModalOpen(true);
  };

  const handleSaveModalData = (data: EmployeeData) => {
    if (editingEmployeeData) {
      // Update existing
      setEmployees(prev => prev.map(item => {
        if (item.id === editingEmployeeData.id) {
          return {
            ...item,
            ...data,
            name: data.name,
            position: data.position,
            site: data.site,
            contractStatus: data.contractStatus,
            phone: data.phone,
          };
        }
        return item;
      }));
      alert(`Data pegawai ${data.name} berhasil diperbarui!`);
    } else {
      // Add new
      const newId = (modalCategory === 'Driver' ? 'DR-' : 'KL-') + new Date().getFullYear() + String(Math.floor(Math.random() * 9000) + 1000);
      const initials = data.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      const newEmp: EmployeeItem = {
        ...data,
        id: newId,
        nikCompany: data.nikCompany || newId,
        initials: initials || 'PE',
        active: true,
        urgent: false,
        remaining: '12 Bulan Lagi',
      };
      setEmployees([newEmp, ...employees]);
      alert(`Pegawai baru ${data.name} berhasil ditambahkan!`);
    }
  };

  const handleExportExcel = () => {
    const headers = ['ID', 'NIK KTP', 'Nama Lengkap', 'Jabatan', 'Site', 'Status Kontrak', 'No HP', 'Email', 'Hasil MCU'];
    const rows = filteredList.map(e => [
      e.id,
      e.nikKtp,
      `"${e.name}"`,
      `"${e.position}"`,
      `"${e.site}"`,
      e.contractStatus,
      `"${e.phone}"`,
      e.emailPersonal,
      `"${e.mcuStatus}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_karyawan_driver_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredList = employees.filter(emp => {
    const isDriver = emp.jobLevel.toLowerCase().includes('driver') || emp.position.toLowerCase().includes('driver');
    if (selectedTab === 'karyawan') return !isDriver;
    if (selectedTab === 'driver') return isDriver;
    return true;
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
                { id: 'karyawan', label: 'Karyawan Staff & Ops', count: employees.filter(e => !e.position.toLowerCase().includes('driver')).length },
                { id: 'driver', label: 'Driver Project Vale', count: employees.filter(e => e.position.toLowerCase().includes('driver')).length },
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
            <div className="flex items-center gap-3">
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
                          emp.position.toLowerCase().includes('driver')
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
