'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { formatUSDC } from '@/lib/format';
import { inkSepolia } from '@/lib/chains';
import type { TransactionEvent, TransactionEventType } from '@/hooks/useTransactionHistory';

interface TransactionListProps {
  events: TransactionEvent[];
  isLoading: boolean;
}

const EVENT_CONFIG: Record<TransactionEventType, { label: string; icon: string; color: string }> = {
  deposit: { label: 'Deposit', icon: '+', color: 'text-cyan-400' },
  coupon: { label: 'Coupon', icon: '$', color: 'text-[#40a040]' },
  settlement: { label: 'Settlement', icon: '=', color: 'text-white' },
};

function shortenHash(hash: string): string {
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

export function TransactionList({ events, isLoading }: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <Skeleton className="h-4 w-32 mb-5" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const explorerUrl = inkSepolia.blockExplorers.default.url;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm text-white/40 mb-5 tracking-wide uppercase">Recent Activity</p>

      {events.length === 0 ? (
        <p className="text-center text-white/20 py-6">No transactions yet</p>
      ) : (
        <div className="space-y-2">
          {events.map((evt, i) => {
            const config = EVENT_CONFIG[evt.type];
            return (
              <div
                key={`${evt.txHash}-${i}`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/5 bg-white/[0.01]"
              >
                <span
                  className={`w-7 h-7 flex items-center justify-center rounded-full bg-white/5 font-mono text-sm ${config.color}`}
                >
                  {config.icon}
                </span>

                <div className="flex-1 min-w-0">
                  <span className={`text-sm ${config.color}`}>{config.label}</span>
                </div>

                <span className="text-sm font-mono tabular-nums text-white">
                  ${formatUSDC(evt.amount)}
                </span>

                <a
                  href={`${explorerUrl}/tx/${evt.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-white/20 hover:text-white/50 transition-colors"
                >
                  {shortenHash(evt.txHash)}
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
