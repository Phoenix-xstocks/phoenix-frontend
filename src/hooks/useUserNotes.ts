'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAccount, usePublicClient, useReadContract } from 'wagmi';
import { decodeEventLog, type Address } from 'viem';
import { CONTRACTS } from '@/lib/contracts';
import { inkSepolia } from '@/lib/chains';
import { type NoteState } from '@/lib/noteStates';

export interface UserNote {
  noteId: `0x${string}`;
  basket: readonly string[];
  notional: bigint;
  state: NoteState;
  observations: number;
  memoryCoupon: bigint;
  totalCouponBps: bigint;
  createdAt: bigint;
  maturityDate: bigint;
  nextObservationTime: bigint;
  currentTriggerBps: bigint;
  couponPerObsBps: bigint;
}

const NOTE_CREATED_EVENT = CONTRACTS.AutocallEngine.abi.find(
  (item) => item.type === 'event' && item.name === 'NoteCreated'
)!;

export function useUserNotes() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient({ chainId: inkSepolia.id });
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { data: noteCount } = useReadContract({
    address: CONTRACTS.AutocallEngine.address,
    abi: CONTRACTS.AutocallEngine.abi,
    functionName: 'getNoteCount',
    chainId: inkSepolia.id,
    query: {
      enabled: isConnected,
      refetchInterval: 30_000,
    },
  });

  const fetchNoteDetails = useCallback(
    async (noteIds: `0x${string}`[]) => {
      if (!publicClient || noteIds.length === 0) return [];

      const calls = noteIds.flatMap((noteId) => [
        {
          address: CONTRACTS.AutocallEngine.address as Address,
          abi: CONTRACTS.AutocallEngine.abi,
          functionName: 'getNote' as const,
          args: [noteId],
        },
        {
          address: CONTRACTS.AutocallEngine.address as Address,
          abi: CONTRACTS.AutocallEngine.abi,
          functionName: 'getNoteStatus' as const,
          args: [noteId],
        },
      ]);

      const results = await publicClient.multicall({ contracts: calls });

      const userNotes: UserNote[] = [];
      for (let i = 0; i < noteIds.length; i++) {
        const noteResult = results[i * 2];
        const statusResult = results[i * 2 + 1];

        if (noteResult.status !== 'success' || statusResult.status !== 'success') continue;

        const [basket, notional, , state, observations, memoryCoupon, totalCouponBps, createdAt, maturityDate] =
          noteResult.result as [readonly string[], bigint, string, number, number, bigint, bigint, bigint, bigint];

        const [, , nextObservationTime, currentTriggerBps, couponPerObsBps] =
          statusResult.result as [number, number, bigint, bigint, bigint];

        userNotes.push({
          noteId: noteIds[i],
          basket,
          notional,
          state: state as NoteState,
          observations,
          memoryCoupon,
          totalCouponBps,
          createdAt,
          maturityDate,
          nextObservationTime,
          currentTriggerBps,
          couponPerObsBps,
        });
      }

      return userNotes;
    },
    [publicClient]
  );

  const fetchViaLogs = useCallback(async (): Promise<`0x${string}`[]> => {
    if (!publicClient || !address) return [];

    const logs = await publicClient.getLogs({
      address: CONTRACTS.AutocallEngine.address as Address,
      event: {
        type: 'event',
        name: 'NoteCreated',
        inputs: [
          { name: 'noteId', type: 'bytes32', indexed: true },
          { name: 'holder', type: 'address', indexed: true },
          { name: 'notional', type: 'uint256', indexed: false },
        ],
      },
      args: {
        holder: address,
      },
      fromBlock: 0n,
      toBlock: 'latest',
    });

    return logs.map((log) => {
      const decoded = decodeEventLog({
        abi: [NOTE_CREATED_EVENT],
        data: log.data,
        topics: log.topics,
      });
      return (decoded.args as { noteId: `0x${string}` }).noteId;
    });
  }, [publicClient, address]);

  const fetchViaIteration = useCallback(async (): Promise<`0x${string}`[]> => {
    if (!publicClient || !address || !noteCount) return [];

    const count = Number(noteCount as bigint);
    if (count === 0) return [];

    const indexCalls = Array.from({ length: count }, (_, i) => ({
      address: CONTRACTS.AutocallEngine.address as Address,
      abi: CONTRACTS.AutocallEngine.abi,
      functionName: 'noteIds' as const,
      args: [BigInt(i)],
    }));

    const idResults = await publicClient.multicall({ contracts: indexCalls });
    const allIds = idResults
      .filter((r) => r.status === 'success')
      .map((r) => r.result as `0x${string}`);

    const noteCalls = allIds.map((noteId) => ({
      address: CONTRACTS.AutocallEngine.address as Address,
      abi: CONTRACTS.AutocallEngine.abi,
      functionName: 'getNote' as const,
      args: [noteId],
    }));

    const noteResults = await publicClient.multicall({ contracts: noteCalls });

    const userIds: `0x${string}`[] = [];
    for (let i = 0; i < allIds.length; i++) {
      if (noteResults[i].status !== 'success') continue;
      const [, , holder] = noteResults[i].result as unknown as [readonly string[], bigint, string, ...unknown[]];
      if (holder.toLowerCase() === address.toLowerCase()) {
        userIds.push(allIds[i]);
      }
    }

    return userIds;
  }, [publicClient, address, noteCount]);

  useEffect(() => {
    if (!isConnected || !address || !publicClient) {
      setNotes([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        let noteIds: `0x${string}`[];
        try {
          noteIds = await fetchViaLogs();
        } catch {
          noteIds = [];
        }

        if (noteIds.length === 0) {
          noteIds = await fetchViaIteration();
        }

        if (cancelled) return;

        const details = await fetchNoteDetails(noteIds);
        if (!cancelled) {
          setNotes(details);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch notes'));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();
    const interval = setInterval(load, 30_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isConnected, address, publicClient, fetchViaLogs, fetchViaIteration, fetchNoteDetails]);

  return { notes, isLoading, error };
}
