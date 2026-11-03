'use client';

import React, { useState, useMemo } from 'react';
import { useDemo } from '@/context/demo-context';
import { formatRupiah, formatDateShortIndo, formatWhatsappDisplay } from '@/lib/format';

export default function CustomersPage() {
  const { customerSummaries, openCustomerDrawer, selectedCustomerForDrawer } = useDemo();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customerSummaries;
    const q = searchQuery.toLowerCase();
    return customerSummaries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.organization.toLowerCase().includes(q) ||
        c.whatsapp.includes(q)
    );
  }, [customerSummaries, searchQuery]);

  // Total customer statistics
  const totalLifetimeSpend = useMemo(() => {
    return customerSummaries.reduce((sum, c) => sum + c.totalSpend, 0);
  }, [customerSummaries]);

  const totalOutstandingReceivable = useMemo(() => {
    return customerSummaries.reduce((sum, c) => sum + c.totalReceivable, 0);
  }, [customerSummaries]);

  return (
    <div className="space-y-5">
      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0f1f2]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#131416] tracking-tight">
            Data Pelanggan
          </h1>
          <p className="text-xs sm:text-sm text-[#5d5f60] mt-0.5">
            Daftar pelanggan konveksi, nomor kontak WhatsApp, dan riwayat akumulasi belanja
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 bg-[#f8fafc] border border-[#e8eaec] rounded-md">
            <span className="text-[#5d5f60]">Total Omset: </span>
            <strong className="text-[#131416]">{formatRupiah(totalLifetimeSpend)}</strong>
          </div>
          <div className="px-3 py-1.5 bg-[#fffbfb] border border-[#fecdd3] rounded-md">
            <span className="text-[#c4242a]">Total Piutang: </span>
            <strong className="text-[#c4242a]">{formatRupiah(totalOutstandingReceivable)}</strong>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Cari nama pelanggan, instansi, atau nomor WA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3 text-xs bg-white border border-[#cdced1] rounded-md text-[#131416] focus:outline-none focus:border-[#1e2b4b]"
          />
          <svg
            className="w-4 h-4 text-[#6b6b6b] absolute left-2.5 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>

        <div className="text-right text-[#5d5f60] font-mono text-xs">
          Menampilkan <strong className="text-[#131416]">{filteredCustomers.length}</strong> pelanggan terdaftar
        </div>
      </div>

      {/* Customers Table */}
      <div className="border border-[#e8eaec] rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#f8fafc] text-[#5d5f60] text-xs font-normal border-b border-[#f0f1f2]">
              <tr>
                <th className="py-3 px-4 font-normal">Nama Pelanggan & Instansi</th>
                <th className="py-3 px-4 font-normal">Kontak WhatsApp</th>
                <th className="py-3 px-4 font-normal text-right">Total Order</th>
                <th className="py-3 px-4 font-normal text-right">Total Belanja</th>
                <th className="py-3 px-4 font-normal text-right">Sisa Piutang</th>
                <th className="py-3 px-4 font-normal text-right">Order Terakhir</th>
                <th className="py-3 px-4 font-normal text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f1f2]">
              {filteredCustomers.map((cust) => {
                const isSelected = selectedCustomerForDrawer?.id === cust.id;
                const cleanWa = cust.whatsapp.replace(/\D/g, '');

                return (
                  <tr
                    key={cust.id}
                    onClick={() => openCustomerDrawer(cust.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#e8ecf2]'
                        : 'hover:bg-[#f8fafc]'
                    }`}
                  >
                    {/* Nama & Instansi */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#131416]">{cust.name}</div>
                      <div className="text-xs text-[#5d5f60]">{cust.organization}</div>
                    </td>

                    {/* Kontak WA */}
                    <td className="py-3.5 px-4 font-mono text-xs text-[#5d5f60]">
                      <div className="flex items-center gap-1.5">
                        <span>{formatWhatsappDisplay(cust.whatsapp)}</span>
                        {cleanWa && (
                          <a
                            href={`https://wa.me/${cleanWa}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#1e2b4b] hover:underline text-[11px]"
                            title="Buka Chat WhatsApp"
                          >
                            ↗
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Total Order */}
                    <td className="py-3.5 px-4 text-right font-mono text-[#131416] tabular-nums">
                      {cust.totalOrders} order
                    </td>

                    {/* Total Belanja */}
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-[#131416] tabular-nums whitespace-nowrap">
                      {formatRupiah(cust.totalSpend)}
                    </td>

                    {/* Sisa Piutang */}
                    <td className="py-3.5 px-4 text-right font-mono font-medium tabular-nums whitespace-nowrap">
                      {cust.totalReceivable > 0 ? (
                        <span className="text-[#c4242a] bg-[#ffedea] px-2 py-0.5 rounded text-xs font-semibold">
                          {formatRupiah(cust.totalReceivable)}
                        </span>
                      ) : (
                        <span className="text-[#1e7b4f] text-xs">Lunas (Rp0)</span>
                      )}
                    </td>

                    {/* Order Terakhir */}
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-[#5d5f60] whitespace-nowrap">
                      {cust.lastOrderDate !== '-' ? formatDateShortIndo(cust.lastOrderDate) : '-'}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCustomerDrawer(cust.id);
                        }}
                        className="px-2.5 py-1 text-xs text-[#1e2b4b] bg-white border border-[#cdced1] rounded hover:bg-[#e8ecf2] transition-colors"
                      >
                        Detail ↗
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
