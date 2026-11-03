'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemo } from '@/context/demo-context';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { dashboardKpi, logoutDemo } = useDemo();

  // If on login page, render children directly without app shell
  if (pathname === '/login') {
    return <main className="min-h-screen bg-[#f4f6f9]">{children}</main>;
  }

  const navItems = [
    {
      href: '/',
      label: 'Ringkasan',
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      href: '/orders',
      label: 'Data Order',
      badge: dashboardKpi.unpaidOrdersThisMonthCount > 0 ? `${dashboardKpi.unpaidOrdersThisMonthCount}` : undefined,
      badgeTitle: `${dashboardKpi.unpaidOrdersThisMonthCount} order belum lunas bulan ini`,
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      href: '/customers',
      label: 'Data Pelanggan',
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      href: '/reports',
      label: 'Laporan',
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col">
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto pb-16 md:pb-2">
        {/* Desktop Sidebar (228px) */}
        <aside className="hidden md:flex flex-col w-[228px] shrink-0 p-3 pt-4 justify-between bg-[#f4f6f9]">
          <div>
            {/* Workspace & Brand Identity */}
            <div className="px-3 py-2 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#1e2b4b] text-white flex items-center justify-center font-bold text-sm tracking-wider">
                  BJ
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#131416] leading-tight">
                    Berkah Jaya
                  </h2>
                  <p className="text-[11px] text-[#5d5f60] font-normal leading-normal">
                    Konveksi · Sistem Admin
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation items */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-[#e8ecf2] text-[#131416] font-medium'
                        : 'text-[#5d5f60] hover:text-[#131416] hover:bg-[#eef1f5]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-[#1e2b4b]' : 'text-[#5d5f60]'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        title={item.badgeTitle}
                        className="bg-[#ffedea] text-[#831c1e] text-[11px] font-semibold px-1.5 py-0.2 rounded-full border border-[#fecdd3]"
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User & Demo Status */}
          <div className="px-3 py-3 border-t border-[#e8eaec] text-xs text-[#5d5f60] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#131416]">Mode Demo</span>
              <span className="w-2 h-2 rounded-full bg-[#1e7b4f]" title="Demo Aktif" />
            </div>
            <p className="text-[11px] text-[#6b6b6b]">Operator Konveksi</p>
            <Link
              href="/login"
              onClick={logoutDemo}
              className="inline-block text-[11px] text-[#1e2b4b] hover:underline pt-1"
            >
              Keluar ke Halaman Demo →
            </Link>
          </div>
        </aside>

        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#f4f6f9] border-b border-[#e8eaec] fixed top-10 left-0 right-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#1e2b4b] text-white flex items-center justify-center font-bold text-xs">
              BJ
            </div>
            <div>
              <span className="text-xs font-semibold text-[#131416]">Berkah Jaya Konveksi</span>
            </div>
          </div>
          <span className="text-[11px] bg-[#e8ecf2] text-[#1e2b4b] font-medium px-2 py-0.5 rounded">
            Sistem Admin
          </span>
        </header>

        {/* Main Work Sheet (Framed Sheet: White Sheet Inset 8px from Right & Bottom, 1px Border, 16px Radius, Zero Shadow) */}
        <main className="flex-1 w-full pt-14 md:pt-2 md:pr-2 md:pb-2">
          <div className="w-full h-full bg-[#ffffff] border border-[#e8eaec] md:rounded-2xl p-4 sm:p-6 min-h-[calc(100vh-80px)]">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff] border-t border-[#e8eaec] flex items-center justify-around h-14 px-2 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-xs transition-colors relative min-h-[44px] ${
                isActive ? 'text-[#1e2b4b] font-semibold' : 'text-[#5d5f60]'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#c4242a] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
