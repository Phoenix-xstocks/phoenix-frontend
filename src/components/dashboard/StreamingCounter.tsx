'use client';

import { useStreamingEarnings } from '@/hooks/useStreamingEarnings';
import { Skeleton } from '@/components/ui/Skeleton';

interface StreamingCounterProps {
  earnedUsdc: number;
  depositedUsdc: number;
  apyDecimal: number;
  lastSyncTimestamp: number;
  hasPosition: boolean;
  isLoading: boolean;
}

function formatStreamingValue(value: number): { integer: string; decimal: string } {
  const formatted = value.toFixed(6);
  const [integer, decimal] = formatted.split('.');
  const intWithCommas = Number(integer).toLocaleString('en-US');
  return { integer: intWithCommas, decimal };
}

function formatUsd(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function StreamingCounter({
  earnedUsdc,
  depositedUsdc,
  apyDecimal,
  lastSyncTimestamp,
  hasPosition,
  isLoading,
}: StreamingCounterProps) {
  const streamedEarnings = useStreamingEarnings({
    baseEarned: earnedUsdc,
    apyDecimal,
    principal: depositedUsdc,
    lastSyncTimestamp,
    enabled: hasPosition,
  });

  const { integer, decimal } = formatStreamingValue(hasPosition ? streamedEarnings : 0);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-12">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-14 w-72 mb-3" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-12">
      <p className="text-sm text-white/40 mb-3 tracking-wide uppercase">
        My Earnings
      </p>

      {hasPosition ? (
        <>
          <div className="flex items-baseline gap-1">
            <span className="text-white/40 text-3xl md:text-5xl font-mono">$</span>
            <span className="text-4xl md:text-6xl font-mono tabular-nums text-white tracking-tight">
              {integer}
            </span>
            <span className="text-2xl md:text-4xl font-mono tabular-nums text-white/50">
              .{decimal}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm text-white/30">
              Deposited{' '}
              <span className="text-white/60 font-mono tabular-nums">
                ${formatUsd(depositedUsdc)}
              </span>
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-sm text-[#40a040]/80 font-mono tabular-nums">
              {(apyDecimal * 100).toFixed(1)}% APY
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-baseline gap-1">
            <span className="text-white/20 text-4xl md:text-6xl font-mono tabular-nums">
              $0.000000
            </span>
          </div>
          <p className="text-sm text-white/30 mt-4">
            Connect your wallet and deposit to start earning
          </p>
        </>
      )}
    </div>
  );
}
