import React from 'react';

export default function RemindersPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-[26px] font-bold leading-tight tracking-tight text-forest-950">
          Reminder Workflow
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Sistem pengingat tugas HC berkala (H-7, H-3, H-1, Hari H).
        </p>
      </header>
      <section className="rounded-[22px] bg-white p-6 shadow-card ring-1 ring-forest-950/[0.045]">
        <p className="text-[12px] text-slate-600">
          Tabel daftar reminder tugas aktif akan ditampilkan di sini.
        </p>
      </section>
    </div>
  );
}
