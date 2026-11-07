'use client';

import React, { useState } from 'react';
import { FlaskConical, RotateCcw } from 'lucide-react';
import { useDemoData } from '@/lib/demo/DemoDataProvider';
import { useToast } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export function DemoBanner() {
  const { reset } = useDemoData();
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleReset = () => {
    reset();
    setConfirmOpen(false);
    showToast('Data demo berhasil dikembalikan ke kondisi awal.', 'success');
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 shrink-0" />
          <span>
            <strong className="font-bold">Mode Demo</strong> - seluruh data di halaman ini adalah data contoh,
            bukan data produksi.
          </span>
        </div>
        <button
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-amber-900 transition hover:bg-amber-100"
          onClick={() => setConfirmOpen(true)}
          type="button"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Data Demo
        </button>
      </div>

      <ConfirmDialog
        confirmLabel="Reset Data"
        description="Seluruh perubahan demo (tambah, edit, hapus) akan dihapus dan diganti data contoh awal."
        destructive={false}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleReset}
        open={confirmOpen}
        title="Kembalikan data demo ke kondisi awal?"
      />
    </>
  );
}
