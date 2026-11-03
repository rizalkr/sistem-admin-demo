'use client';

import React from 'react';
import { useDemo } from '@/context/demo-context';
import { formatRupiah, formatDateShortIndo, formatDaysAgo } from '@/lib/format';
import { PaymentBadge, ProductionBadge } from '@/components/status-badges';
import { MonthlyBarChart } from '@/components/monthly-bar-chart';

export default function ReportsPage() {
  const { reportsData, setPaymentStatus } = useDemo();

  return (
    <div className="space-y-6">
      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0f1f2]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#131416] tracking-tight">
            Laporan Keuangan & Piutang
          </h1>
          <p className="text-xs sm:text-sm text-[#5d5f60] mt-0.5">
            Rekap pemasukan kas diterima vs. tagihan piutang belum lunas dan antrean penagihan
          </p>
        </div>
      </div>

      {/* 3-Column Summary Cards Strip (Strict Reconciliation) */}
      <div className="bg-[#ffffff] border border-[#e8eaec] rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e8eaec]">
        {/* Card 1: Total Nilai Order */}
        <div className="p-4 sm:p-5">
          <span className="text-xs font-medium text-[#5d5f60]">
            Total nilai order (2 bulan)
          </span>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-semibold text-[#131416] font-mono tabular-nums">
              {formatRupiah(reportsData.totalAllOrderValue)}
            </span>
          </div>
          <p className="text-[11px] text-[#5d5f60] mt-1 font-mono">
            Akumulasi 20 order konveksi tercatat
          </p>
        </div>

        {/* Card 2: Pemasukan Kas Diterima */}
        <div className="p-4 sm:p-5 bg-[#fbfdfb]">
          <span className="text-xs font-semibold text-[#1e7b4f]">
            Pemasukan kas diterima
          </span>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#1e7b4f] font-mono tabular-nums">
              {formatRupiah(reportsData.totalAllRevenuePaid)}
            </span>
          </div>
          <p className="text-[11px] text-[#1e7b4f] mt-1 font-mono">
            {reportsData.totalAllOrderValue > 0
              ? `${Math.round((reportsData.totalAllRevenuePaid / reportsData.totalAllOrderValue) * 100)}% dari total omset pesanan`
              : '0%'}
          </p>
        </div>

        {/* Card 3: Total Piutang Belum Lunas */}
        <div className="p-4 sm:p-5 bg-[#fffbfb]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#c4242a]">
              Total piutang belum lunas
            </span>
            <span className="w-2 h-2 rounded-full bg-[#c4242a]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#c4242a] font-mono tabular-nums">
              {formatRupiah(reportsData.totalAllReceivable)}
            </span>
          </div>
          <p className="text-[11px] text-[#c4242a] mt-1 font-mono">
            {reportsData.followUpOrders.length} order menunggu pelunasan
          </p>
        </div>
      </div>

      {/* Monthly Chart and Breakdown */}
      <div className="bg-[#ffffff] border border-[#e8eaec] rounded-xl p-4 sm:p-6 space-y-4">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-[#131416]">
            Grafik Rekapitulasi Bulanan
          </h2>
          <p className="text-xs text-[#5d5f60]">
            Bulan Oktober 2026 vs. November 2026
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <MonthlyBarChart data={reportsData.monthlyRows} />
          </div>

          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-semibold text-[#131416] mb-2">
              Rincian angka per bulan:
            </div>
            {reportsData.monthlyRows.map((row) => (
              <div
                key={row.monthKey}
                className="p-3 bg-[#f8fafc] border border-[#e8eaec] rounded-lg text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-semibold text-[#131416]">
                  <span>{row.monthLabel}</span>
                  <span className="font-mono">{row.orderCount} order</span>
                </div>
                <div className="flex items-center justify-between text-[#5d5f60]">
                  <span>Total Nilai Pesanan:</span>
                  <span className="font-mono text-[#131416]">{formatRupiah(row.totalOrderValue)}</span>
                </div>
                <div className="flex items-center justify-between text-[#1e7b4f]">
                  <span>Kas Diterima:</span>
                  <span className="font-mono font-semibold">{formatRupiah(row.totalRevenuePaid)}</span>
                </div>
                <div className="flex items-center justify-between text-[#c4242a]">
                  <span>Sisa Piutang:</span>
                  <span className="font-mono font-semibold">{formatRupiah(row.totalReceivable)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Follow-up Queue Table (Oldest First) */}
      <div className="bg-[#ffffff] border border-[#e8eaec] rounded-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#f0f1f2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-[#131416]">
              Daftar Tagihan Perlu Difollow-up
            </h2>
            <p className="text-xs text-[#5d5f60]">
              Diurutkan dari order tertua yang belum lunas (prioritas penagihan)
            </p>
          </div>
          <span className="text-xs font-mono bg-[#ffedea] text-[#831c1e] px-2.5 py-1 rounded-full font-semibold border border-[#fecdd3]">
            {reportsData.followUpOrders.length} order perlu ditagih
          </span>
        </div>

        {reportsData.followUpOrders.length === 0 ? (
          <div className="p-10 text-center text-[#1e7b4f] text-sm">
            Semua tagihan pesanan telah lunas. Tidak ada piutang tertunggak!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#f8fafc] text-[#5d5f60] text-xs font-normal border-b border-[#f0f1f2]">
                <tr>
                  <th className="py-3 px-4 font-normal">Umur & Tanggal</th>
                  <th className="py-3 px-4 font-normal">No. Order</th>
                  <th className="py-3 px-4 font-normal">Pelanggan</th>
                  <th className="py-3 px-4 font-normal text-center">Status Produksi</th>
                  <th className="py-3 px-4 font-normal text-right">Total Order</th>
                  <th className="py-3 px-4 font-normal text-right">Sudah Masuk (DP)</th>
                  <th className="py-3 px-4 font-normal text-right">Sisa Piutang</th>
                  <th className="py-3 px-4 font-normal text-center">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f1f2]">
                {reportsData.followUpOrders.map((ord) => {
                  const unpaidAmount = ord.total - ord.amountPaid;
                  return (
                    <tr key={ord.id} className="hover:bg-[#fffbfb] transition-colors">
                      {/* Umur Order */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-[#c4242a] text-xs">
                          {formatDaysAgo(ord.date)}
                        </span>
                        <div className="text-[11px] text-[#5d5f60] font-mono">
                          {formatDateShortIndo(ord.date)}
                        </div>
                      </td>

                      {/* No Order */}
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[#1e2b4b] whitespace-nowrap">
                        {ord.id}
                      </td>

                      {/* Pelanggan */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#131416]">{ord.customerName}</div>
                        <div className="text-[11px] text-[#5d5f60]">{ord.itemDetail}</div>
                      </td>

                      {/* Status Produksi */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <ProductionBadge status={ord.productionStatus} />
                      </td>

                      {/* Total Nilai */}
                      <td className="py-3.5 px-4 text-right font-mono text-[#131416] tabular-nums whitespace-nowrap">
                        {formatRupiah(ord.total)}
                      </td>

                      {/* DP Masuk */}
                      <td className="py-3.5 px-4 text-right font-mono text-[#1e7b4f] tabular-nums whitespace-nowrap">
                        {ord.amountPaid > 0 ? formatRupiah(ord.amountPaid) : 'Rp0'}
                        <div className="text-[10px] text-[#5d5f60]">
                          <PaymentBadge status={ord.paymentStatus} />
                        </div>
                      </td>

                      {/* Sisa Piutang */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#c4242a] tabular-nums whitespace-nowrap">
                        {formatRupiah(unpaidAmount)}
                      </td>

                      {/* Aksi Cepat: Lunasi */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setPaymentStatus(ord.id, 'Lunas')}
                          title="Tandai pembayaran telah lunas penuh"
                          className="px-3 py-1 text-xs font-medium bg-[#1e2b4b] hover:bg-[#283861] text-white rounded cursor-pointer transition-colors active:scale-95"
                        >
                          Tandai Lunas
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
