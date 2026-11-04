'use client';

import React, { useState, useMemo } from 'react';
import { useDemo } from '@/context/demo-context';
import { PaymentStatus, ProductionStatus } from '@/types/demo';
import { formatRupiah, formatDateShortIndo } from '@/lib/format';
import { PaymentBadge, ProductionBadge } from '@/components/status-badges';

type FilterTab = 'ALL' | PaymentStatus;

export default function OrdersPage() {
  const {
    orders,
    openAddOrderModal,
    setPaymentStatus,
    setProductionStatus,
  } = useDemo();

  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [productionFilter, setProductionFilter] = useState<'ALL' | ProductionStatus>('ALL');

  // Counts for underline tabs
  const tabCounts = useMemo(() => {
    return {
      ALL: orders.length,
      'Belum Bayar': orders.filter((o) => o.paymentStatus === 'Belum Bayar').length,
      DP: orders.filter((o) => o.paymentStatus === 'DP').length,
      Lunas: orders.filter((o) => o.paymentStatus === 'Lunas').length,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Tab filter
      if (activeTab !== 'ALL' && o.paymentStatus !== activeTab) return false;

      // Production filter
      if (productionFilter !== 'ALL' && o.productionStatus !== productionFilter) return false;

      // Search query (matches customer name, order ID, or item detail)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = o.customerName.toLowerCase().includes(query);
        const matchesId = o.id.toLowerCase().includes(query);
        const matchesItem = o.itemDetail.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesItem) return false;
      }

      return true;
    });
  }, [orders, activeTab, productionFilter, searchQuery]);

  // Filtered total value
  const filteredTotalValue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + o.total, 0);
  }, [filteredOrders]);

  return (
    <div className="space-y-5">
      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0f1f2]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#131416] tracking-tight">
            Data Order
          </h1>
          <p className="text-xs sm:text-sm text-[#5d5f60] mt-0.5">
            Daftar pesanan konveksi, status pembayaran dan progres pengerjaan
          </p>
        </div>

        <button
          onClick={openAddOrderModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1e2b4b] hover:bg-[#283861] text-white text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer active:scale-95"
        >
          <span>+ Tambah Order</span>
        </button>
      </div>

      {/* Underline Tabs for Payment Status (Framed-sheet list blueprint) */}
      <div className="border-b border-[#e8eaec]">
        <div className="flex space-x-6 overflow-x-auto text-xs sm:text-sm">
          {[
            { key: 'ALL' as FilterTab, label: 'Semua Order', count: tabCounts.ALL },
            { key: 'Belum Bayar' as FilterTab, label: 'Belum Bayar', count: tabCounts['Belum Bayar'] },
            { key: 'DP' as FilterTab, label: 'DP (Cicilan)', count: tabCounts.DP },
            { key: 'Lunas' as FilterTab, label: 'Lunas', count: tabCounts.Lunas },
          ].map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 font-medium flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors relative ${
                  isSelected
                    ? 'text-[#1e2b4b] border-b-2 border-[#1e2b4b] font-semibold'
                    : 'text-[#5d5f60] hover:text-[#131416]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-[#e8ecf2] text-[#1e2b4b]' : 'bg-[#f4f6f9] text-[#6b6b6b]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar: Search & Production Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-xl">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari nama pelanggan, no. order, atau item..."
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
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-[#6b6b6b] hover:text-[#131416] px-1 font-sans cursor-pointer"
                aria-label="Bersihkan pencarian"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Production Filter Select */}
          <select
            value={productionFilter}
            onChange={(e) => setProductionFilter(e.target.value as 'ALL' | ProductionStatus)}
            className="h-9 px-3 text-xs bg-white border border-[#cdced1] rounded-md text-[#131416] focus:outline-none focus:border-[#1e2b4b]"
          >
            <option value="ALL">Semua Tahap Produksi</option>
            <option value="Baru">Baru</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        <div className="text-right text-[#5d5f60] font-mono text-xs">
          Menampilkan <strong className="text-[#131416]">{filteredOrders.length}</strong> order · Total{' '}
          <strong className="text-[#131416]">{formatRupiah(filteredTotalValue)}</strong>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border border-[#e8eaec] rounded-xl overflow-hidden bg-white">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-[#5d5f60] space-y-2">
            <p className="text-sm">Tidak ada order yang sesuai dengan kriteria filter.</p>
            <button
              onClick={() => {
                setActiveTab('ALL');
                setSearchQuery('');
                setProductionFilter('ALL');
              }}
              className="text-xs text-[#1e2b4b] hover:underline cursor-pointer"
            >
              Reset semua filter
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#f8fafc] text-[#5d5f60] text-xs font-normal border-b border-[#f0f1f2]">
                <tr>
                  <th className="py-3 px-3 sm:px-4 font-normal">Tanggal</th>
                  <th className="py-3 px-3 sm:px-4 font-normal">No. Order</th>
                  <th className="py-3 px-3 sm:px-4 font-normal">Pelanggan</th>
                  <th className="py-3 px-3 sm:px-4 font-normal">Item & Jumlah</th>
                  <th className="py-3 px-3 sm:px-4 font-normal text-right">Total Nilai</th>
                  <th className="py-3 px-3 sm:px-4 font-normal text-center">Status Bayar</th>
                  <th className="py-3 px-3 sm:px-4 font-normal text-center">Status Produksi</th>
                  <th className="py-3 px-3 sm:px-4 font-normal text-center">Ubah status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f1f2]">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#f8fafc] transition-colors">
                    {/* Tanggal */}
                    <td className="py-3.5 px-3 sm:px-4 font-mono text-xs text-[#5d5f60] whitespace-nowrap">
                      {formatDateShortIndo(ord.date)}
                    </td>

                    {/* No Order */}
                    <td className="py-3.5 px-3 sm:px-4 font-mono text-xs font-semibold text-[#1e2b4b] whitespace-nowrap">
                      {ord.id}
                    </td>

                    {/* Pelanggan */}
                    <td className="py-3.5 px-3 sm:px-4">
                      <div className="font-medium text-[#131416]">{ord.customerName}</div>
                    </td>

                    {/* Item & Qty */}
                    <td className="py-3.5 px-3 sm:px-4">
                      <div className="font-medium text-[#131416]">{ord.itemDetail}</div>
                      <div className="text-[11px] text-[#5d5f60]">
                        {ord.itemType} · {ord.qty} pcs @ {formatRupiah(ord.unitPrice)}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-medium text-[#131416] tabular-nums whitespace-nowrap">
                      <div>{formatRupiah(ord.total)}</div>
                      {ord.paymentStatus === 'DP' ? (
                        <div className="text-[10px] text-[#92400e]">
                          Sisa: {formatRupiah(ord.total - ord.amountPaid)}
                        </div>
                      ) : ord.paymentStatus === 'Belum Bayar' ? (
                        <div className="text-[10px] text-[#c4242a]">Belum DP</div>
                      ) : (
                        <div className="text-[10px] text-[#1e7b4f]">Lunas</div>
                      )}
                    </td>

                    {/* Status Bayar (Badge) */}
                    <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                      <PaymentBadge status={ord.paymentStatus} />
                    </td>

                    {/* Status Produksi (Badge) */}
                    <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                      <ProductionBadge status={ord.productionStatus} />
                    </td>

                    {/* Ubah Status Dropdowns */}
                    <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <select
                          value={ord.paymentStatus}
                          onChange={(e) => setPaymentStatus(ord.id, e.target.value as PaymentStatus)}
                          aria-label={`Ubah status bayar ${ord.id}`}
                          title="Pilih status bayar"
                          className="h-7 px-2 text-[11px] font-medium bg-[#ffffff] border border-[#cdced1] rounded text-[#131416] hover:border-[#1e2b4b] focus:outline-none focus:border-[#1e2b4b] cursor-pointer transition-colors"
                        >
                          <option value="Belum Bayar">Belum Bayar</option>
                          <option value="DP">DP</option>
                          <option value="Lunas">Lunas</option>
                        </select>

                        <select
                          value={ord.productionStatus}
                          onChange={(e) => setProductionStatus(ord.id, e.target.value as ProductionStatus)}
                          aria-label={`Ubah status produksi ${ord.id}`}
                          title="Pilih status produksi"
                          className="h-7 px-2 text-[11px] font-medium bg-[#ffffff] border border-[#cdced1] rounded text-[#131416] hover:border-[#1e2b4b] focus:outline-none focus:border-[#1e2b4b] cursor-pointer transition-colors"
                        >
                          <option value="Baru">Baru</option>
                          <option value="Diproses">Diproses</option>
                          <option value="Selesai">Selesai</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
