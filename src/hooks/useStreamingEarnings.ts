'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60;

interface StreamingConfig {
  /** Base earned amount in USDC raw units (6 decimals) */
  baseEarned: number;
  /** Annual percentage yield as a decimal (e.g. 0.12 for 12%) */
  apyDecimal: number;
  /** Deposit principal in USDC raw units (6 decimals) */
  principal: number;
  /** Timestamp (seconds) when baseEarned was last synced */
  lastSyncTimestamp: number;
  /** Whether streaming is active */
  enabled?: boolean;
}

/**
 * Streams earnings forward in real-time using requestAnimationFrame.
 * Calculates yield per millisecond from APY and principal, then ticks
 * the display value forward from the last known on-chain snapshot.
 */
export function useStreamingEarnings({
  baseEarned,
  apyDecimal,
  principal,
  lastSyncTimestamp,
  enabled = true,
}: StreamingConfig) {
  const [displayEarned, setDisplayEarned] = useState(baseEarned);
  const rafRef = useRef<number>(0);
  const configRef = useRef({ baseEarned, apyDecimal, principal, lastSyncTimestamp });

  // Keep config ref in sync without restarting the loop
  useEffect(() => {
    configRef.current = { baseEarned, apyDecimal, principal, lastSyncTimestamp };
  }, [baseEarned, apyDecimal, principal, lastSyncTimestamp]);

  // Re-sync display when base changes
  useEffect(() => {
    setDisplayEarned(baseEarned);
  }, [baseEarned]);

  const tick = useCallback(() => {
    const { baseEarned: base, apyDecimal: apy, principal: p, lastSyncTimestamp: sync } = configRef.current;
    const nowSeconds = Date.now() / 1000;
    const elapsed = Math.max(0, nowSeconds - sync);
    const accrued = p * apy * elapsed / SECONDS_PER_YEAR;
    setDisplayEarned(base + accrued);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!enabled || principal <= 0) return;
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled, principal, tick]);

  return displayEarned;
}
