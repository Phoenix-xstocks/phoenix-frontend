'use client';

import { useReadContract } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';
import { inkSepolia } from '@/lib/chains';

export type ProtocolStatsData = {
  totalNotesCreated: bigint;
  tvl: bigint;
  maxDeposit: bigint;
  reserveBalance: bigint;
  engineUsdcBalance: bigint;
  vaultUsdcBalance: bigint;
  reserveLevel: bigint;
};

export function useProtocolStats(totalNotional: bigint = 0n) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACTS.ProtocolStats.address,
    abi: CONTRACTS.ProtocolStats.abi,
    functionName: 'getStats',
    args: [totalNotional],
    chainId: inkSepolia.id,
    query: {
      enabled: true,
      refetchInterval: 30_000,
    },
  });

  const stats = data as ProtocolStatsData | undefined;

  return {
    stats,
    isLoading,
    error,
  };
}
