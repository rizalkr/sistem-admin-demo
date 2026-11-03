'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/context/demo-context';

export default function LoginPage() {
  const router = useRouter();
  const { loginAsDemo } = useDemo();

  const handleEnterDemo = () => {
    loginAsDemo();
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-12">
      <div className="w-full max-w-md bg-[#ffffff] border border-[#e8eaec] rounded-xl p-6 sm:p-8 space-y-6">
        {/* Brand Monogram & Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-lg bg-[#1e2b4b] text-white flex items-center justify-center font-bold text-xl tracking-wider">
            BJ
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#131416] tracking-tight">
            Berkah Jaya Konveksi
          </h1>
          <p className="text-xs sm:text-sm text-[#5d5f60]">
            Sistem Administrasi Order, Produksi & Pembayaran
          </p>
        </div>

        {/* Demo Overview Details */}
        <div className="p-4 bg-[#f8fafc] border border-[#e8eaec] rounded-lg space-y-2.5 text-xs text-[#5d5f60]">
          <span className="block font-semibold text-[#131416] text-[11px]">
            Cakupan fitur demo:
          </span>
          <ul className="space-y-1.5 list-disc list-inside text-[#5d5f60]">
            <li>20 data pesanan konveksi fiktif (Kemeja, Kaos, Jaket, Seragam)</li>
            <li>Pencatatan uang muka (DP) dan pelunasan pembayaran</li>
            <li>Pengelolaan alur status produksi konveksi (Baru, Diproses, Selesai)</li>
            <li>Database 8 pelanggan tetap dan riwayat belanja</li>
            <li>Laporan rekap pemasukan kas dan piutang tertunggak</li>
          </ul>
        </div>

        {/* Primary Action Button */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleEnterDemo}
            className="w-full h-11 bg-[#1e2b4b] hover:bg-[#283861] text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <span>Masuk sebagai Demo</span>
            <span aria-hidden="true">→</span>
          </button>

          <p className="text-center text-xs text-[#5d5f60]">
            Tidak perlu akun — ini mode demo langsung pakai.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-[#5d5f60]">
        Demo solusi oleh{' '}
        <span className="font-semibold text-[#131416]">Nalar Solusi Digital</span>
      </div>
    </div>
  );
}
