'use client';

import { useReadContract } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';
import { inkSepolia } from '@/lib/chains';

export type WaterfallResult = {
  p1Paid: bigint;
  p2Paid: bigint;
  p3Paid: bigint;
  p4Paid: bigint;
  p5Paid: bigint;
  p6Paid: bigint;
  p1FullyPaid: boolean;
};

export function useWaterfallResult() {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACTS.EpochManager.address,
    abi: CONTRACTS.EpochManager.abi,
    functionName: 'getLastResult',
    chainId: inkSepolia.id,
    query: {
      enabled: true,
      refetchInterval: 60_000,
    },
  });

  const result = data as WaterfallResult | undefined;

  return {
    result,
    isLoading,
    error,
  };
}
