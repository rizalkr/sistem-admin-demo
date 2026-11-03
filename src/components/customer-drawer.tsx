'use client';

import React from 'react';
import { useDemo } from '@/context/demo-context';
import { formatRupiah, formatDateShortIndo, formatWhatsappDisplay } from '@/lib/format';
import { PaymentBadge, ProductionBadge } from './status-badges';

export function CustomerDrawer() {
  const { selectedCustomerForDrawer, closeCustomerDrawer } = useDemo();

  if (!selectedCustomerForDrawer) return null;

  const customer = selectedCustomerForDrawer;
  const cleanWa = customer.whatsapp.replace(/\D/g, '');
  const waLink = cleanWa ? `https://wa.me/${cleanWa}` : undefined;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 animate-fadeIn">
      <div className="absolute inset-0" onClick={closeCustomerDrawer} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#ffffff] border-l border-[#e8eaec] flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-[#f0f1f2] flex items-start justify-between bg-[#f8fafc]">
            <div>
              <span className="text-[10px] font-mono text-[#5d5f60] bg-[#e8ecf2] px-1.5 py-0.5 rounded">
                {customer.id}
              </span>
              <h2 className="text-base font-semibold text-[#131416] mt-1.5 leading-snug">
                {customer.name}
              </h2>
              <p className="text-xs text-[#5d5f60]">{customer.organization}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-mono text-[#131416]">
                  {formatWhatsappDisplay(customer.whatsapp)}
                </span>
                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#1e2b4b] hover:underline flex items-center gap-0.5"
                  >
                    <span>Hubungi WA</span>
                    <span>→</span>
                  </a>
                )}
              </div>
            </div>

            <button
              onClick={closeCustomerDrawer}
              className="text-[#6b6b6b] hover:text-[#131416] px-2 py-1 rounded hover:bg-[#eef1f5] text-xs cursor-pointer"
              aria-label="Tutup drawer pelanggan"
            >
              Tutup
            </button>
          </div>

          {/* Customer Summary Cards */}
          <div className="p-5 border-b border-[#f0f1f2] grid grid-cols-3 gap-2 text-center bg-[#ffffff]">
            <div className="p-2.5 bg-[#f4f6f9] rounded-lg border border-[#e8eaec]">
              <span className="block text-[10px] text-[#5d5f60]">
                Total order
              </span>
              <span className="text-sm font-semibold text-[#131416] font-mono tabular-nums">
                {customer.totalOrders}
              </span>
            </div>
            <div className="p-2.5 bg-[#f4f6f9] rounded-lg border border-[#e8eaec]">
              <span className="block text-[10px] text-[#5d5f60]">
                Total belanja
              </span>
              <span className="text-xs font-semibold text-[#131416] font-mono tabular-nums">
                {formatRupiah(customer.totalSpend)}
              </span>
            </div>
            <div className="p-2.5 bg-[#f4f6f9] rounded-lg border border-[#e8eaec]">
              <span className="block text-[10px] text-[#5d5f60]">
                Sisa piutang
              </span>
              <span
                className={`text-xs font-semibold font-mono tabular-nums ${
                  customer.totalReceivable > 0 ? 'text-[#c4242a]' : 'text-[#1e7b4f]'
                }`}
              >
                {formatRupiah(customer.totalReceivable)}
              </span>
            </div>
          </div>

          {/* Orders History List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <h3 className="text-xs font-semibold text-[#131416]">
              Riwayat pesanan ({customer.orders.length})
            </h3>

            {customer.orders.length === 0 ? (
              <p className="text-xs text-[#5d5f60] italic py-4">Belum ada riwayat pesanan.</p>
            ) : (
              <div className="space-y-2.5">
                {customer.orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 bg-[#ffffff] border border-[#e8eaec] rounded-lg space-y-2 hover:border-[#cdced1] transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] font-medium text-[#1e2b4b]">
                        {ord.id}
                      </span>
                      <span className="text-[11px] text-[#5d5f60]">
                        {formatDateShortIndo(ord.date)}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-[#131416]">{ord.itemDetail}</p>
                      <p className="text-[11px] text-[#5d5f60]">
                        {ord.qty} pcs @ {formatRupiah(ord.unitPrice)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#f0f1f2] text-xs">
                      <div>
                        <span className="text-[10px] text-[#5d5f60] block">Total:</span>
                        <span className="font-semibold text-[#131416] font-mono tabular-nums">
                          {formatRupiah(ord.total)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <PaymentBadge status={ord.paymentStatus} />
                        <ProductionBadge status={ord.productionStatus} />
                      </div>
                    </div>

                    {ord.paymentStatus === 'DP' && (
                      <p className="text-[10px] text-[#92400e] bg-[#fffbeb] px-2 py-0.5 rounded border border-[#fde68a]">
                        Terbayar: {formatRupiah(ord.amountPaid)} · Sisa Piutang: {formatRupiah(ord.total - ord.amountPaid)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#f0f1f2] bg-[#f8fafc] flex justify-end">
            <button
              onClick={closeCustomerDrawer}
              className="px-4 py-2 text-xs font-medium text-[#5d5f60] bg-white border border-[#cdced1] rounded hover:bg-[#f4f6f9] cursor-pointer"
            >
              Tutup Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
