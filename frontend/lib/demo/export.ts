import type { EmployeeRecord } from './types';

const HEADERS = [
  'ID',
  'NIK KTP',
  'Nama',
  'Jabatan',
  'Site',
  'Status Kontrak',
  'No HP',
  'Email',
  'Hasil MCU',
];

function escapeCsv(value: string | number | undefined): string {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function toEmployeesCsv(rows: EmployeeRecord[]): string {
  const body = rows.map((row) =>
    [
      row.id,
      row.nikKtp,
      row.name,
      row.position,
      row.site,
      row.contractStatus,
      row.phone,
      row.emailPersonal,
      row.mcuStatus,
    ]
      .map(escapeCsv)
      .join(','),
  );

  return [HEADERS.map(escapeCsv).join(','), ...body].join('\n');
}
