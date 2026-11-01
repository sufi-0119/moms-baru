'use client';

import { PageHeader } from '@/components/AppShell';

export default function PengaturanPage() {
  return (
    <>
      <PageHeader
        title="Pengaturan & Hak Akses"
        subtitle="Konfigurasi sistem, role & permission, user management, dan integrasi API."
      />
      <div className="mt-8 rounded-lg bg-white p-8 border border-gray-200 shadow-sm">
        <p className="text-sm text-gray-600">Halaman Pengaturan & Hak Akses sedang dalam pengembangan.</p>
      </div>
    </>
  );
}
