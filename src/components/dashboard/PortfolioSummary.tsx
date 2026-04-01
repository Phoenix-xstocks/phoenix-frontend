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
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-7 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
      <p className="text-sm text-white/40 mb-6 tracking-wide uppercase">
        Portfolio
        {address && (
          <span className="ml-3 font-mono text-white/20">{shortenAddress(address)}</span>
        )}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-xs text-white/30 uppercase tracking-wide mb-1">ETH</p>
          <p className="text-xl font-mono tabular-nums text-white">
            {Number(ethFormatted).toFixed(4)}
          </p>
        </div>

        <div>
          <p className="text-xs text-white/30 uppercase tracking-wide mb-1">USDC</p>
          <p className="text-xl font-mono tabular-nums text-white">
            ${formatUSDC(usdcBalance)}
          </p>
        </div>

        <div>
          <p className="text-xs text-white/30 uppercase tracking-wide mb-1">Active Notes</p>
          <p className="text-xl font-mono tabular-nums text-white">
            {activeNotes.length}
          </p>
        </div>

        <div>
          <p className="text-xs text-white/30 uppercase tracking-wide mb-1">Total Notional</p>
          <p className="text-xl font-mono tabular-nums text-[#40a040]">
            ${formatUSDC(totalNotional)}
          </p>
        </div>
      </div>
    </div>
  );
}
