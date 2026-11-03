'use client';

import React from 'react';
import { MonthlyReportRow } from '@/types/demo';
import { formatRupiah } from '@/lib/format';

interface MonthlyBarChartProps {
  data: MonthlyReportRow[];
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  // SVG Dimensions & ViewBox
  const width = 540;
  const height = 240;
  const paddingLeft = 70;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find max value for scaling (round up to nearest 10M)
  const maxDataVal = Math.max(
    ...data.flatMap((d) => [d.totalRevenuePaid, d.totalReceivable]),
    10000000
  );
  const yMax = Math.ceil(maxDataVal / 10000000) * 10000000 + 5000000;

  // Grid steps (4 horizontal gridlines)
  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];

  // Group width
  const groupWidth = chartWidth / (data.length || 1);
  const barWidth = 36;
  const barGap = 8;

  return (
    <div className="w-full">
      {/* Legend Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#f0f1f2] mb-3 text-xs">
        <span className="font-semibold text-[#131416]">
          Perbandingan Kas Masuk vs Piutang
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-none bg-[#1e2b4b]" />
            <span className="text-[#5d5f60]">Pemasukan Diterima</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-none bg-[#a86f0c]" />
            <span className="text-[#5d5f60]">Piutang Belum Lunas</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-w-[540px] select-none text-[11px] font-sans"
          aria-label="Grafik Batang Perbandingan Bulanan"
        >
          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yTicks.map((val, idx) => {
            const y = paddingTop + chartHeight - (val / yMax) * chartHeight;
            const labelStr =
              val === 0
                ? 'Rp0'
                : `Rp${(val / 1000000).toFixed(0)}jt`;

            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke={val === 0 ? '#131416' : '#e5e5e5'}
                  strokeWidth={val === 0 ? '1.5' : '1'}
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#5d5f60"
                  className="font-mono text-[10px]"
                >
                  {labelStr}
                </text>
              </g>
            );
          })}

          {/* Bar Groups */}
          {data.map((row, groupIdx) => {
            const groupCenterX = paddingLeft + groupIdx * groupWidth + groupWidth / 2;
            const bar1X = groupCenterX - barWidth - barGap / 2;
            const bar2X = groupCenterX + barGap / 2;

            const bar1Height = (row.totalRevenuePaid / yMax) * chartHeight;
            const bar1Y = paddingTop + chartHeight - bar1Height;

            const bar2Height = (row.totalReceivable / yMax) * chartHeight;
            const bar2Y = paddingTop + chartHeight - bar2Height;

            return (
              <g key={row.monthKey}>
                {/* Series 1: Pemasukan (Navy) */}
                <rect
                  x={bar1X}
                  y={bar1Y}
                  width={barWidth}
                  height={bar1Height}
                  fill="#1e2b4b"
                >
                  <title>
                    {`${row.monthLabel} - Pemasukan Diterima: ${formatRupiah(row.totalRevenuePaid)}`}
                  </title>
                </rect>

                {/* Series 2: Piutang (Amber) */}
                <rect
                  x={bar2X}
                  y={bar2Y}
                  width={barWidth}
                  height={bar2Height}
                  fill="#a86f0c"
                >
                  <title>
                    {`${row.monthLabel} - Piutang Belum Lunas: ${formatRupiah(row.totalReceivable)}`}
                  </title>
                </rect>

                {/* Value labels on top of bars */}
                <text
                  x={bar1X + barWidth / 2}
                  y={bar1Y - 6}
                  textAnchor="middle"
                  fill="#1e2b4b"
                  className="font-mono text-[9px] font-medium"
                >
                  {`Rp${(row.totalRevenuePaid / 1000000).toFixed(1)}jt`}
                </text>
                <text
                  x={bar2X + barWidth / 2}
                  y={bar2Y - 6}
                  textAnchor="middle"
                  fill="#a86f0c"
                  className="font-mono text-[9px] font-medium"
                >
                  {`Rp${(row.totalReceivable / 1000000).toFixed(1)}jt`}
                </text>

                {/* X-Axis Month Label */}
                <text
                  x={groupCenterX}
                  y={height - 12}
                  textAnchor="middle"
                  fill="#131416"
                  className="font-medium text-[11px]"
                >
                  {row.monthLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
