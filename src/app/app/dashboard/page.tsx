'use client';

import { useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { PortfolioSummary } from '@/components/dashboard/PortfolioSummary';
import { PendingClaims } from '@/components/dashboard/PendingClaims';
import { YieldStream } from '@/components/dashboard/YieldStream';
import { NotesList } from '@/components/dashboard/NotesList';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useUserNotes } from '@/hooks/useUserNotes';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { NoteState } from '@/lib/noteStates';
import { FLAGSHIP_BASKET, PROTOCOL_CONSTANTS } from '@/lib/constants';
import type { ClaimableDeposit } from '@/hooks/useClaimableDeposits';

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const { ethBalance, ethFormatted, usdcBalance, isLoading: isLoadingBalance } = useWalletBalance();
  const { notes, isLoading: isLoadingNotes, addOptimisticNote } = useUserNotes();

  const handleClaimed = useCallback(
    (deposit: ClaimableDeposit) => {
      const netAmount =
        deposit.amount -
        (deposit.amount * PROTOCOL_CONSTANTS.TOTAL_FEE_BPS) / 10_000n;

      addOptimisticNote({
        noteId: deposit.noteId,
        basket: [...FLAGSHIP_BASKET],
        notional: netAmount,
        state: NoteState.Active,
        observations: 0,
        memoryCoupon: 0n,
        totalCouponBps: 0n,
        createdAt: BigInt(Math.floor(Date.now() / 1000)),
        maturityDate: BigInt(
          Math.floor(Date.now() / 1000) +
            PROTOCOL_CONSTANTS.MATURITY_DAYS * 86400,
        ),
        nextObservationTime: BigInt(
          Math.floor(Date.now() / 1000) +
            PROTOCOL_CONSTANTS.OBS_INTERVAL_DAYS * 86400,
        ),
        currentTriggerBps: BigInt(PROTOCOL_CONSTANTS.AUTOCALL_TRIGGER_BPS),
        couponPerObsBps: 0n,
        streams: [],
      });
    },
    [addOptimisticNote],
  );

  const userNoteIds = useMemo(
    () => notes.map((n) => n.noteId),
    [notes],
  );

  const { events, isLoading: isLoadingHistory } = useTransactionHistory(userNoteIds);

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 text-center text-muted-foreground">
          Connect your wallet to view your dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 space-y-6">
      <PortfolioSummary
        ethBalance={ethBalance}
        ethFormatted={ethFormatted}
        usdcBalance={usdcBalance}
        notes={notes}
        isLoading={isLoadingBalance || isLoadingNotes}
      />

      <PendingClaims onClaimed={handleClaimed} />

      <YieldStream
        notes={notes}
        usdcBalance={usdcBalance}
        isLoading={isLoadingBalance || isLoadingNotes}
      />

      <NotesList notes={notes} isLoading={isLoadingNotes} />

      <TransactionList events={events} isLoading={isLoadingHistory} />
    </div>
  );
}
