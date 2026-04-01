'use client';

import { useAccount, useBalance, useReadContract } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';
import { inkSepolia } from '@/lib/chains';

export function useWalletBalance() {
  const { address, isConnected } = useAccount();

  const { data: ethData, isLoading: isLoadingEth } = useBalance({
    address,
    chainId: inkSepolia.id,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 30_000,
    },
  });

  const { data: usdcRaw, isLoading: isLoadingUsdc } = useReadContract({
    address: CONTRACTS.USDC.address,
    abi: CONTRACTS.USDC.abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: inkSepolia.id,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 30_000,
    },
  });

  return {
    ethBalance: ethData?.value ?? 0n,
    ethFormatted: ethData?.formatted ?? '0',
    usdcBalance: (usdcRaw as bigint) ?? 0n,
    isLoading: isLoadingEth || isLoadingUsdc,
  };
}
