'use client';

import { useReadContract } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';
import { inkSepolia } from '@/lib/chains';

export enum RequestStatus {
  Pending = 0,
  ReadyToClaim = 1,
  Claimed = 2,
  Refunded = 3,
  Cancelled = 4,
}

export interface DepositRequest {
  depositor: `0x${string}`;
  receiver: `0x${string}`;
  amount: bigint;
  noteId: `0x${string}`;
  requestedAt: bigint;
  readyAt: bigint;
  status: RequestStatus;
}

/**
 * Polls a specific deposit request by ID.
 * The `requests` mapping returns a flat tuple:
 *   (depositor, receiver, amount, noteId, requestedAt, readyAt, status)
 */
export function useDepositRequest(requestId: bigint | undefined) {
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACTS.XYieldVault.address,
    abi: CONTRACTS.XYieldVault.abi,
    functionName: 'requests',
    args: requestId !== undefined ? [requestId] : undefined,
    chainId: inkSepolia.id,
    query: {
      enabled: requestId !== undefined,
      refetchInterval: (query) => {
        const result = query.state.data as
          | readonly [
              `0x${string}`,
              `0x${string}`,
              bigint,
              `0x${string}`,
              bigint,
              bigint,
              number,
            ]
          | undefined;
        if (!result) return 5_000;
        const status = result[6] as RequestStatus;
        // Poll every 5s while pending, stop polling once terminal
        if (
          status === RequestStatus.Claimed ||
          status === RequestStatus.Refunded ||
          status === RequestStatus.Cancelled
        ) {
          return false;
        }
        return 5_000;
      },
    },
  });

  // Parse the flat tuple into a structured object
  const request: DepositRequest | undefined = data
    ? {
        depositor: (data as readonly unknown[])[0] as `0x${string}`,
        receiver: (data as readonly unknown[])[1] as `0x${string}`,
        amount: (data as readonly unknown[])[2] as bigint,
        noteId: (data as readonly unknown[])[3] as `0x${string}`,
        requestedAt: (data as readonly unknown[])[4] as bigint,
        readyAt: (data as readonly unknown[])[5] as bigint,
        status: (data as readonly unknown[])[6] as RequestStatus,
      }
    : undefined;

  return {
    request,
    isLoading,
    refetch,
  };
}
