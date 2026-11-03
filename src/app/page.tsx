'use client';

import React from 'react';
import Link from 'next/link';
import { useDemo } from '@/context/demo-context';
import { formatRupiah, formatDateShortIndo } from '@/lib/format';
import { PaymentBadge } from '@/components/status-badges';

export default function DashboardPage() {
  const { dashboardKpi, recentOrders, openAddOrderModal, orders } = useDemo();

  // Signature Element: Alur Produksi & Status Tagihan
  const baruOrders = orders.filter((o) => o.productionStatus === 'Baru');
  const diprosesOrders = orders.filter((o) => o.productionStatus === 'Diproses');
  const selesaiOrders = orders.filter((o) => o.productionStatus === 'Selesai');

  const selesaiUnpaidCount = selesaiOrders.filter((o) => o.paymentStatus !== 'Lunas').length;
  const selesaiUnpaidAmount = selesaiOrders
    .filter((o) => o.paymentStatus !== 'Lunas')
    .reduce((sum, o) => sum + (o.total - o.amountPaid), 0);

  return (
    <div className="space-y-6">
      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0f1f2]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#131416] tracking-tight">
            Ringkasan Operasional
          </h1>
          <p className="text-xs sm:text-sm text-[#5d5f60] mt-0.5">
            {dashboardKpi.unpaidOrdersThisMonthCount > 0 ? (
              <span>
                <strong className="text-[#c4242a] font-semibold">
                  {dashboardKpi.unpaidOrdersThisMonthCount} order
                </strong>{' '}
                bulan November 2026 belum lunas ({formatRupiah(dashboardKpi.unpaidOrdersReceivableMonth)} piutang tertunggak).
              </span>
            ) : (
              'Semua order bulan ini telah lunas.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openAddOrderModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1e2b4b] hover:bg-[#283861] text-white text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer active:scale-95"
          >
            <span>+ Tambah Order</span>
          </button>
        </div>
      </div>

      {/* 4-Column Divided KPI Strip (Framed-Sheet style: Single container split by 1px rules) */}
      <div className="bg-[#ffffff] border border-[#e8eaec] rounded-xl overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e8eaec]">
        {/* KPI 1: Total Order Bulan Ini */}
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          <span className="text-xs font-medium text-[#5d5f60]">
            Total order bulan ini
          </span>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-semibold text-[#131416] font-mono tabular-nums">
              {dashboardKpi.totalOrdersThisMonth}
            </span>
            <span className="text-xs text-[#5d5f60] ml-1.5 font-normal">order</span>
          </div>
          <p className="text-[11px] text-[#5d5f60] mt-1 font-mono">
            {dashboardKpi.totalPcsThisMonth} pcs dalam antrean produksi
          </p>
        </div>

        {/* KPI 2: Order Belum Bayar (Highlighted with negative tint bar) */}
        <div className="p-4 sm:p-5 flex flex-col justify-between bg-[#fffbfb]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#c4242a]">
              Belum lunas (perlu follow-up)
            </span>
            <span className="w-2 h-2 rounded-full bg-[#c4242a]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#c4242a] font-mono tabular-nums">
              {dashboardKpi.unpaidOrdersThisMonthCount}
            </span>
            <span className="text-xs text-[#c4242a] ml-1.5 font-medium">order</span>
          </div>
          <p className="text-[11px] text-[#c4242a] mt-1 font-mono font-medium">
            Sisa piutang: {formatRupiah(dashboardKpi.unpaidOrdersReceivableMonth)}
          </p>
        </div>

        {/* KPI 3: Pemasukan Kas Bulan Ini */}
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          <span className="text-xs font-medium text-[#5d5f60]">
            Pemasukan kas bulan ini
          </span>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#1e2b4b] font-mono tabular-nums">
              {formatRupiah(dashboardKpi.revenueThisMonth)}
            </span>
          </div>
          <p className="text-[11px] text-[#5d5f60] mt-1 font-mono">
            dari total nilai {formatRupiah(dashboardKpi.totalValueThisMonth)}
          </p>
        </div>

        {/* KPI 4: Pelanggan Aktif */}
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          <span className="text-xs font-medium text-[#5d5f60]">
            Pelanggan aktif
          </span>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-semibold text-[#131416] font-mono tabular-nums">
              {dashboardKpi.activeCustomersCount}
            </span>
            <span className="text-xs text-[#5d5f60] ml-1.5 font-normal">pelanggan</span>
          </div>
          <p className="text-[11px] text-[#5d5f60] mt-1">
            {dashboardKpi.repeatCustomersCount} pelanggan langganan berulang (repeat)
          </p>
        </div>
      </div>

      {/* Main Content Grid: Recent Orders (7 cols) + Signature Pipeline (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Orders Table (5 rows) */}
        <div className="lg:col-span-8 bg-[#ffffff] border border-[#e8eaec] rounded-xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#f0f1f2] flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[#131416]">
                Order Terbaru
              </h2>
              <p className="text-xs text-[#5d5f60]">5 pesanan konveksi terakhir masuk</p>
            </div>
            <Link
              href="/orders"
              className="text-xs text-[#1e2b4b] font-medium hover:underline flex items-center gap-1"
            >
              <span>Lihat semua order</span>
              <span>→</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#f8fafc] text-[#5d5f60] text-xs font-normal border-b border-[#f0f1f2]">
                <tr>
                  <th className="py-2.5 px-4 font-normal">Tanggal</th>
                  <th className="py-2.5 px-4 font-normal">Pelanggan</th>
                  <th className="py-2.5 px-4 font-normal">Item & Jumlah</th>
                  <th className="py-2.5 px-4 font-normal text-right">Total Nilai</th>
                  <th className="py-2.5 px-4 font-normal text-center">Status Bayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f1f2]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-[#5d5f60] whitespace-nowrap">
                      {formatDateShortIndo(ord.date)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#131416]">{ord.customerName}</div>
                      <div className="text-[11px] font-mono text-[#5d5f60]">{ord.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[#131416] font-medium">{ord.itemType}</div>
                      <div className="text-[11px] text-[#5d5f60]">{ord.qty} pcs</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-[#131416] tabular-nums whitespace-nowrap">
                      {formatRupiah(ord.total)}
                      {ord.paymentStatus === 'DP' && (
                        <div className="text-[10px] text-[#92400e]">
                          DP: {formatRupiah(ord.amountPaid)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <PaymentBadge status={ord.paymentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signature Element: Alur Produksi & Piutang Konveksi */}
        <div className="lg:col-span-4 bg-[#ffffff] border border-[#e8eaec] rounded-xl p-4 sm:p-5 space-y-4">
          <div className="border-b border-[#f0f1f2] pb-3">
            <h2 className="text-sm sm:text-base font-semibold text-[#131416]">
              Alur Produksi & Tagihan
            </h2>
            <p className="text-xs text-[#5d5f60]">Monitoring tahap pengerjaan & sisa DP</p>
          </div>

          <div className="space-y-3.5">
            {/* Status Baru */}
            <div className="p-3 bg-[#f8fafc] border border-[#e8eaec] rounded-lg">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#131416] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5d5f60]" />
                  1. Pesanan Baru
                </span>
                <span className="font-mono text-[#131416] font-medium">
                  {baruOrders.length} order
                </span>
              </div>
              <p className="text-[11px] text-[#5d5f60]">
                {baruOrders.filter((o) => o.paymentStatus === 'Belum Bayar').length} order belum ada pembayaran DP.
              </p>
            </div>

            {/* Status Diproses */}
            <div className="p-3 bg-[#f8fafc] border border-[#e8eaec] rounded-lg">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#1e2b4b] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1e2b4b]" />
                  2. Sedang Diproses (Potong/Jahit/Sablon)
                </span>
                <span className="font-mono text-[#1e2b4b] font-medium">
                  {diprosesOrders.length} order
                </span>
              </div>
              <p className="text-[11px] text-[#5d5f60]">
                {diprosesOrders.filter((o) => o.paymentStatus === 'DP').length} order dalam status DP termin.
              </p>
            </div>

            {/* Status Selesai */}
            <div className="p-3 bg-[#f8fafc] border border-[#e8eaec] rounded-lg">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#1e7b4f] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1e7b4f]" />
                  3. Selesai Produksi (Siap Ambil/Kirim)
                </span>
                <span className="font-mono text-[#1e7b4f] font-medium">
                  {selesaiOrders.length} order
                </span>
              </div>

              {selesaiUnpaidCount > 0 ? (
                <div className="mt-2 pt-2 border-t border-[#e8eaec] text-[11px]">
                  <span className="text-[#c4242a] font-medium block">
                    Perhatian: {selesaiUnpaidCount} order selesai belum lunas!
                  </span>
                  <span className="text-[#5d5f60]">
                    Total {formatRupiah(selesaiUnpaidAmount)} harus dilunasi sebelum barang diambil.
                  </span>
                  <div className="mt-1.5">
                    <Link
                      href="/reports"
                      className="text-xs text-[#1e2b4b] font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <span>Buka daftar follow-up piutang →</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-[#1e7b4f]">Semua pesanan selesai telah lunas.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
