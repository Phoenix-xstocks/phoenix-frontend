'use client';

import { useAccount } from 'wagmi';
import { TARGET_APY_BPS, PROTOCOL_CONSTANTS } from '@/lib/constants';
import { NoteState } from '@/lib/noteStates';
import type { UserNote } from '@/hooks/useUserNotes';

export interface UserPosition {
  depositedUsdc: number;
  earnedUsdc: number;
  apyDecimal: number;
  lastSyncTimestamp: number;
  hasPosition: boolean;
}

export function useUserPosition(notes: UserNote[] = []): {
  position: UserPosition;
  isLoading: boolean;
} {
  const { isConnected } = useAccount();

  const decimals = PROTOCOL_CONSTANTS.USDC_DECIMALS;
  const apyDecimal = TARGET_APY_BPS / 10_000;

  const activeNotes = notes.filter(
    (n) => n.state === NoteState.Active || n.state === NoteState.ObservationPending
  );

  const totalNotional = activeNotes.reduce((sum, n) => sum + n.notional, 0n);
  const totalCouponBps = activeNotes.reduce((sum, n) => sum + n.totalCouponBps, 0n);

  const depositedUsdc = Number(totalNotional) / 10 ** decimals;
  const earnedUsdc = (depositedUsdc * Number(totalCouponBps)) / 10_000;
  const hasPosition = isConnected && activeNotes.length > 0;

  return {
    position: {
      depositedUsdc,
      earnedUsdc,
      apyDecimal,
      lastSyncTimestamp: Math.floor(Date.now() / 1000),
      hasPosition,
    },
    isLoading: false,
  };
}
