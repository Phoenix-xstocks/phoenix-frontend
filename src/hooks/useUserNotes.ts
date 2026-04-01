'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { createPublicClient, http, type Address } from 'viem';
import { CONTRACTS } from '@/lib/contracts';
import { inkSepolia } from '@/lib/chains';
import { type NoteState } from '@/lib/noteStates';
import type { IndexerUserNote } from '@/lib/indexer-types';

const publicClient = createPublicClient({
  chain: inkSepolia,
  transport: http(),
});

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
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!address) return [];

    // Step 1: Get user's noteIds from the indexer (O(1) query)
    const res = await fetch(`/api/indexer/user-notes?address=${address}`);
    if (!res.ok) throw new Error('Failed to fetch user notes from indexer');
    const indexerNotes: IndexerUserNote[] = await res.json();

    if (indexerNotes.length === 0) return [];

    const noteIds = indexerNotes.map((n) => n.noteId as `0x${string}`);

    // Step 2: Multicall only for the user's notes (not all notes on-chain)
    const noteCalls = noteIds.flatMap((noteId) => [
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
  }, [address]);

  useEffect(() => {
    if (!isConnected || !address) {
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
  }, [isConnected, address, fetchNotes]);

  return { notes, isLoading, error };
}
