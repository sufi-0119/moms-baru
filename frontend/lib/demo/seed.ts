import type {
  CulturePost,
  DemoState,
  EmployeeRecord,
  ExpenseItem,
  RecruitmentCandidate,
  ReminderItem,
} from './types';

const DAY_MS = 86_400_000;

function shiftDays(base: Date, days: number): Date {
  return new Date(base.getTime() + days * DAY_MS);
}

function isoDay(base: Date, days: number): string {
  return shiftDays(base, days).toISOString().slice(0, 10);
}

function isoTime(base: Date, days: number, hour: number): string {
  const date = shiftDays(base, days);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
}

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

const KARYAWAN_NAMES: readonly string[] = [
  'Aditya Pratama',
  'Bunga Lestari',
  'Cahyo Nugroho',
  'Dewi Anggraini',
  'Eko Saputra',
  'Fitri Handayani',
  'Gilang Ramadhan',
  'Hana Permata',
  'Irfan Maulana',
  'Jihan Aulia',
  'Kurniawan Santoso',
  'Lestari Wulandari',
  'Muhammad Rizky',
  'Nurul Hidayah',
  'Oscar Simanjuntak',
  'Putri Maharani',
  'Qori Amalia',
  'Rendi Kurnia',
  'Sari Puspita',
  'Taufik Hidayat',
  'Ulfa Rahmawati',
  'Vino Ardiansyah',
  'Wulan Sari',
  'Yusuf Maulana',
];

const DRIVER_NAMES: readonly string[] = [
  'Agus Setiawan',
  'Bambang Susilo',
  'Candra Firmansyah',
  'Dedi Kurniawan',
  'Edi Santoso',
  'Fajar Nugroho',
  'Gunawan Putra',
  'Hendra Wijaya',
  'Iwan Setiawan',
  'Joko Prasetyo',
  'Kardi Susanto',
  'Lukman Hakim',
];

const KARYAWAN_POSITIONS: readonly string[] = [
  'Staff Administrasi',
  'Fleet Maintenance Supervisor',
  'HSE Officer',
  'Payroll Staff',
  'Recruitment Officer',
  'Finance Staff',
  'Warehouse Staff',
  'HR Generalist',
];

const DRIVER_POSITIONS: readonly string[] = [
  'Driver Hauling Fleet',
  'Driver Dump Truck',
  'Driver Trailer',
  'Driver Light Vehicle',
];

const SITES: readonly string[] = [
  'Project Vale Sorowako',
  'Project PT CLM Malili',
  'Regional Kendari & Kolaka',
  'Head Office Makassar',
];

const EDUCATION_LEVELS: readonly string[] = [
  'SMA / SMK Sederajat',
  'Diploma (D3)',
  'Sarjana (S1 / D4)',
  'Magister (S2)',
];

const SCHOOLS: readonly string[] = [
  'SMK Negeri 1 Luwu Timur',
  'Universitas Cendana Nusantara',
  'Politeknik Nusantara Timur',
  'Sekolah Tinggi Manajemen Andalas',
];

const MAJORS: readonly string[] = ['Teknik Otomotif', 'Manajemen', 'Akuntansi', 'Teknik Industri'];

const MCU_STATUSES: readonly string[] = [
  'Fit To Work (Laik Kerja)',
  'Fit With Note',
  'Fit To Work (Laik Kerja)',
  'Temporary Unfit',
];

function buildEmployee(
  now: Date,
  index: number,
  name: string,
  category: EmployeeRecord['category'],
): EmployeeRecord {
  const positions = category === 'Driver' ? DRIVER_POSITIONS : KARYAWAN_POSITIONS;
  const joinOffset = -(((index * 37) % 700) + 60);
  const contractEndOffset =
    index % 7 === 0 ? -3 - (index % 5) : index % 5 === 0 ? 15 + index : 200 + index * 6;
  const remaining =
    contractEndOffset < 0
      ? 'Kontrak Habis'
      : contractEndOffset === 0
        ? 'Berakhir Hari Ini'
        : `${contractEndOffset} Hari Lagi`;
  const contractStatus =
    category === 'Driver'
      ? index % 2 === 0
        ? 'PKWT-2'
        : 'PKWT-1'
      : ['Kartap (Tetap)', 'PKWT-2', 'PKWT-1', 'Probation'][index % 4];
  const nikKtp = `0000${String(100_000_000_000 + index)}`;
  const noKk = `0000${String(200_000_000_000 + index)}`;

  return {
    id: `EMP-${String(index + 1).padStart(3, '0')}`,
    category,
    initials: initialsOf(name),
    active: contractEndOffset >= 0,
    urgent: contractEndOffset >= 0 && contractEndOffset <= 60,
    remaining,
    name,
    nickname: name.split(' ')[0],
    birthPlace: 'Luwu Timur',
    birthDate: `${1985 + (index % 15)}-${String((index % 12) + 1).padStart(2, '0')}-${String(
      (index % 27) + 1,
    ).padStart(2, '0')}`,
    gender: index % 2 === 0 ? 'Laki-laki' : 'Perempuan',
    religion: 'Islam',
    blood: ['O+', 'A+', 'B+', 'AB+'][index % 4],
    addressKtp: `Jl. Poros Malili - Sorowako No. ${10 + index}, Luwu Timur`,
    addressDomisili: 'Mess Karyawan Blok A, Sorowako',
    phone: `0800${String(10_000_000 + index)}`,
    emailPersonal: `personil${index + 1}@example.test`,
    emailKalla: `personil${index + 1}.kalla@example.test`,
    nikKtp,
    noKk,
    bpjsKesehatan: `000${String(123_456_780 + index)}`,
    bpjsKetenagakerjaan: `1900${String(123_456 + index)}`,
    educationLevel: EDUCATION_LEVELS[index % EDUCATION_LEVELS.length],
    schoolName: SCHOOLS[index % SCHOOLS.length],
    major: MAJORS[index % MAJORS.length],
    graduationYear: String(2005 + (index % 15)),
    nikCompany: `KL-${String(2000 + index)}`,
    position: positions[index % positions.length],
    jobLevel:
      category === 'Driver'
        ? 'Operator / Driver'
        : ['Staff Operasional', 'Supervisor / Foreman', 'Manager / Head of Branch'][index % 3],
    site: SITES[index % SITES.length],
    contractStatus,
    joinDate: isoDay(now, joinOffset),
    skNumber: `SK/HR-DEMO/${100 + index}`,
    skDate: isoDay(now, joinOffset + 30),
    contractStart: isoDay(now, contractEndOffset - 365),
    contractEnd: isoDay(now, contractEndOffset),
    maritalStatus: ['Menikah', 'Belum Menikah', 'Menikah', 'Duda / Janda'][index % 4],
    spouseName: index % 3 === 0 ? `Pasangan ${name.split(' ')[0]}` : undefined,
    childrenCount: index % 3,
    motherName: `Ibu ${name.split(' ')[0]}`,
    emergencyName: `Keluarga ${name.split(' ')[0]}`,
    emergencyPhone: `0800${String(20_000_000 + index)}`,
    uniformSize: ['M', 'L', 'XL'][index % 3],
    shoeSize: String(39 + (index % 7)),
    mcuStatus: MCU_STATUSES[index % MCU_STATUSES.length],
    bankAccount: `123-00-${String(7_000_000 + index)}`,
    bankName: ['Bank Mandiri', 'BRI', 'BNI'][index % 3],
    accountHolder: name,
  };
}

const STAGE_DEFS = [
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
] as const satisfies readonly {
  key: keyof RecruitmentCandidate['stages_data'];
  name: string;
  group: RecruitmentCandidate['stage_group'];
}[];

function buildStages(
  now: Date,
  createdOffset: number,
  completed: number,
): RecruitmentCandidate['stages_data'] {
  const stages: RecruitmentCandidate['stages_data'] = {
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
    simper: { completed: false },
  };

  STAGE_DEFS.forEach((stage, index) => {
    if (index < completed) {
      stages[stage.key] = { completed: true, date: isoDay(now, createdOffset + index * 3) };
    }
  });

  return stages;
}

const CANDIDATE_NAMES: readonly string[] = [
  'Rahmat Hidayat',
  'Sinta Dewi',
  'Bayu Prasetyo',
  'Nadia Safitri',
  'Fikri Ramadhan',
  'Ayu Lestari',
  'Rizal Fauzi',
  'Melati Putri',
  'Arif Setiawan',
  'Yuni Kartika',
];

const RECOMMENDERS: readonly string[] = [
  'Foreman Hauling Demo',
  'Supervisor Fleet Demo',
  'HSE Officer Demo',
  'Admin Cabang Demo',
  'Driver Senior Demo',
];

function buildCandidate(now: Date, index: number, name: string): RecruitmentCandidate {
  const completed = 13 - index;
  const createdOffset = -(120 + ((index * 53) % 600));
  const nextStage = STAGE_DEFS[Math.min(completed, STAGE_DEFS.length - 1)];
  const isDone = completed === STAGE_DEFS.length;

  return {
    id: `REC-${String(index + 1).padStart(3, '0')}`,
    name,
    phone: `0800${String(30_000_000 + index)}`,
    recommender: RECOMMENDERS[index % RECOMMENDERS.length],
    recommendation: index % 2 === 0 ? 'Operasional Hauling Vale' : 'Fleet Support Cabang',
    current_stage: isDone ? '13. SDT Praktik & SIMPER (Selesai)' : nextStage.name,
    stage_group: isDone ? 'Eksternal' : nextStage.group,
    eligibility_status: isDone ? 'Layak Kerja' : 'Belum Layak Kerja',
    progress_pct: Math.round((completed / STAGE_DEFS.length) * 100),
    notes:
      isDone
        ? 'Seluruh tahap seleksi selesai dan kandidat dinyatakan layak kerja.'
        : `Sedang berada pada tahap ${nextStage.name}.`,
    created_at: isoDay(now, createdOffset),
    stages_data: buildStages(now, createdOffset, completed),
  };
}

const REMINDER_TASKS: readonly string[] = [
  'Perpanjangan SIM BII Umum Driver Hauling',
  'Pembayaran Iuran BPJS Ketenagakerjaan Tim Driver',
  'Verifikasi Higienitas Katering Mess Site',
  'Audit APD & Seragam Lapangan Driver',
  'Kalibrasi Timbangan & Uji Emisi Dump Truck',
  'Perpanjangan Kontrak PKWT Driver Trailer',
  'Pembaruan Sertifikat MCU Tahunan Karyawan',
  'Inspeksi Fasilitas Mess & Air Bersih',
  'Pelatihan Safety Driving Refresher',
  'Pengajuan Pembayaran Vendor Katering',
  'Verifikasi Data Kepesertaan BPJS Kesehatan',
  'Pemeriksaan Berkala Alat Berat Workshop',
];

const REMINDER_CATEGORIES: readonly ReminderItem['category'][] = [
  'Driver',
  'BPJS',
  'Catering',
  'Employee',
  'Facility',
];

const REMINDER_PICS: readonly string[] = [
  'Irfan Hakim',
  'Siti Rahmawati',
  'Nur Fadillah',
  'Andi Baso',
  'Rina Marlina',
];

const REMINDER_DEADLINE_OFFSETS: readonly number[] = [0, 3, 7, 14, 21, 35, 48, 75, 100, 130, 160, 190];

const REMINDER_STAGES: readonly ReminderItem['stage'][] = ['H-7', 'H-3', 'H-1', 'Hari H'];

const REMINDER_CYCLES: readonly ReminderItem['repeat_cycle'][] = [
  'Monthly',
  'Quarterly',
  'Yearly',
  'Tidak berulang',
];

function stageLeadDays(stage: ReminderItem['stage']): number {
  if (stage === 'H-7') return 7;
  if (stage === 'H-3') return 3;
  if (stage === 'H-1') return 1;
  return 0;
}

function buildReminder(now: Date, index: number): ReminderItem {
  const deadlineOffset = REMINDER_DEADLINE_OFFSETS[index];
  const stage = REMINDER_STAGES[index % REMINDER_STAGES.length];
  const recipient = `pic${index + 1}@example.test`;
  const isDone = index >= REMINDER_TASKS.length - 3;
  const sentOffset = deadlineOffset - stageLeadDays(stage);

  return {
    id: `REM-${String(index + 1).padStart(3, '0')}`,
    task_name: REMINDER_TASKS[index],
    category: REMINDER_CATEGORIES[index % REMINDER_CATEGORIES.length],
    deadline: isoDay(now, deadlineOffset),
    stage,
    repeat_cycle: REMINDER_CYCLES[index % REMINDER_CYCLES.length],
    pic: REMINDER_PICS[index % REMINDER_PICS.length],
    recipient_email: recipient,
    notes: 'Pengingat demo yang dijadwalkan otomatis oleh sistem cabang.',
    work_status: isDone ? 'Selesai' : 'Belum Selesai',
    reminder_status: isDone ? 'Selesai' : 'Aktif',
    last_sent: isDone ? 'Dihentikan (Pekerjaan Selesai)' : `${stage} terkirim (08:00 WITA)`,
    email_history: isDone
      ? []
      : [{ sent_at: isoTime(now, sentOffset, 8), stage, recipient }],
  };
}

const EXPENSE_DESCRIPTIONS: readonly string[] = [
  'Pengurusan SIM BII & Pengujian SIMPER Driver',
  'Pelunasan MCU Laboratorium Semester I',
  'Pengadaan APD & Rompi Reflektor Standar Tambang',
  'Konsumsi Rapat Koordinasi Operasional',
  'Penggantian Sparepart Filter Udara Dump Truck',
  'Perawatan Berkala Armada Trailer',
  'Sewa Kendaraan Operasional Cabang',
  'Biaya Pelatihan Safety Driving',
  'Pembayaran Vendor Katering Mess',
  'Pengadaan Alat Tulis & Perlengkapan Kantor',
  'Biaya Perjalanan Dinas Supervisi',
  'Perbaikan Fasilitas Mess Karyawan',
];

const EXPENSE_VENDORS: readonly string[] = [
  'Satlantas Demo',
  'RS Inco Demo',
  'Vendor Safety Demo',
  'Katering Nusantara Demo',
  'Dealer Komatsu Demo',
  'Workshop Nusantara Demo',
  'Rental Armada Demo',
  'Lembaga Training Demo',
];

const EXPENSE_DATE_OFFSETS: readonly number[] = [
  -15, -45, -75, -105, -140, -190, -240, -300, -400, -520, -640, -700,
];

const EXPENSE_STATUSES: readonly ExpenseItem['status'][] = [
  'Sudah Dibayar',
  'Dalam Proses',
  'Pengajuan',
];

const INVOICE_STATUSES: readonly ExpenseItem['invoice_status'][] = [
  'Sudah Dikirim',
  'Dalam Pengerjaan',
  'Belum Dibuat',
];

const SUBMITTERS: readonly string[] = [
  'Irfan Hakim',
  'Siti Rahmawati',
  'Nur Fadillah',
  'Andi Baso',
  'Rina Marlina',
];

function buildExpense(now: Date, index: number): ExpenseItem {
  const expenseOffset = EXPENSE_DATE_OFFSETS[index];
  const invoiceStatus = INVOICE_STATUSES[index % INVOICE_STATUSES.length];

  return {
    id: `EXP-${String(index + 1).padStart(3, '0')}`,
    expense_date: isoDay(now, expenseOffset),
    description: EXPENSE_DESCRIPTIONS[index],
    category: index % 4 === 3 ? 'Lainnya' : 'Operasional',
    amount: 1_250_000 + index * 1_750_000,
    status: EXPENSE_STATUSES[index % EXPENSE_STATUSES.length],
    notes: 'Catatan biaya demo untuk keperluan presentasi cabang.',
    document_url: `dokumen-demo-${index + 1}.pdf`,
    submitted_by: SUBMITTERS[index % SUBMITTERS.length],
    invoice_number: `INV-DEMO-${String(index + 1).padStart(3, '0')}`,
    invoice_recipient: EXPENSE_VENDORS[index % EXPENSE_VENDORS.length],
    invoice_status: invoiceStatus,
    invoice_sent_at:
      invoiceStatus === 'Sudah Dikirim' ? isoDay(now, expenseOffset + 3) : undefined,
    invoice_notes:
      invoiceStatus === 'Belum Dibuat'
        ? 'Invoice belum diajukan ke vendor.'
        : 'Invoice demo terverifikasi oleh tim finance cabang.',
  };
}

const CULTURE_TITLES: readonly string[] = [
  'Penerapan Daily Safety Morning Talk di Mess Sorowako',
  'Optimasi Waktu Siklus Hauling Pit-to-Port',
  'Penghargaan Driver Terbaik Kuartal Pertama',
  'Gerakan Hemat Solar Armada Hauling',
  'Program Mentoring Driver Baru',
  'Digitalisasi Absensi Driver Berbasis Aplikasi',
  'Perbaikan Alur Serah Terima Dokumen Kontrak',
  'Kampanye Kebersihan Mess Karyawan',
  'Recognition Tim Operasional Terbaik Semester',
];

const CULTURE_CATEGORIES: readonly CulturePost['category'][] = [
  'Culture',
  'Implementation/Improvement',
  'Achievement/Recognition',
];

const CULTURE_DATES_OFFSETS: readonly number[] = [-20, -60, -110, -160, -230, -300, -420, -540, -680];

const CULTURE_IMAGE_URLS: readonly string[] = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
];

function buildCulturePost(index: number, now: Date): CulturePost {
  const category = CULTURE_CATEGORIES[index % CULTURE_CATEGORIES.length];

  return {
    id: `CUL-${String(index + 1).padStart(3, '0')}`,
    title: CULTURE_TITLES[index],
    category,
    date: isoDay(now, CULTURE_DATES_OFFSETS[index]),
    goal: 'Meningkatkan budaya kerja, keselamatan, dan kinerja operasional cabang.',
    description:
      'Dokumentasi kegiatan demo yang menggambarkan praktik terbaik tim operasional Kalla Transport & Logistics.',
    pic: REMINDER_PICS[index % REMINDER_PICS.length],
    image_url: CULTURE_IMAGE_URLS[index % CULTURE_IMAGE_URLS.length],
    status: index === CULTURE_TITLES.length - 1 ? 'Draft' : 'Publikasi',
    improvement:
      category === 'Implementation/Improvement'
        ? {
            before: 'Proses operasional berjalan manual dan memakan waktu.',
            action: 'Tim menyusun ulang alur kerja dan menetapkan penanggung jawab.',
            after: 'Waktu proses berkurang dan kesalahan administrasi menurun.',
            evidence: 'Laporan evaluasi internal demo menunjukkan perbaikan terukur.',
          }
        : undefined,
  };
}

export function createDemoSeed(now: Date): DemoState {
  const karyawan = KARYAWAN_NAMES.map((name, index) =>
    buildEmployee(now, index, name, 'Karyawan'),
  );
  const drivers = DRIVER_NAMES.map((name, offset) =>
    buildEmployee(now, KARYAWAN_NAMES.length + offset, name, 'Driver'),
  );

  return {
    version: 1,
    seededAt: now.toISOString(),
    employees: [...karyawan, ...drivers],
    candidates: CANDIDATE_NAMES.map((name, index) => buildCandidate(now, index, name)),
    reminders: REMINDER_TASKS.map((_task, index) => buildReminder(now, index)),
    expenses: EXPENSE_DESCRIPTIONS.map((_description, index) => buildExpense(now, index)),
    culturePosts: CULTURE_TITLES.map((_title, index) => buildCulturePost(index, now)),
  };
}
