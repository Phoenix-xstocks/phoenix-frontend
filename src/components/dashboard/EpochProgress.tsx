'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

interface EpochProgressProps {
  currentEpoch: number;
  epochStartTimestamp: number;
  epochEndTimestamp: number;
  isEpochReady: boolean;
  isLoading: boolean;
}

function formatTimeLeft(seconds: number): string {
  if (seconds <= 0) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  const s = Math.floor(seconds % 60);
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function EpochProgress({
  currentEpoch,
  epochStartTimestamp,
  epochEndTimestamp,
  isEpochReady,
  isLoading,
}: EpochProgressProps) {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <Skeleton className="h-4 w-24 mb-4" />
        <Skeleton className="h-2 w-full mb-2" />
        <Skeleton className="h-3 w-32" />
      </div>
    );
  }

  const duration = epochEndTimestamp - epochStartTimestamp;
  const elapsed = now - epochStartTimestamp;
  const progress = duration > 0 ? Math.min(1, Math.max(0, elapsed / duration)) : 0;
  const remaining = Math.max(0, epochEndTimestamp - now);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/40 uppercase tracking-wide">Epoch</span>
          <span className="text-lg font-mono tabular-nums text-white">
            #{currentEpoch}
          </span>
        </div>
        {isEpochReady ? (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#40a040]/10 text-[#40a040] border border-[#40a040]/20">
            Ready
          </span>
        ) : (
          <span className="text-sm font-mono tabular-nums text-white/50">
            {formatTimeLeft(remaining)}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{
            width: `${progress * 100}%`,
            background: isEpochReady
              ? '#40a040'
              : 'linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.4))',
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-white/20 font-mono">
          {Math.round(progress * 100)}%
        </span>
        <span className="text-xs text-white/20">
          {PROTOCOL_CONSTANTS_EPOCH_HOURS}h epoch
        </span>
      </div>
    </div>
  );
}

const PROTOCOL_CONSTANTS_EPOCH_HOURS = 48;
