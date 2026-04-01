'use client';

import { useAccount } from 'wagmi';
import { StreamingCounter } from '@/components/dashboard/StreamingCounter';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { EpochProgress } from '@/components/dashboard/EpochProgress';
import { WaterfallChart } from '@/components/dashboard/WaterfallChart';
import { useProtocolStats } from '@/hooks/useProtocolStats';
import { useEpochInfo } from '@/hooks/useEpochInfo';
import { useWaterfallResult } from '@/hooks/useWaterfallResult';
import { useUserPosition } from '@/hooks/useUserPosition';

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const { stats, isLoading: isLoadingStats } = useProtocolStats();
  const {
    currentEpoch,
    epochStartTimestamp,
    epochEndTimestamp,
    isEpochReady,
    isLoading: isLoadingEpoch,
  } = useEpochInfo();
  const { result, isLoading: isLoadingWaterfall } = useWaterfallResult();
  const { position, isLoading: isLoadingPosition } = useUserPosition();

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
      {/* Hero: streaming earnings */}
      <StreamingCounter
        earnedUsdc={position.earnedUsdc}
        depositedUsdc={position.depositedUsdc}
        apyDecimal={position.apyDecimal}
        lastSyncTimestamp={position.lastSyncTimestamp}
        hasPosition={position.hasPosition}
        isLoading={isLoadingPosition}
      />

      {/* Protocol stats */}
      <StatsGrid stats={stats} isLoading={isLoadingStats} />

      {/* Epoch progress */}
      <EpochProgress
        currentEpoch={Number(currentEpoch ?? 0n)}
        epochStartTimestamp={Number(epochStartTimestamp ?? 0n)}
        epochEndTimestamp={Number(epochEndTimestamp ?? 0n)}
        isEpochReady={isEpochReady ?? false}
        isLoading={isLoadingEpoch}
      />

      {/* Waterfall distribution */}
      <WaterfallChart
        result={result}
        isLoading={isLoadingWaterfall}
      />
    </div>
  );
}
