'use client';

import { useAccount } from 'wagmi';
import { PortfolioSummary } from '@/components/dashboard/PortfolioSummary';
import { YieldStream } from '@/components/dashboard/YieldStream';
import { NotesList } from '@/components/dashboard/NotesList';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useUserNotes } from '@/hooks/useUserNotes';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const { ethBalance, ethFormatted, usdcBalance, isLoading: isLoadingBalance } = useWalletBalance();
  const { notes, isLoading: isLoadingNotes } = useUserNotes();

  const userNoteIds = useMemo(
    () => notes.map((n) => n.noteId),
    [notes]
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
