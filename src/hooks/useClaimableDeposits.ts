'use client';

import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';
import { inkSepolia } from '@/lib/chains';

export interface ClaimableDeposit {
  requestId: bigint;
  amount: bigint;
  noteId: `0x${string}`;
  readyAt: bigint;
}

/**
 * Scans all vault deposit requests and returns those that are
 * ReadyToClaim (status 1) for the connected wallet.
 */
export function useClaimableDeposits() {
  const { address } = useAccount();

  // Get total number of requests
  const { data: nextRequestId } = useReadContract({
    address: CONTRACTS.XYieldVault.address,
    abi: CONTRACTS.XYieldVault.abi,
    functionName: 'nextRequestId',
    chainId: inkSepolia.id,
  });

  const count = Number(nextRequestId ?? 0n);

  // Read all requests in one multicall
  const { data: allRequests, isLoading } = useReadContracts({
    contracts: Array.from({ length: count }, (_, i) => ({
      address: CONTRACTS.XYieldVault.address,
      abi: CONTRACTS.XYieldVault.abi,
      functionName: 'requests' as const,
      args: [BigInt(i)],
      chainId: inkSepolia.id,
    })),
    query: {
      enabled: count > 0,
      refetchInterval: 10_000,
    },
  });

  const claimable: ClaimableDeposit[] = [];

  if (allRequests && address) {
    for (let i = 0; i < allRequests.length; i++) {
      const result = allRequests[i];
      if (result.status !== 'success' || !result.result) continue;

      const data = result.result as readonly [
        `0x${string}`, // depositor
        `0x${string}`, // receiver
        bigint,        // amount
        `0x${string}`, // noteId
        bigint,        // requestedAt
        bigint,        // readyAt
        number,        // status
      ];

      const [, receiver, amount, noteId, , readyAt, status] = data;

      // ReadyToClaim = 1, and receiver matches connected wallet
      if (status === 1 && receiver.toLowerCase() === address.toLowerCase()) {
        claimable.push({
          requestId: BigInt(i),
          amount,
          noteId,
          readyAt,
        });
      }
    }
  }

  return { claimable, isLoading };
}
