'use client';

import { PageHeader } from '@/components/AppShell';

export default function AuditLogPage() {
  return (
    <>
      <PageHeader
        title="Audit Log Kepegawaian"
        subtitle="Catatan perubahan data, aktivitas user, dan trail keputusan SDM untuk compliance & governance."
      />
      <div className="mt-8 rounded-lg bg-white p-8 border border-gray-200 shadow-sm">
        <p className="text-sm text-gray-600">Halaman Audit Log Kepegawaian sedang dalam pengembangan.</p>
      </div>
    </>
  );
}
