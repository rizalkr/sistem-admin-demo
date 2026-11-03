'use client';

import React, { useState } from 'react';
import { useDemo } from '@/context/demo-context';
import { GarmentItemType } from '@/types/demo';
import { formatRupiah } from '@/lib/format';

export function AddOrderModal() {
  const { customers, isAddOrderModalOpen, closeAddOrderModal, addOrder } = useDemo();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerOrg, setNewCustomerOrg] = useState('');
  const [newCustomerWa, setNewCustomerWa] = useState('');

  const [itemType, setItemType] = useState<GarmentItemType>('Kaos Sablon');
  const [itemDetail, setItemDetail] = useState('');
  const [qty, setQty] = useState<number>(50);
  const [unitPrice, setUnitPrice] = useState<number>(65000);
  const [dpAmount, setDpAmount] = useState<number>(0);

  if (!isAddOrderModalOpen) return null;

  const totalCalculated = Math.max(0, qty * unitPrice);
  const remainingCalculated = Math.max(0, totalCalculated - dpAmount);
  const calculatedStatus =
    dpAmount >= totalCalculated && totalCalculated > 0
      ? 'Lunas'
      : dpAmount > 0
      ? 'DP'
      : 'Belum Bayar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let targetCustomerId: string | undefined = undefined;
    let targetCustomerName = '';

    if (selectedCustomerId && selectedCustomerId !== '__NEW__') {
      const existing = customers.find((c) => c.id === selectedCustomerId);
      if (existing) {
        targetCustomerId = existing.id;
        targetCustomerName = existing.name;
      }
    } else {
      if (!newCustomerName.trim()) {
        alert('Harap isi nama pelanggan baru.');
        return;
      }
      targetCustomerName = newCustomerName.trim();
    }

    if (qty <= 0 || unitPrice <= 0) {
      alert('Jumlah (pcs) dan harga satuan harus lebih dari 0.');
      return;
    }

    addOrder({
      customerId: targetCustomerId,
      customerName: targetCustomerName,
      customerOrganization: newCustomerOrg.trim(),
      customerWhatsapp: newCustomerWa.trim() || '081234567890',
      itemType,
      itemDetail: itemDetail.trim() || `${itemType} Custom Konveksi`,
      qty,
      unitPrice,
      dpAmount,
    });

    // Reset form
    setSelectedCustomerId('');
    setNewCustomerName('');
    setNewCustomerOrg('');
    setNewCustomerWa('');
    setItemType('Kaos Sablon');
    setItemDetail('');
    setQty(50);
    setUnitPrice(65000);
    setDpAmount(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#ffffff] border border-[#e8eaec] rounded-xl p-6 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-add-order-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#f0f1f2] mb-4">
          <div>
            <h2 id="modal-add-order-title" className="text-base font-semibold text-[#131416]">
              Tambah Order Baru
            </h2>
            <p className="text-xs text-[#5d5f60]">
              Pencatatan pesanan konveksi & status pembayaran
            </p>
          </div>
          <button
            type="button"
            onClick={closeAddOrderModal}
            className="text-[#6b6b6b] hover:text-[#131416] p-1 text-xs rounded hover:bg-[#f4f6f9] cursor-pointer"
            aria-label="Tutup modal"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Customer Selection */}
          <div>
            <label className="block text-xs font-medium text-[#131416] mb-1">
              Pelanggan
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full h-9 px-3 text-xs bg-white border border-[#cdced1] rounded-md text-[#131416] focus:outline-none focus:border-[#1e2b4b]"
            >
              <option value="">-- Pilih Pelanggan Terdaftar --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.organization})
                </option>
              ))}
              <option value="__NEW__">+ Input Pelanggan Baru...</option>
            </select>
          </div>

          {/* New Customer Fields */}
          {(!selectedCustomerId || selectedCustomerId === '__NEW__') && (
            <div className="p-3 bg-[#f8fafc] border border-[#e8eaec] rounded-lg space-y-2.5">
              <span className="block text-[11px] font-semibold text-[#1e2b4b]">
                Data pelanggan baru
              </span>
              <div>
                <label className="block text-[11px] font-medium text-[#5d5f60] mb-0.5">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required={!selectedCustomerId || selectedCustomerId === '__NEW__'}
                  placeholder="Contoh: Budi Prasetyo"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#cdced1] rounded text-[#131416] focus:outline-none focus:border-[#1e2b4b]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#5d5f60] mb-0.5">
                    Instansi / Komunitas
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PT Surya Kencana"
                    value={newCustomerOrg}
                    onChange={(e) => setNewCustomerOrg(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-[#cdced1] rounded text-[#131416] focus:outline-none focus:border-[#1e2b4b]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#5d5f60] mb-0.5">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="0812xxxx"
                    value={newCustomerWa}
                    onChange={(e) => setNewCustomerWa(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-[#cdced1] rounded text-[#131416] focus:outline-none focus:border-[#1e2b4b]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Item details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#131416] mb-1">
                Kategori Item
              </label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value as GarmentItemType)}
                className="w-full h-9 px-2 text-xs bg-white border border-[#cdced1] rounded-md text-[#131416] focus:outline-none focus:border-[#1e2b4b]"
              >
                <option value="Kaos Sablon">Kaos Sablon</option>
                <option value="Kemeja">Kemeja</option>
                <option value="Jaket">Jaket</option>
                <option value="Seragam">Seragam</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#131416] mb-1">
                Detail Spesifikasi Item
              </label>
              <input
                type="text"
                placeholder="Contoh: Combed 30s Sablon Plastisol A3"
                value={itemDetail}
                onChange={(e) => setItemDetail(e.target.value)}
                className="w-full h-9 px-3 text-xs bg-white border border-[#cdced1] rounded-md text-[#131416] focus:outline-none focus:border-[#1e2b4b]"
              />
            </div>
          </div>

          {/* Price, Qty, DP */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#131416] mb-1">
                Jumlah (pcs)
              </label>
              <input
                type="number"
                min="1"
                required
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full h-9 px-3 text-xs bg-white border border-[#cdced1] rounded-md text-[#131416] font-mono tabular-nums focus:outline-none focus:border-[#1e2b4b]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#131416] mb-1">
                Harga Satuan (Rp)
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full h-9 px-3 text-xs bg-white border border-[#cdced1] rounded-md text-[#131416] font-mono tabular-nums focus:outline-none focus:border-[#1e2b4b]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#131416] mb-1">
                Uang Muka / DP (Rp)
              </label>
              <input
                type="number"
                min="0"
                step="50000"
                value={dpAmount}
                onChange={(e) => setDpAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full h-9 px-3 text-xs bg-white border border-[#cdced1] rounded-md text-[#131416] font-mono tabular-nums focus:outline-none focus:border-[#1e2b4b]"
              />
            </div>
          </div>

          {/* Live Calculated Summary Box */}
          <div className="p-3 bg-[#f4f6f9] border border-[#e8eaec] rounded-lg">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#5d5f60]">Total Nilai Pesanan:</span>
              <span className="font-semibold text-[#131416] font-mono tabular-nums">
                {formatRupiah(totalCalculated)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#5d5f60]">Uang Masuk (DP/Bayar):</span>
              <span className="font-semibold text-[#1e7b4f] font-mono tabular-nums">
                {formatRupiah(Math.min(dpAmount, totalCalculated))}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#5d5f60]">Sisa Tagihan (Piutang):</span>
              <span
                className={`font-semibold font-mono tabular-nums ${
                  remainingCalculated > 0 ? 'text-[#c4242a]' : 'text-[#5d5f60]'
                }`}
              >
                {formatRupiah(remainingCalculated)}
              </span>
            </div>
            <div className="pt-2 border-t border-[#e8eaec] flex items-center justify-between text-xs">
              <span className="text-[#5d5f60]">Status Bayar Terdeteksi:</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  calculatedStatus === 'Lunas'
                    ? 'bg-[#dcfae5] text-[#04250e]'
                    : calculatedStatus === 'DP'
                    ? 'bg-[#fffbeb] text-[#92400e]'
                    : 'bg-[#ffedea] text-[#831c1e]'
                }`}
              >
                {calculatedStatus}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#f0f1f2]">
            <button
              type="button"
              onClick={closeAddOrderModal}
              className="px-4 py-2 text-xs font-medium text-[#5d5f60] bg-white border border-[#cdced1] rounded-md hover:bg-[#f4f6f9] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-[#1e2b4b] hover:bg-[#283861] rounded-md transition-colors cursor-pointer"
            >
              Simpan Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
