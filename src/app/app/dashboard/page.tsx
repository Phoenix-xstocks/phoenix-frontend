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
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center py-20">
          <p className="text-sm text-white/30">Connect your wallet to view your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-20">
      {/* Portfolio overview */}
      <PortfolioSummary
        ethBalance={ethBalance}
        ethFormatted={ethFormatted}
        usdcBalance={usdcBalance}
        notes={notes}
        isLoading={isLoadingBalance || isLoadingNotes}
      />

      {/* Divider */}
      <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Yield stream - hero section */}
      <YieldStream
        notes={notes}
        usdcBalance={usdcBalance}
        isLoading={isLoadingBalance || isLoadingNotes}
      />

      {/* Divider */}
      <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Pending claims */}
      <PendingClaims onClaimed={handleClaimed} />

      {/* Notes */}
      <div className="mt-14">
        <NotesList notes={notes} isLoading={isLoadingNotes} />
      </div>

      {/* Transactions */}
      <div className="mt-14">
        <TransactionList events={events} isLoading={isLoadingHistory} />
      </div>
    </div>
  );
}
