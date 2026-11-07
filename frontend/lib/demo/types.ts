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

export interface EmployeeRecord extends EmployeeData {
  id: string;
  category: 'Karyawan' | 'Driver';
  initials: string;
  active: boolean;
  urgent: boolean;
  remaining: string;
}

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
  email_history: { sent_at: string; stage: ReminderItem['stage']; recipient: string }[];
}

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
  invoice_number: string;
  invoice_recipient: string;
  invoice_status: 'Belum Dibuat' | 'Dalam Pengerjaan' | 'Sudah Dikirim';
  invoice_sent_at?: string;
  invoice_notes: string;
}

export interface CulturePost {
  id: string;
  title: string;
  category: 'Culture' | 'Implementation/Improvement' | 'Achievement/Recognition';
  date: string;
  goal: string;
  description: string;
  pic: string;
  image_url: string;
  status: 'Publikasi' | 'Draft';
  // Before-Action-After-Evidence (Improvement framework)
  improvement?: {
    before: string;
    action: string;
    after: string;
    evidence: string;
  };
}

export interface DemoState {
  version: 1;
  seededAt: string;
  employees: EmployeeRecord[];
  candidates: RecruitmentCandidate[];
  reminders: ReminderItem[];
  expenses: ExpenseItem[];
  culturePosts: CulturePost[];
}

export type DemoAction =
  | { type: 'employee/add'; employee: EmployeeRecord }
  | { type: 'employee/update'; employee: EmployeeRecord }
  | { type: 'employee/delete'; id: string }
  | { type: 'candidate/add' | 'candidate/update'; candidate: RecruitmentCandidate }
  | { type: 'candidate/delete'; id: string }
  | { type: 'reminder/add' | 'reminder/update'; reminder: ReminderItem }
  | { type: 'reminder/delete'; id: string }
  | { type: 'reminder/toggle'; id: string }
  | { type: 'expense/add' | 'expense/update'; expense: ExpenseItem }
  | { type: 'expense/delete'; id: string }
  | { type: 'expense/setStatus'; id: string; status: ExpenseItem['status'] }
  | { type: 'culture/add' | 'culture/update'; post: CulturePost }
  | { type: 'culture/delete'; id: string }
  | { type: 'demo/reset'; state: DemoState };
