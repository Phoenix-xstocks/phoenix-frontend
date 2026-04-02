'use client';

import { useAccount } from 'wagmi';
import { Skeleton } from '@/components/ui/Skeleton';
import { shortenAddress, formatUSDC } from '@/lib/format';
import type { UserNote } from '@/hooks/useUserNotes';
import { NoteState } from '@/lib/noteStates';

interface PortfolioSummaryProps {
  ethBalance: bigint;
  ethFormatted: string;
  usdcBalance: bigint;
  notes: UserNote[];
  isLoading: boolean;
}

export function PortfolioSummary({
  ethBalance,
  ethFormatted,
  usdcBalance,
  notes,
  isLoading,
}: PortfolioSummaryProps) {
  const { address } = useAccount();

  const activeNotes = notes.filter(
    (n) => n.state === NoteState.Active || n.state === NoteState.ObservationPending
  );
  const totalNotional = activeNotes.reduce((sum, n) => sum + n.notional, 0n);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-5 w-40" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-l-2 border-white/10 pl-4">
              <Skeleton className="h-3 w-16 mb-3" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">
          Portfolio
        </p>
        {address && (
          <>
            <span className="w-px h-3 bg-white/10" />
            <span className="font-mono text-xs text-white/20">{shortenAddress(address)}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="border-l-2 border-white/10 pl-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">ETH</p>
          <p className="text-2xl font-light text-white">
            {Number(ethFormatted).toFixed(4)}
          </p>
        </div>

        <div className="border-l-2 border-white/10 pl-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">USDC</p>
          <p className="text-2xl font-light text-white">
            ${formatUSDC(usdcBalance)}
          </p>
        </div>

        <div className="border-l-2 border-white/10 pl-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">Active Notes</p>
          <p className="text-2xl font-light text-white">
            {activeNotes.length}
          </p>
        </div>

        <div className="border-l-2 border-[#40a040]/30 pl-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">Total Notional</p>
          <p className="text-2xl font-light text-[#40a040]">
            ${formatUSDC(totalNotional)}
          </p>
        </div>
      </div>
    </div>
  );
}
