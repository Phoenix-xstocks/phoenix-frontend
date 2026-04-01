'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { createPublicClient, http, type Address } from 'viem';
import { CONTRACTS } from '@/lib/contracts';
import { inkSepolia } from '@/lib/chains';

const LOG_BLOCK_RANGE = 90_000n;

export type TransactionEventType = 'deposit' | 'coupon' | 'settlement';

export interface TransactionEvent {
  type: TransactionEventType;
  noteId: `0x${string}`;
  amount: bigint;
  blockNumber: bigint;
  txHash: `0x${string}`;
}

const publicClient = createPublicClient({
  chain: inkSepolia,
  transport: http(),
});

export function useTransactionHistory(userNoteIds: `0x${string}`[]) {
  const { address, isConnected } = useAccount();
  const [events, setEvents] = useState<TransactionEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!address) return [];

    const engineAddress = CONTRACTS.AutocallEngine.address as Address;
    const currentBlock = await publicClient.getBlockNumber();
    const fromBlock = currentBlock > LOG_BLOCK_RANGE ? currentBlock - LOG_BLOCK_RANGE : 0n;

    const createdLogs = await publicClient.getLogs({
      address: engineAddress,
      event: {
        type: 'event',
        name: 'NoteCreated',
        inputs: [
          { name: 'noteId', type: 'bytes32', indexed: true },
          { name: 'holder', type: 'address', indexed: true },
          { name: 'notional', type: 'uint256', indexed: false },
        ],
      },
      args: { holder: address },
      fromBlock,
      toBlock: 'latest',
    });

    const depositEvents: TransactionEvent[] = createdLogs.map((log) => ({
      type: 'deposit' as const,
      noteId: log.topics[1] as `0x${string}`,
      amount: log.args.notional ?? 0n,
      blockNumber: log.blockNumber,
      txHash: log.transactionHash,
    }));

    let couponEvents: TransactionEvent[] = [];
    let settleEvents: TransactionEvent[] = [];

    if (userNoteIds.length > 0) {
      const couponLogs = await publicClient.getLogs({
        address: engineAddress,
        event: {
          type: 'event',
          name: 'CouponPaid',
          inputs: [
            { name: 'noteId', type: 'bytes32', indexed: true },
            { name: 'amount', type: 'uint256', indexed: false },
            { name: 'memoryPaid', type: 'uint256', indexed: false },
          ],
        },
        args: { noteId: userNoteIds },
        fromBlock,
        toBlock: 'latest',
      });

      couponEvents = couponLogs.map((log) => ({
        type: 'coupon' as const,
        noteId: log.topics[1] as `0x${string}`,
        amount: log.args.amount ?? 0n,
        blockNumber: log.blockNumber,
        txHash: log.transactionHash,
      }));

      const settleLogs = await publicClient.getLogs({
        address: engineAddress,
        event: {
          type: 'event',
          name: 'NoteSettled',
          inputs: [
            { name: 'noteId', type: 'bytes32', indexed: true },
            { name: 'payout', type: 'uint256', indexed: false },
            { name: 'kiPhysical', type: 'bool', indexed: false },
          ],
        },
        args: { noteId: userNoteIds },
        fromBlock,
        toBlock: 'latest',
      });

      settleEvents = settleLogs.map((log) => ({
        type: 'settlement' as const,
        noteId: log.topics[1] as `0x${string}`,
        amount: log.args.payout ?? 0n,
        blockNumber: log.blockNumber,
        txHash: log.transactionHash,
      }));
    }

    const all = [...depositEvents, ...couponEvents, ...settleEvents];
    all.sort((a, b) => Number(b.blockNumber - a.blockNumber));
    return all.slice(0, 10);
  }, [address, userNoteIds]);

  useEffect(() => {
    if (!isConnected || !address) {
      setEvents([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const result = await fetchHistory();
        if (!cancelled) setEvents(result);
      } catch {
        // silently fail for history
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isConnected, address, fetchHistory]);

  return { events, isLoading };
}
