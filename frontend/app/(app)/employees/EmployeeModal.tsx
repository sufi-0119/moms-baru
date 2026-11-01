'use client';

import React, { useState, useEffect } from 'react';

export interface EmployeeData {
  id?: string;
  name: string;
  nickname?: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  religion: string;
  blood: string;
  addressKtp: string;
  addressDomisili?: string;
  phone: string;
  emailPersonal: string;
  emailKalla?: string;
  emailOutlook?: string;
  nikKtp: string;
  noKk: string;
  npwp?: string;
  bpjsKesehatan?: string;
  bpjsKetenagakerjaan?: string;
  educationLevel: string;
  schoolName: string;
  major?: string;
  graduationYear?: string;
  nikCompany: string;
  position: string;
  jobLevel: string;
  site: string;
  contractStatus: string;
  joinDate: string;
  skNumber?: string;
  skDate?: string;
  contractStart?: string;
  contractEnd?: string;
  maritalStatus: string;
  spouseName?: string;
  childrenCount: number;
  motherName?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  uniformSize: string;
  shoeSize: string;
  mcuStatus: string;
  bankAccount?: string;
  bankName?: string;
  accountHolder?: string;
}

export function EmployeeModal({
  isOpen,
  onClose,
  category,
  initialData,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  category?: 'Driver' | 'Karyawan';
  initialData?: EmployeeData | null;
  onSave?: (data: EmployeeData) => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  const isEdit = !!initialData;
  const isDriver = category === 'Driver';
  const modalTitle = isEdit
    ? `Edit Data Personil - ${initialData.name}`
    : isDriver
    ? 'Tambah Driver Project Baru (Hauling & Fleet Vale)'
    : 'Tambah Karyawan Baru - Multi-step Registration';

  const defaultFormData: EmployeeData = {
    name: '',
    nickname: '',
    birthPlace: 'Luwu Timur',
    birthDate: '1995-05-15',
    gender: 'Laki-laki',
    religion: 'Islam',
    blood: 'O+',
    addressKtp: 'Jl. Poros Malili - Sorowako No. 12',
    addressDomisili: 'Mess Kalla Transport Sorowako',
    phone: '081234567890',
    emailPersonal: 'personil@gmail.com',
    emailKalla: 'personil@kalla.co.id',
    emailOutlook: '',
    nikKtp: '7312019950001',
    noKk: '7312019950002',
    npwp: '12.345.678.9-001.000',
    bpjsKesehatan: '000123456789',
    bpjsKetenagakerjaan: '1900123456',
    educationLevel: 'SMA / SMK Sederajat',
    schoolName: 'SMKN 1 Malili',
    major: 'Teknik Otomotif',
    graduationYear: '2013',
    nikCompany: 'KL-20220814',
    position: 'Driver Hauling Fleet',
    jobLevel: 'Operator / Driver',
    site: 'Project Vale Sorowako',
    contractStatus: 'PKWT-2',
    joinDate: '2022-08-14',
    skNumber: '088/HR-VALE/2023',
    skDate: '2023-01-15',
    contractStart: '2024-03-01',
    contractEnd: '2025-02-28',
    maritalStatus: 'Menikah',
    spouseName: 'Siti Rahma',
    childrenCount: 2,
    motherName: 'Maryam',
    emergencyName: 'Andi Baso (Saudara)',
    emergencyPhone: '081299887766',
    uniformSize: 'L',
    shoeSize: '42',
    mcuStatus: 'Fit To Work (Laik Kerja)',
    bankAccount: '123-00-9876543-2',
    bankName: 'Bank Mandiri',
    accountHolder: 'Ilham Pratama',
  };

  const [formData, setFormData] = useState<EmployeeData>(defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultFormData, ...initialData });
    } else {
      setFormData(defaultFormData);
    }
    setCurrentStep(1);
  }, [initialData, isOpen]);

  const steps = [
    { num: 1, label: 'Identitas', icon: 'fa-address-card' },
    { num: 2, label: 'Kontak', icon: 'fa-phone-volume' },
    { num: 3, label: 'Dokumen Legal', icon: 'fa-stamp' },
    { num: 4, label: 'Pendidikan', icon: 'fa-graduation-cap' },
    { num: 5, label: 'Pekerjaan', icon: 'fa-briefcase' },
    { num: 6, label: 'Kontrak & SK', icon: 'fa-file-signature' },
    { num: 7, label: 'Keluarga', icon: 'fa-people-roof' },
    { num: 8, label: 'Pelengkap & MCU', icon: 'fa-vest' },
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-5xl flex flex-col max-h-[92vh] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-slate-900 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-lg font-bold text-white shadow-inner">
              <i className={isEdit ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-user-plus'} />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight text-white">{modalTitle}</h3>
              <p className="text-xs text-slate-300">
                {isEdit ? 'Perbarui data personil pada formulir multi-step 8 bagian' : 'Registrasi Data Master SDM Kalla Transport & Logistics (8 Bagian Lengkap)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition-colors hover:bg-rose-900/60 hover:text-white"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Stepper */}
        <div className="overflow-x-auto border-b border-gray-200 bg-gray-50 px-6 py-3 shrink-0">
          <div className="flex min-w-[760px] items-center justify-between">
            {steps.map((step, idx) => (
              <React.Fragment key={step.num}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      step.num === currentStep
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/50 shadow-sm'
                        : step.num < currentStep
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.num}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      step.num === currentStep
                        ? 'font-bold text-gray-900'
                        : step.num < currentStep
                          ? 'text-emerald-700'
                          : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-6 ${
                      step.num < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto space-y-4 p-6 text-xs text-gray-700">
          {/* Step 1: Identitas */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-2 mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <i className="fa-solid fa-address-card text-emerald-600" /> 1. Identitas Pribadi Calon Pegawai / Driver
                </h4>
                <span className="text-[11px] text-gray-400">* Wajib diisi sesuai KTP & Dokumen Resmi</span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="mb-1 block font-semibold text-gray-700">Nama Lengkap (Sesuai KTP) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Muhammad Ilham Pratama"
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Gelar / Nama Panggilan</label>
                  <input
                    type="text"
                    value={formData.nickname || ''}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="Gelar / Panggilan sehari-hari"
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Tempat Lahir *</label>
                  <input
                    type="text"
                    value={formData.birthPlace}
                    onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Tanggal Lahir *</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Jenis Kelamin *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Agama *</label>
                  <select
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen Protestan">Kristen Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Golongan Darah</label>
                  <select
                    value={formData.blood}
                    onChange={(e) => setFormData({ ...formData, blood: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Kontak & Domisili */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-2 mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <i className="fa-solid fa-phone-volume text-emerald-600" /> 2. Informasi Kontak & Domisili
                </h4>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block font-semibold text-gray-700">Alamat Lengkap Sesuai KTP *</label>
                  <textarea
                    rows={2}
                    value={formData.addressKtp}
                    onChange={(e) => setFormData({ ...formData, addressKtp: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block font-semibold text-gray-700">Alamat Domisili Sekarang (Jika Berbeda)</label>
                  <textarea
                    rows={2}
                    value={formData.addressDomisili || ''}
                    onChange={(e) => setFormData({ ...formData, addressDomisili: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Nomor Telepon / WhatsApp Aktif *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Email Pribadi *</label>
                  <input
                    type="email"
                    value={formData.emailPersonal}
                    onChange={(e) => setFormData({ ...formData, emailPersonal: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Email Kalla Group</label>
                  <input
                    type="email"
                    value={formData.emailKalla || ''}
                    onChange={(e) => setFormData({ ...formData, emailKalla: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Email Outlook Corporate</label>
                  <input
                    type="email"
                    value={formData.emailOutlook || ''}
                    onChange={(e) => setFormData({ ...formData, emailOutlook: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Dokumen Legal */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-2 mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <i className="fa-solid fa-stamp text-emerald-600" /> 3. Dokumen Kependudukan & Legalitas
                </h4>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Nomor Induk Kependudukan (NIK KTP) *</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={formData.nikKtp}
                    onChange={(e) => setFormData({ ...formData, nikKtp: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Nomor Kartu Keluarga (KK) *</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={formData.noKk}
                    onChange={(e) => setFormData({ ...formData, noKk: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Nomor Pokok Wajib Pajak (NPWP)</label>
                  <input
                    type="text"
                    value={formData.npwp || ''}
                    onChange={(e) => setFormData({ ...formData, npwp: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Nomor BPJS Kesehatan</label>
                  <input
                    type="text"
                    value={formData.bpjsKesehatan || ''}
                    onChange={(e) => setFormData({ ...formData, bpjsKesehatan: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block font-semibold text-gray-700">Nomor BPJS Ketenagakerjaan (KPJ)</label>
                  <input
                    type="text"
                    value={formData.bpjsKetenagakerjaan || ''}
                    onChange={(e) => setFormData({ ...formData, bpjsKetenagakerjaan: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Pendidikan */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-2 mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <i className="fa-solid fa-graduation-cap text-emerald-600" /> 4. Latar Belakang Pendidikan
                </h4>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Tingkat Pendidikan Terakhir *</label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="SMA / SMK Sederajat">SMA / SMK Sederajat</option>
                    <option value="Diploma (D3)">Diploma (D3)</option>
                    <option value="Sarjana (S1 / D4)">Sarjana (S1 / D4)</option>
                    <option value="Magister (S2)">Magister (S2)</option>
                    <option value="SMP Sederajat">SMP Sederajat</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Nama Sekolah / Universitas *</label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Jurusan / Program Studi</label>
                  <input
                    type="text"
                    value={formData.major || ''}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Tahun Kelulusan / Tamat</label>
                  <input
                    type="text"
                    value={formData.graduationYear || ''}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Pekerjaan Saat Ini */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-2 mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <i className="fa-solid fa-briefcase text-emerald-600" /> 5. Data Pekerjaan & Penempatan Proyek
                </h4>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">NIK / NID Pegawai *</label>
                  <input
                    type="text"
                    value={formData.nikCompany}
                    onChange={(e) => setFormData({ ...formData, nikCompany: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Posisi / Jabatan *</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Level Jabatan</label>
                  <select
                    value={formData.jobLevel}
                    onChange={(e) => setFormData({ ...formData, jobLevel: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Staff Operasional">Staff Operasional</option>
                    <option value="Operator / Driver">Operator / Driver</option>
                    <option value="Supervisor / Foreman">Supervisor / Foreman</option>
                    <option value="Manager / Head of Branch">Manager / Head of Branch</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Wilayah / Project Site *</label>
                  <select
                    value={formData.site}
                    onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Project Vale Sorowako">Project Vale Sorowako</option>
                    <option value="Project PT CLM Malili">Project PT CLM Malili</option>
                    <option value="Regional Kendari & Kolaka">Regional Kendari & Kolaka</option>
                    <option value="Head Office Makassar">Head Office Makassar</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Status Hubungan Kerja *</label>
                  <select
                    value={formData.contractStatus}
                    onChange={(e) => setFormData({ ...formData, contractStatus: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="PKWT-1">PKWT-1</option>
                    <option value="PKWT-2">PKWT-2</option>
                    <option value="Kartap (Tetap)">Kartap (Tetap)</option>
                    <option value="Probation">Probation</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Tanggal Awal Masuk Kerja *</label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Kontrak & SK */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-2 mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <i className="fa-solid fa-file-signature text-emerald-600" /> 6. Riwayat Kontrak & Dokumen SK
                </h4>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Nomor SK / Perjanjian Kerja</label>
                  <input
                    type="text"
                    value={formData.skNumber || ''}
                    onChange={(e) => setFormData({ ...formData, skNumber: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Tanggal SK / Kontrak</label>
                  <input
                    type="date"
                    value={formData.skDate || ''}
                    onChange={(e) => setFormData({ ...formData, skDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Tanggal Awal Kontrak</label>
                  <input
                    type="date"
                    value={formData.contractStart || ''}
                    onChange={(e) => setFormData({ ...formData, contractStart: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Tanggal Akhir Kontrak (Habis Masa)</label>
                  <input
                    type="date"
                    value={formData.contractEnd || ''}
                    onChange={(e) => setFormData({ ...formData, contractEnd: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Keluarga */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-2 mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <i className="fa-solid fa-people-roof text-emerald-600" /> 7. Data Keluarga & Kontak Darurat
                </h4>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Status Pernikahan</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Menikah">Menikah</option>
                    <option value="Belum Menikah">Belum Menikah</option>
                    <option value="Duda / Janda">Duda / Janda</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Nama Pasangan (Suami/Istri)</label>
                  <input
                    type="text"
                    value={formData.spouseName || ''}
                    onChange={(e) => setFormData({ ...formData, spouseName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Jumlah Tanggungan Anak</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.childrenCount}
                    onChange={(e) => setFormData({ ...formData, childrenCount: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Nama Ibu Kandung</label>
                  <input
                    type="text"
                    value={formData.motherName || ''}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Nama Kontak Darurat</label>
                  <input
                    type="text"
                    value={formData.emergencyName || ''}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Nomor Telepon Darurat</label>
                  <input
                    type="text"
                    value={formData.emergencyPhone || ''}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Pelengkap & MCU */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-2 mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <i className="fa-solid fa-vest text-emerald-600" /> 8. Data Pelengkap, APD & Hasil MCU
                </h4>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Ukuran Baju Lapangan</label>
                  <select
                    value={formData.uniformSize}
                    onChange={(e) => setFormData({ ...formData, uniformSize: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Ukuran Sepatu Safety</label>
                  <input
                    type="text"
                    value={formData.shoeSize}
                    onChange={(e) => setFormData({ ...formData, shoeSize: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Hasil MCU Terakhir</label>
                  <select
                    value={formData.mcuStatus}
                    onChange={(e) => setFormData({ ...formData, mcuStatus: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Fit To Work (Laik Kerja)">Fit To Work (Laik Kerja)</option>
                    <option value="Fit With Note">Fit With Note</option>
                    <option value="Temporary Unfit">Temporary Unfit</option>
                    <option value="Unfit">Unfit</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Nomor Rekening Payroll</label>
                  <input
                    type="text"
                    value={formData.bankAccount || ''}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Nama Bank</label>
                  <input
                    type="text"
                    value={formData.bankName || ''}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-gray-700">Nama Pemilik Rekening</label>
                  <input
                    type="text"
                    value={formData.accountHolder || ''}
                    onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <i className="fa-solid fa-arrow-left text-[11px]" />
            <span>Sebelumnya</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-500">
              Langkah {currentStep} dari {totalSteps}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Batal
            </button>
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white transition-all shadow-sm hover:bg-emerald-700"
              >
                <span>Selanjutnya</span>
                <i className="fa-solid fa-arrow-right text-[11px]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-6 py-2 text-xs font-bold text-white transition-all shadow-md hover:bg-emerald-800"
              >
                <i className="fa-solid fa-cloud-arrow-up text-[11px]" />
                <span>{isEdit ? 'Simpan Perubahan Data' : 'Simpan Data Karyawan'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
