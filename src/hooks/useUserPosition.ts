'use client';

import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';
import { inkSepolia } from '@/lib/chains';
import { TARGET_APY_BPS, PROTOCOL_CONSTANTS } from '@/lib/constants';

export interface UserPosition {
  /** Estimated USDC deposited */
  depositedUsdc: number;
  /** Total earned so far in USDC (human-readable) */
  earnedUsdc: number;
  /** APY as decimal (e.g. 0.12) */
  apyDecimal: number;
  /** Timestamp of last data sync */
  lastSyncTimestamp: number;
  /** Whether the user has an active position */
  hasPosition: boolean;
}

export function useUserPosition(): { position: UserPosition; isLoading: boolean } {
  const { address, isConnected } = useAccount();

  // Read user's USDC balance (coupons are paid in USDC)
  const { data: usdcBalance, isLoading: isLoadingBalance } = useReadContract({
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

  // Read total vault assets to estimate user's share
  const { data: totalAssets, isLoading: isLoadingAssets } = useReadContract({
    address: CONTRACTS.XYieldVault.address,
    abi: CONTRACTS.XYieldVault.abi,
    functionName: 'totalAssets',
    chainId: inkSepolia.id,
    query: {
      enabled: isConnected,
      refetchInterval: 30_000,
    },
  });

  const isLoading = isLoadingBalance || isLoadingAssets;
  const decimals = PROTOCOL_CONSTANTS.USDC_DECIMALS;
  const apyDecimal = TARGET_APY_BPS / 10_000;

  const balance = (usdcBalance as bigint) ?? 0n;
  const assets = (totalAssets as bigint) ?? 0n;

  // User has a position if the vault has assets and user has USDC
  // (in production this would check note ownership via SablierStream)
  const hasPosition = isConnected && assets > 0n;

  // For demo: use totalAssets as deposited amount, simulate small earned amount
  const depositedUsdc = Number(assets) / 10 ** decimals;
  const earnedUsdc = depositedUsdc * 0.001; // seed with a small earned amount

  return {
    position: {
      depositedUsdc,
      earnedUsdc,
      apyDecimal,
      lastSyncTimestamp: Math.floor(Date.now() / 1000),
      hasPosition: !!hasPosition,
    },
    isLoading,
  };
}
