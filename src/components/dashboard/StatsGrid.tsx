'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { formatUSDCCompact, formatBps } from '@/lib/format';
import { TARGET_APY_BPS } from '@/lib/constants';
import type { ProtocolStatsData } from '@/hooks/useProtocolStats';

interface StatsGridProps {
  stats: ProtocolStatsData | undefined;
  isLoading: boolean;
}

interface StatItemProps {
  label: string;
  value: string;
  accent?: boolean;
}

function StatItem({ label, value, accent }: StatItemProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs text-white/30 uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-xl font-mono tabular-nums ${accent ? 'text-[#40a040]' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <Skeleton className="h-3 w-20 mb-3" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatItem
        label="Target APY"
        value={`${(TARGET_APY_BPS / 100).toFixed(1)}%`}
        accent
      />
      <StatItem
        label="Total Notes"
        value={stats.totalNotesCreated.toString()}
      />
      <StatItem
        label="TVL"
        value={`$${formatUSDCCompact(stats.tvl)}`}
      />
      <StatItem
        label="Reserve"
        value={formatBps(stats.reserveLevel)}
      />
    </div>
  );
}
