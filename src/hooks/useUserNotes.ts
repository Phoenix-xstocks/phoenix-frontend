'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { type Address } from 'viem';
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

export function useUserNotes() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient({ chainId: inkSepolia.id });
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!publicClient || !address) return [];

    const count = Number(
      await publicClient.readContract({
        address: CONTRACTS.AutocallEngine.address as Address,
        abi: CONTRACTS.AutocallEngine.abi,
        functionName: 'getNoteCount',
      }) as bigint
    );

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

    const noteCalls = allIds.flatMap((noteId) => [
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

    const results = await publicClient.multicall({ contracts: noteCalls });

    const userNotes: UserNote[] = [];
    for (let i = 0; i < allIds.length; i++) {
      const noteResult = results[i * 2];
      const statusResult = results[i * 2 + 1];

      if (noteResult.status !== 'success' || statusResult.status !== 'success') continue;

      const [basket, notional, holder, state, observations, memoryCoupon, totalCouponBps, createdAt, maturityDate] =
        noteResult.result as [readonly string[], bigint, string, number, number, bigint, bigint, bigint, bigint];

      if (holder.toLowerCase() !== address.toLowerCase()) continue;

      const [, , nextObservationTime, currentTriggerBps, couponPerObsBps] =
        statusResult.result as [number, number, bigint, bigint, bigint];

      userNotes.push({
        noteId: allIds[i],
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
  }, [publicClient, address]);

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
        const userNotes = await fetchNotes();
        if (!cancelled) {
          setNotes(userNotes);
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
  }, [isConnected, address, publicClient, fetchNotes]);

  return { notes, isLoading, error };
}
