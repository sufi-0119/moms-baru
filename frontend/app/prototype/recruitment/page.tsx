'use client';

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const LOGO_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAhXwvSZBXSNiCeVPQttrkQvYilUe6O4Bs2u3Bv1ue7oCTJoiYxQXWMhGzdhdzB_soZWF0VmSO52m3pIw8HveW9Xh68IUS0AXKc2p6pIR84z4UQyShpjg8MKEgEehajhaubgu2abEDV44gfUlPsafpfMksFCbAmPhAFkWnJFMxULhBKLY8AGnKy3Yo1KwxK1dxqAH_K8lqbXWLTcO8AbTe92rIXJcoCOC3D4g64lxu6gMzLo8vUtsLF';

const USER_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBGVNB1JPzzNIo6uL1Z8sesTLGqHSRGor2wCfXl_uOcyDA5PyyoDb1JErSLo_6QkPnhZd_lqlKRXGKt-y7iiNyrFOXdJ1H3lwRZwpPzeMbLK4G29_J_1oRtPbZ5o606AOyMFrpChsk-fdnYdkbv0zVrUa3s1UnQhnZQGc2ga4NC2gf0qkjOxORjuimg5ei-Fv75K1eAxE2J-t872wW0xVVhKEs1MR8Fnp7-I8iTBkA';

const INTERVIEWS = [
  {
    name: 'Ananya Pandey',
    role: 'HR Logistics Intern',
    time: '03:30 PM',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqv_MQfNITuP2dtIh4Akaeg5ulU1NYKJ72jEZFQ-Bpa_Y7jpM0xS9yLao0FID8aoel8G8qf96XcAa7SxbGHp1T_TWIY4gskSX98at2PGnnd1Fqo9PfIsrRpT95HQAWb77bltKoYAKlwtKrhfs7IWEY4LtMaIECubX0DzmP-TiPBulrhd-lSP07kPkzBEJyPenRYniGKpEahc01SK-act3VEblUhu5oQGibL1yPKUU',
  },
  {
    name: 'Dianne Russell',
    role: 'Supply Chain Analyst',
    time: '04:00 PM',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdi57Zt7I0T5UWV07rG3bcFhFwTE99arDoecdGGpY1ebVQCpqTbHuUBj_xqZH-LeafNqf6QBwlM4ha_RrJHTwtXkWrEcEDtS8nIgE4oKBOsI_sIBTqb46jLn5gg-IETngkztQr9ntIYTY0vbRuz4xuIBNy7IicOvjTorfXZW9xcMOkd2Nth1fzXS3L6iI_vgyv2Icgd2HcNiHGcsgm8dAvE86V7mMPqN3Dv1N2RMA',
  },
  {
    name: 'Ronald Richards',
    role: 'Fleet Operations Lead',
    time: '06:30 PM',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA13bySduJroFknFIotrGAltIa6VZcv6deU728wAu3TABNL6l9OHEb1HnbUBmyDMbr_2ST_hJRSS3O2GBWg5SFUiDelwNj6o7sd6TdkGPyHGcShsd4tY_CWWASMejpzpY0Yp_fb97jL7ECoJ18LNJpZQuH63peLRLdEC95qoAuDf2BpaTHIu2LfIIHCRIyWoeSQkC47xZHa3-Yapd8BOldL4oxMuNSXW18MpRxO-fY',
  },
  {
    name: 'Floyd Miles',
    role: 'Transport Safety Officer',
    time: '08:30 PM',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXduSjkdFICO-gDkF-nr2hNFik9t89nwg1BUYlUVSMNt6pzizSE1zcBW-2SzQ7VmOcjf6pHnpQnNbfcPtFlHUOTpknuJ4UQ25eDLx1y6ECJ5UqSwdxxWQhGzN3jyKGhmOhtE9gME2yrynizkrH_186zSKzyhbu0bC1FvdEAh4rio1mLr9WA1XeaHR903g7bItf04XPwli2rZQC068qXnJ619frmnPKkVXMMwh9GHU',
  },
];

const DAYS = [
  '01', '02', '03', '04', '05', '06', '07',
  '08', '09', '10', '11', '12', '13', '14',
  '15', '16', '17', '18', '19', '20', '21',
  '22', '23', '24', '25', '26', '27', '28',
  '29', '30', '31', '01', '02', '03', '04',
];

const DAY_MARKERS: Record<number, string[]> = {
  1: ['#C59B27', '#107C41'],
  15: ['#C59B27', '#fb7185'],
  24: ['#107C41', '#C59B27'],
};

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function DonutChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [250, 4, 2],
            backgroundColor: ['#107C41', '#C59B27', '#B83230'],
            borderWidth: 0,
            hoverOffset: 2,
            borderRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '76%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                const labels = ['Present: 250', 'Remote / Field: 4', 'Absent: 2'];
                return labels[context.dataIndex];
              },
            },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);

  return <canvas ref={canvasRef} />;
}

function JobStatsChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Job Views',
            data: [2000, 1500, 2200, 3100, 2400, 4800, 2600],
            backgroundColor: '#D4AF37',
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.6,
          },
          {
            label: 'Job Applied',
            data: [1300, 2100, 2900, 1400, 4900, 3200, 2750],
            backgroundColor: '#107C41',
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111915',
            titleFont: { size: 12, family: 'Nunito Sans' },
            bodyFont: { size: 12, family: 'Nunito Sans' },
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#78827b', font: { size: 11, family: 'Nunito Sans' } },
          },
          y: {
            border: { dash: [4, 4] },
            grid: { color: '#e8e5dc' },
            ticks: {
              color: '#78827b',
              font: { size: 10, family: 'Nunito Sans' },
              stepSize: 1000,
              callback(value) {
                return value === 0 ? '0' : `${Number(value) / 1000}K`;
              },
            },
            min: 0,
            max: 5000,
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);

  return <canvas ref={canvasRef} />;
}

export default function RecruitmentPrototypePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center p-0 font-[Nunito_Sans] text-[#2e3230] antialiased selection:bg-[#107C41] selection:text-white md:p-6 lg:p-8">
      <div className="relative flex min-h-screen w-full max-w-[1536px] flex-col overflow-hidden rounded-none border border-[#e4e0d8]/80 bg-[#F7F6F2] shadow-2xl md:min-h-[920px] md:flex-row md:rounded-3xl">
        {/* Mobile Header Bar */}
        <header className="z-50 flex items-center justify-between border-b border-emerald-950/60 bg-[#111915] px-5 py-4 text-white md:hidden">
          <div className="flex items-center space-x-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Kalla Logo"
              className="h-7 w-auto rounded bg-white px-1.5 py-0.5 object-contain"
              src={LOGO_SRC}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">HR Portal</span>
          </div>
          <button
            aria-label="Toggle navigation menu"
            className="p-2 text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </header>

        {/* Left Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 transform flex-col justify-between border-r border-emerald-950/30 bg-[#111915] px-4 py-6 text-emerald-100/70 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-7">
            <div className="hidden flex-col space-y-2 px-3 pt-1 md:flex">
              <div className="flex flex-col space-y-2 rounded-xl border border-emerald-950/60 bg-stone-900/60 p-3 shadow-sm">
                <div className="space-y-1">
                  <div className="text-xs font-bold leading-snug tracking-wide text-white">
                    Monitoring Management System (MOMS)
                  </div>
                  <div className="text-xs font-medium leading-normal text-emerald-200/60">PT Bumi Jasa Utama</div>
                </div>
                <div className="pt-1.5">
                  <span className="inline-flex items-center rounded-full border border-[#C59B27]/30 bg-[#C59B27]/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#C59B27]">
                    Cabang Luwu Raya
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between px-1 text-[11px] font-medium tracking-wide text-emerald-300/80" />
            </div>

            <nav aria-label="Main Navigation" className="space-y-1.5">
              <a
                className="flex items-center space-x-3.5 rounded-full bg-[#107C41] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/40 transition-all duration-150"
                href="#"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span>Dashboard</span>
              </a>

              {[
                {
                  label: 'Inbox',
                  path: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
                },
                {
                  label: 'Jobs',
                  path: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                },
                {
                  label: 'Candidates',
                  path: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
                },
                {
                  label: 'Resources',
                  path: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
                },
                {
                  label: 'Calendar',
                  path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
                },
                {
                  label: 'Settings',
                  path: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
                },
                {
                  label: 'Support',
                  path: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
                },
              ].map((item) => (
                <a
                  key={item.label}
                  className="flex items-center space-x-3.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-emerald-950/60 hover:text-white"
                  href="#"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d={item.path} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    {item.label === 'Settings' && (
                      <path
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    )}
                  </svg>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="border-t border-emerald-950/60 px-2 pt-6">
            <a
              className="flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-200/60 transition-colors hover:text-rose-300"
              href="#"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span>Log out</span>
            </a>
          </div>
        </aside>

        {/* Mobile backdrop */}
        <div
          className={`fixed inset-0 z-30 bg-stone-900/60 ${menuOpen ? 'block md:hidden' : 'hidden'}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col space-y-6 overflow-y-auto p-4 md:p-6 lg:p-7">
          {/* Header Bar */}
          <header className="flex flex-col justify-between gap-4 pb-1 sm:flex-row sm:items-center">
            <div>
              <h1 className="font-[Literata] text-2xl font-bold tracking-tight text-stone-800">Good Morning!</h1>
              <p className="mt-0.5 text-xs font-medium text-stone-500">
                Kalla Transport &amp; Logistics Recruitment Overview
              </p>
            </div>

            <div className="mx-auto w-full max-w-sm flex-1 sm:mx-6">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                <input
                  className="w-full rounded-full border border-stone-200/70 bg-white py-2 pl-10 pr-4 text-sm text-stone-800 placeholder-stone-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#107C41]/40"
                  placeholder="Search"
                  type="text"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3.5">
              <button
                className="flex items-center space-x-1.5 whitespace-nowrap rounded-full bg-[#107C41] px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#107C41]/25 transition-all hover:bg-[#0B6834] md:text-sm"
                type="button"
              >
                <svg className="h-4 w-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Post a Job</span>
              </button>

              <button
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-stone-200/60 bg-white text-stone-600 shadow-sm transition-colors hover:text-stone-900"
                type="button"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#C59B27] ring-2 ring-white" />
              </button>

              <div className="relative cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="User profile avatar"
                  className="h-9 w-9 rounded-full border-2 border-[#107C41]/20 object-cover shadow-sm"
                  src={USER_AVATAR}
                />
              </div>
            </div>
          </header>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Center Column */}
            <div className="flex flex-col space-y-6 lg:col-span-8">
              {/* KPI Widgets */}
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-100 bg-white p-4 shadow-[0_4px_20px_-2px_rgba(27,43,34,0.05)]">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold text-stone-400">Interview</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF5EE] text-[#107C41]">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline space-x-3">
                    <span className="font-[Literata] text-2xl font-bold text-stone-800">256</span>
                    <span className="inline-flex items-center rounded-full bg-[#E8F5EC] px-2 py-0.5 text-xs font-bold text-[#107C41]">
                      <svg className="mr-0.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                      </svg>
                      20%
                    </span>
                  </div>
                </div>

                <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-100 bg-white p-4 shadow-[0_4px_20px_-2px_rgba(27,43,34,0.05)]">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold text-stone-400">Shortlisted</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF5EE] text-[#107C41]">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline space-x-3">
                    <span className="font-[Literata] text-2xl font-bold text-stone-800">20</span>
                    <span className="inline-flex items-center rounded-full bg-[#E8F5EC] px-2 py-0.5 text-xs font-bold text-[#107C41]">
                      <svg className="mr-0.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                      </svg>
                      95%
                    </span>
                  </div>
                </div>

                <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-100 bg-white p-4 shadow-[0_4px_20px_-2px_rgba(27,43,34,0.05)]">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold text-stone-400">Hired</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-[#A68019]">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline space-x-3">
                    <span className="font-[Literata] text-2xl font-bold text-stone-800">06</span>
                    <span className="inline-flex items-center rounded-full bg-[#FDECEF] px-2 py-0.5 text-xs font-bold text-[#D93844]">
                      <svg className="mr-0.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                      </svg>
                      05%
                    </span>
                  </div>
                </div>
              </section>

              {/* Applications + Resource Status */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col justify-between rounded-2xl border border-stone-100 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(27,43,34,0.05)]">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-[Literata] text-sm font-bold text-stone-800">Applications</h2>
                    <a className="text-xs font-semibold text-[#107C41] hover:text-[#0B6834] hover:underline" href="#">
                      View all
                    </a>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-xl border border-stone-200/60 bg-stone-50 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-700">Fleet &amp; Logistics Ops</span>
                        <span className="rounded-full bg-[#EAF5EE] px-2 py-0.5 text-[10px] font-semibold text-[#107C41]">
                          Active
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 divide-x divide-stone-200 text-center">
                        <div>
                          <div className="font-[Literata] text-base font-bold text-stone-800">18</div>
                          <div className="text-[11px] text-stone-400">Received</div>
                        </div>
                        <div>
                          <div className="font-[Literata] text-base font-bold text-stone-800">04</div>
                          <div className="text-[11px] text-stone-400">On hold</div>
                        </div>
                        <div>
                          <div className="font-[Literata] text-base font-bold text-stone-800">02</div>
                          <div className="text-[11px] text-stone-400">Rejected</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-stone-200/60 bg-stone-50 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-700">Transport Hub Manager</span>
                        <span className="rounded-full bg-[#EAF5EE] px-2 py-0.5 text-[10px] font-semibold text-[#107C41]">
                          Urgent
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 divide-x divide-stone-200 text-center">
                        <div>
                          <div className="font-[Literata] text-base font-bold text-stone-800">32</div>
                          <div className="text-[11px] text-stone-400">Received</div>
                        </div>
                        <div>
                          <div className="font-[Literata] text-base font-bold text-stone-800">05</div>
                          <div className="text-[11px] text-stone-400">On hold</div>
                        </div>
                        <div>
                          <div className="font-[Literata] text-base font-bold text-stone-800">08</div>
                          <div className="text-[11px] text-stone-400">Rejected</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-2xl border border-stone-100 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(27,43,34,0.05)]">
                  <h2 className="mb-2 font-[Literata] text-sm font-bold text-stone-800">Resource Status</h2>
                  <div className="flex items-center justify-between py-2">
                    <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
                      <DonutChart />
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="font-[Literata] text-xl font-bold leading-none text-stone-800">256</span>
                        <span className="mt-1 text-[10px] font-medium text-stone-400">Total Emp</span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3.5 pl-3">
                      <div className="flex items-center space-x-2.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#107C41]" />
                        <div>
                          <div className="text-xs font-bold text-stone-800">250</div>
                          <div className="text-[11px] text-stone-400">Present</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#C59B27]" />
                        <div>
                          <div className="text-xs font-bold text-stone-800">04</div>
                          <div className="text-[11px] text-stone-400">Remote / Field</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#B83230]" />
                        <div>
                          <div className="text-xs font-bold text-stone-800">02</div>
                          <div className="text-[11px] text-stone-400">Absent</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Stats */}
              <div className="flex flex-1 flex-col justify-between rounded-2xl border border-stone-100 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(27,43,34,0.05)]">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-[Literata] text-sm font-bold text-stone-800">Job Stats</h2>
                  <div className="flex items-center space-x-4 text-xs font-medium">
                    <div className="flex items-center space-x-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#D4AF37]" />
                      <span className="text-stone-500">Job Views</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#107C41]" />
                      <span className="text-stone-500">Job Applied</span>
                    </div>
                  </div>
                </div>
                <div className="relative h-56 w-full">
                  <JobStatsChart />
                </div>
              </div>
            </div>

            {/* Right Utility Panel */}
            <div className="flex flex-col space-y-6 lg:col-span-4">
              <div className="flex flex-col rounded-2xl border border-stone-100 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(27,43,34,0.05)]">
                <div className="mb-2 flex items-center justify-between border-b border-stone-100 pb-3">
                  <h2 className="font-[Literata] text-sm font-bold text-stone-800">Interviews</h2>
                  <button
                    aria-label="Edit interviews list"
                    className="p-1 text-stone-400 transition-colors hover:text-[#107C41]"
                    type="button"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {INTERVIEWS.map((person) => (
                    <div key={person.name} className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={`${person.name} portrait`}
                          className="h-9 w-9 rounded-full object-cover ring-2 ring-[#EAF5EE]"
                          src={person.src}
                        />
                        <div>
                          <h3 className="text-xs font-bold text-stone-800">{person.name}</h3>
                          <p className="text-[11px] text-stone-400">{person.role}</p>
                        </div>
                      </div>
                      <span className="whitespace-nowrap text-xs font-semibold text-stone-400">{person.time}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="mt-4 flex w-full items-center justify-center space-x-1.5 rounded-full border border-[#107C41]/20 bg-[#EAF5EE] py-2.5 text-xs font-bold text-[#107C41] transition-colors hover:bg-emerald-100"
                  type="button"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                  <span>+ Add Interview</span>
                </button>
              </div>

              <div className="flex flex-1 flex-col justify-between rounded-2xl border border-stone-100 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(27,43,34,0.05)]">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-[Literata] text-sm font-bold text-stone-800">Calendar</h2>
                  <div className="flex cursor-pointer items-center space-x-1 text-xs font-semibold text-stone-700 transition-colors hover:text-[#107C41]">
                    <span>March 2023</span>
                    <svg className="h-4 w-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                <div className="mb-2 grid grid-cols-7 text-center text-[11px] font-semibold text-stone-400">
                  {WEEK_LABELS.map((day) => (
                    <div key={day}>{day}</div>
                  ))}
                </div>

                <div className="grid select-none grid-cols-7 gap-y-2.5 text-center text-xs font-medium text-stone-700">
                  {DAYS.map((day, index) => {
                    const markers = DAY_MARKERS[index];
                    const muted = index >= 31;

                    if (!markers) {
                      return (
                        <div key={index} className={muted ? 'py-1 text-stone-300' : 'py-1'}>
                          {day}
                        </div>
                      );
                    }

                    return (
                      <div key={index} className="relative py-1 font-bold text-stone-900">
                        {day}
                        <div className="mt-0.5 flex justify-center space-x-0.5">
                          {markers.map((color, markerIndex) => (
                            <span
                              key={markerIndex}
                              className="h-1 w-1 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
