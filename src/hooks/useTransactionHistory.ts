'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import type { IndexerTransactionEvent } from '@/lib/indexer-types';

export type TransactionEventType = IndexerTransactionEvent['type'];

export interface TransactionEvent {
  type: TransactionEventType;
  noteId: `0x${string}`;
  amount: bigint;
  blockNumber: bigint;
  blockTimestamp: string;
  txHash: `0x${string}`;
}

export function useTransactionHistory(userNoteIds: `0x${string}`[]) {
  const { address, isConnected } = useAccount();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['indexer-transactions', address, userNoteIds],
    queryFn: async (): Promise<TransactionEvent[]> => {
      const params = new URLSearchParams({ address: address! });
      if (userNoteIds.length > 0) {
        params.set('noteIds', userNoteIds.join(','));
      }
      const res = await fetch(`/api/indexer/transactions?${params}`);
      if (!res.ok) throw new Error('Failed to fetch transactions');
      const data: IndexerTransactionEvent[] = await res.json();
      return data.map((evt) => ({
        type: evt.type,
        noteId: evt.noteId as `0x${string}`,
        amount: BigInt(evt.amount),
        blockNumber: BigInt(evt.blockNumber),
        blockTimestamp: evt.blockTimestamp,
        txHash: evt.txHash as `0x${string}`,
      }));
    },
    enabled: isConnected && !!address,
    refetchInterval: 60_000,
  });

  return { events, isLoading };
}
