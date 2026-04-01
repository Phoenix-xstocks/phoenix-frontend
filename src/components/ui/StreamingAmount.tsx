'use client';

import { useEffect, useState } from 'react';
import type { StreamInfo } from '@/hooks/useUserNotes';

const USDC_DECIMALS = 6;

function computeStreamed(streams: StreamInfo[], nowSec: number): number {
  let total = 0;
  for (const s of streams) {
    if (nowSec <= s.startTime) continue;
    const elapsed = Math.min(nowSec, s.endTime) - s.startTime;
    const duration = s.endTime - s.startTime;
    if (duration <= 0) continue;
    total += (Number(s.deposit) / 10 ** USDC_DECIMALS) * (elapsed / duration);
  }
  return total;
}

function computeWithdrawable(streams: StreamInfo[], nowSec: number): number {
  let total = 0;
  for (const s of streams) {
    if (nowSec <= s.startTime) continue;
    const elapsed = Math.min(nowSec, s.endTime) - s.startTime;
    const duration = s.endTime - s.startTime;
    if (duration <= 0) continue;
    const streamed = (Number(s.deposit) / 10 ** USDC_DECIMALS) * (elapsed / duration);
    const withdrawn = Number(s.withdrawn) / 10 ** USDC_DECIMALS;
    total += Math.max(0, streamed - withdrawn);
  }
  return total;
}

interface StreamingAmountProps {
  streams: StreamInfo[];
}

export function StreamingAmount({ streams }: StreamingAmountProps) {
  const [now, setNow] = useState(() => Date.now() / 1000);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now() / 1000), 50);
    return () => clearInterval(id);
  }, []);

  const streamed = computeStreamed(streams, now);
  const claimable = computeWithdrawable(streams, now);

  // Format with enough decimals to show the ticking
  const fmt = (v: number) => v < 0.01
    ? v.toFixed(6)
    : v < 1
      ? v.toFixed(4)
      : v.toFixed(2);

  return (
    <div className="text-right">
      <p className="text-xs font-mono tabular-nums text-[#4080c0]">
        ${fmt(streamed)} <span className="text-[#4080c0]/50">streamed</span>
      </p>
      {claimable > 0.000001 && (
        <p className="text-xs font-mono tabular-nums text-[#40a040]">
          ${fmt(claimable)} <span className="text-[#40a040]/50">claimable</span>
        </p>
      )}
    </div>
  );
}
