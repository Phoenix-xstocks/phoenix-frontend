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
  streamedAmount: bigint;
  withdrawable: bigint;
}

export function useUserNotes() {
  const { address, isConnected } = useAccount();
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!address) return [];

    // Step 1: Get user's noteIds from the indexer
    const res = await fetch(`/api/indexer/user-notes?address=${address}`);
    if (!res.ok) throw new Error('Failed to fetch user notes from indexer');
    const indexerNotes: IndexerUserNote[] = await res.json();

    if (indexerNotes.length === 0) return [];

    const noteIds = indexerNotes.map((n) =>
      (n.noteId.startsWith('0x') ? n.noteId : `0x${n.noteId}`) as `0x${string}`,
    );
    // Step 2: Multicall for note data + stream IDs
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
      {
        address: CONTRACTS.CouponStreamer.address as Address,
        abi: CONTRACTS.CouponStreamer.abi,
        functionName: 'getNoteStreams' as const,
        args: [noteId],
      },
    ]);

    const results = await publicClient.multicall({ contracts: noteCalls });

    // Collect all stream IDs across all notes for a second multicall
    const noteStreamIds: bigint[][] = [];
    for (let i = 0; i < noteIds.length; i++) {
      const streamsResult = results[i * 3 + 2];
      const ids = streamsResult.status === 'success' ? (streamsResult.result as bigint[]) : [];
      noteStreamIds.push(ids);
    }

    const allStreamIds = noteStreamIds.flat();

    // Step 3: Fetch streamed + withdrawable for each stream
    let streamAmounts: Map<string, { streamed: bigint; withdrawable: bigint }> = new Map();
    if (allStreamIds.length > 0) {
      const streamCalls = allStreamIds.flatMap((streamId) => [
        {
          address: CONTRACTS.CouponStreamer.address as Address,
          abi: CONTRACTS.CouponStreamer.abi,
          functionName: 'getStreamedAmount' as const,
          args: [streamId],
        },
        {
          address: CONTRACTS.CouponStreamer.address as Address,
          abi: CONTRACTS.CouponStreamer.abi,
          functionName: 'getWithdrawable' as const,
          args: [streamId],
        },
      ]);
      const streamResults = await publicClient.multicall({ contracts: streamCalls });

      for (let j = 0; j < allStreamIds.length; j++) {
        const streamedRes = streamResults[j * 2];
        const withdrawableRes = streamResults[j * 2 + 1];
        streamAmounts.set(allStreamIds[j].toString(), {
          streamed: streamedRes.status === 'success' ? (streamedRes.result as bigint) : 0n,
          withdrawable: withdrawableRes.status === 'success' ? (withdrawableRes.result as bigint) : 0n,
        });
      }
    }

    const userNotes: UserNote[] = [];
    for (let i = 0; i < noteIds.length; i++) {
      const noteResult = results[i * 3];
      const statusResult = results[i * 3 + 1];

      if (noteResult.status !== 'success' || statusResult.status !== 'success') continue;

      const [basket, notional, , state, observations, memoryCoupon, totalCouponBps, createdAt, maturityDate] =
        noteResult.result as [readonly string[], bigint, string, number, number, bigint, bigint, bigint, bigint];

      const [, , nextObservationTime, currentTriggerBps, couponPerObsBps] =
        statusResult.result as [number, number, bigint, bigint, bigint];

      // Sum streamed + withdrawable across all streams for this note
      let streamedAmount = 0n;
      let withdrawable = 0n;
      for (const sid of noteStreamIds[i]) {
        const amounts = streamAmounts.get(sid.toString());
        if (amounts) {
          streamedAmount += amounts.streamed;
          withdrawable += amounts.withdrawable;
        }
      }

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
        streamedAmount,
        withdrawable,
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
