'use client';

import React from 'react';
import { useDemo } from '@/context/demo-context';
import { getWhatsAppUrl } from '@/lib/format';

export function DemoBanner() {
  const { resetDemoData, isDemoLoggedIn } = useDemo();
  const waUrl = getWhatsAppUrl();

  return (
    <div className="sticky top-0 z-50 w-full bg-[#1e2b4b] text-white px-3 sm:px-6 py-2 border-b border-[#2d3d63]">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="bg-[#2a3c66] text-[#e2e8f0] px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide border border-[#3b5188]">
            DEMO
          </span>
          <span className="text-[#f1f5f9] font-normal">
            Ini adalah DEMO oleh <strong className="font-semibold text-white">Nalar Solusi Digital</strong> — data fiktif.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isDemoLoggedIn && (
            <button
              onClick={() => {
                if (window.confirm('Kembalikan data demo ke setelan awal 20 order & 8 pelanggan?')) {
                  resetDemoData();
                }
              }}
              className="text-[#cbd5e1] hover:text-white text-xs underline underline-offset-2 transition-colors cursor-pointer"
            >
              Reset Data Demo
            </button>
          )}

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#ffffff] hover:bg-[#f1f5f9] text-[#1e2b4b] font-medium text-xs px-3 py-1.5 rounded transition-colors"
          >
            <span>Mau sistem seperti ini?</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
