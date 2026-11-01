import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prototipe — Recruitment Dashboard (Terra)',
};

export default function PrototypeLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ background: '#0c120e', minHeight: '100vh' }}>{children}</div>;
}
