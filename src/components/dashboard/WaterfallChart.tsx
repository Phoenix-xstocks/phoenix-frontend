'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { formatUSDC } from '@/lib/format';
import type { WaterfallResult } from '@/hooks/useWaterfallResult';

interface WaterfallChartProps {
  result: WaterfallResult | undefined;
  isLoading: boolean;
}

const SEGMENTS = [
  { key: 'p1Paid', label: 'P1 Coupons', color: '#206040' },
  { key: 'p2Paid', label: 'P2 Principal', color: '#404060' },
  { key: 'p3Paid', label: 'P3 Carry', color: '#40a040' },
  { key: 'p4Paid', label: 'P4 Hedge', color: '#e0c040' },
  { key: 'p5Paid', label: 'P5 Reserve', color: '#504070' },
  { key: 'p6Paid', label: 'P6 Treasury', color: '#6b7280' },
] as const;

export function WaterfallChart({ result, isLoading }: WaterfallChartProps) {
  if (isLoading || !result) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <Skeleton className="h-4 w-40 mb-5" />
        <Skeleton className="h-8 w-full mb-4" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-20" />
          ))}
        </div>
      </div>
    );
  }

  const values = SEGMENTS.map((seg) => ({
    ...seg,
    value: result[seg.key],
  }));

  const total = values.reduce((sum, v) => sum + v.value, 0n);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs text-white/30 uppercase tracking-wide">
          Waterfall (Last Epoch)
        </span>
        <span className="font-mono tabular-nums text-sm text-white/60">
          ${formatUSDC(total)}
        </span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-8 rounded-lg overflow-hidden mb-5 bg-white/[0.02]">
        {values.map((seg) => {
          const width = total > 0n
            ? (Number(seg.value) / Number(total)) * 100
            : 0;
          if (width === 0) return null;
          return (
            <div
              key={seg.key}
              className="h-full transition-all duration-500"
              style={{
                width: `${width}%`,
                backgroundColor: seg.color,
                opacity: 0.85,
                minWidth: width > 0 ? '2px' : 0,
              }}
              title={`${seg.label}: $${formatUSDC(seg.value)}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-3">
        {values.map((seg) => {
          const isBlocked = seg.key === 'p6Paid' && !result.p1FullyPaid;
          return (
            <div key={seg.key} className={`flex items-center gap-2 ${isBlocked ? 'opacity-30' : ''}`}>
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <div className="min-w-0">
                <span className="text-xs text-white/30 block truncate">{seg.label}</span>
                <span className="text-xs font-mono tabular-nums text-white/70">
                  ${formatUSDC(seg.value)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
