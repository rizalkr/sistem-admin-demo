import React from 'react';
import { PaymentStatus, ProductionStatus } from '@/types/demo';

interface PaymentBadgeProps {
  status: PaymentStatus;
  onClick?: () => void;
  interactive?: boolean;
}

export function PaymentBadge({ status, onClick, interactive = false }: PaymentBadgeProps) {
  let colorClasses = '';

  switch (status) {
    case 'Lunas':
      colorClasses = 'bg-[#dcfae5] text-[#04250e] border border-[#bbf7d0]';
      break;
    case 'DP':
      colorClasses = 'bg-[#fffbeb] text-[#92400e] border border-[#fde68a]';
      break;
    case 'Belum Bayar':
      colorClasses = 'bg-[#ffedea] text-[#831c1e] border border-[#fecdd3]';
      break;
  }

  const Tag = interactive ? 'button' : 'span';

  return (
    <Tag
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      title={interactive ? `Klik untuk ganti status bayar (saat ini: ${status})` : undefined}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full shrink-0 whitespace-nowrap transition-colors ${colorClasses} ${
        interactive ? 'cursor-pointer hover:opacity-80 active:scale-95' : ''
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'Lunas'
            ? 'bg-[#1e7b4f]'
            : status === 'DP'
            ? 'bg-[#a86f0c]'
            : 'bg-[#c4242a]'
        }`}
      />
      <span>{status}</span>
      {interactive && <span className="text-[10px] opacity-60">↻</span>}
    </Tag>
  );
}

interface ProductionBadgeProps {
  status: ProductionStatus;
  onClick?: () => void;
  interactive?: boolean;
}

export function ProductionBadge({ status, onClick, interactive = false }: ProductionBadgeProps) {
  let colorClasses = '';

  switch (status) {
    case 'Selesai':
      colorClasses = 'bg-[#dcfae5] text-[#04250e] border border-[#bbf7d0]';
      break;
    case 'Diproses':
      colorClasses = 'bg-[#e8ecf2] text-[#1e2b4b] border border-[#c5d0e6]';
      break;
    case 'Baru':
      colorClasses = 'bg-[#ebedee] text-[#353736] border border-[#d8dbdf]';
      break;
  }

  const Tag = interactive ? 'button' : 'span';

  return (
    <Tag
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      title={interactive ? `Klik untuk ganti status produksi (saat ini: ${status})` : undefined}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full shrink-0 whitespace-nowrap transition-colors ${colorClasses} ${
        interactive ? 'cursor-pointer hover:opacity-80 active:scale-95' : ''
      }`}
    >
      <span>{status}</span>
      {interactive && <span className="text-[10px] opacity-60">↻</span>}
    </Tag>
  );
}
