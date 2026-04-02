'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { formatUSDC } from '@/lib/format';
import { Skeleton } from '@/components/ui/Skeleton';
import { TARGET_APY_BPS, PROTOCOL_CONSTANTS } from '@/lib/constants';
import { NoteState } from '@/lib/noteStates';
import type { UserNote } from '@/hooks/useUserNotes';

interface YieldStreamProps {
  notes: UserNote[];
  usdcBalance: bigint;
  isLoading: boolean;
}

const SECONDS_PER_YEAR = 365.25 * 24 * 3600;
const DECIMALS = PROTOCOL_CONSTANTS.USDC_DECIMALS;
const APY_DECIMAL = TARGET_APY_BPS / 10_000;

function formatStreamValue(value: number): string {
  const integer = Math.floor(value);
  const fraction = value - integer;
  const intStr = integer.toLocaleString('en-US');
  const fracStr = fraction.toFixed(8).slice(1);
  return `${intStr}${fracStr}`;
}

export function YieldStream({ notes, usdcBalance, isLoading }: YieldStreamProps) {
  const [displayValue, setDisplayValue] = useState('0.00000000');
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const baseValueRef = useRef<number>(0);
  const ratePerSecRef = useRef<number>(0);

  const activeNotes = notes.filter(
    (n) => n.state === NoteState.Active || n.state === NoteState.ObservationPending
  );

  const totalNotional = activeNotes.reduce((sum, n) => sum + n.notional, 0n);
  const totalCouponBps = activeNotes.reduce((sum, n) => sum + n.totalCouponBps, 0n);

  const depositedUsdc = Number(totalNotional) / 10 ** DECIMALS;
  const earnedUsdc = (depositedUsdc * Number(totalCouponBps)) / 10_000;
  const ratePerSec = (depositedUsdc * APY_DECIMAL) / SECONDS_PER_YEAR;

  const tick = useCallback(() => {
    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const current = baseValueRef.current + ratePerSecRef.current * elapsed;
    setDisplayValue(formatStreamValue(current));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    baseValueRef.current = depositedUsdc + earnedUsdc;
    ratePerSecRef.current = ratePerSec;
    startTimeRef.current = performance.now();

    if (ratePerSec > 0) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setDisplayValue(formatStreamValue(depositedUsdc + earnedUsdc));
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [depositedUsdc, earnedUsdc, ratePerSec, tick]);

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <Skeleton className="h-12 w-72 mx-auto" />
      </div>
    );
  }

  const hasPosition = activeNotes.length > 0;

  return (
    <div className="py-12 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">Yield Stream</p>
      <p className="text-5xl md:text-6xl lg:text-7xl font-light tabular-nums text-white tracking-tight">
        <span className="text-white/30">$</span>
        {hasPosition ? displayValue : '0.00000000'}
      </p>
      {hasPosition && (
        <p className="text-sm text-[#40a040]/50 font-mono mt-4 tracking-wide">
          +${ratePerSec.toFixed(8)}/s
        </p>
      )}
      <div className="mt-6 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}
