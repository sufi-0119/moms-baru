'use client';

import React from 'react';
import { Inbox } from 'lucide-react';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-gray-100 text-gray-400">
        <Inbox className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-sm font-bold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-gray-500">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
