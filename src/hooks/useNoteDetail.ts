'use client';

import { useReadContract } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';
import { inkSepolia } from '@/lib/chains';
import { NoteState, NOTE_STATE_CONFIG } from '@/lib/noteStates';

export interface NoteDetail {
  basket: readonly string[];
  notional: bigint;
  holder: string;
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

export function useNoteDetail(noteId: `0x${string}` | undefined) {
  const enabled = !!noteId && /^0x[a-fA-F0-9]{64}$/.test(noteId);

  const {
    data: noteData,
    isLoading: isLoadingNote,
    isError: isErrorNote,
  } = useReadContract({
    address: CONTRACTS.AutocallEngine.address,
    abi: CONTRACTS.AutocallEngine.abi,
    functionName: 'getNote',
    args: noteId ? [noteId] : undefined,
    chainId: inkSepolia.id,
    query: {
      enabled,
      refetchInterval: 15_000,
    },
  });

  const {
    data: statusData,
    isLoading: isLoadingStatus,
    isError: isErrorStatus,
  } = useReadContract({
    address: CONTRACTS.AutocallEngine.address,
    abi: CONTRACTS.AutocallEngine.abi,
    functionName: 'getNoteStatus',
    args: noteId ? [noteId] : undefined,
    chainId: inkSepolia.id,
    query: {
      enabled,
      refetchInterval: 15_000,
    },
  });

  const isLoading = isLoadingNote || isLoadingStatus;
  const isError = isErrorNote || isErrorStatus;

  let note: NoteDetail | undefined;

  if (noteData && statusData) {
    const [basket, notional, holder, state, observations, memoryCoupon, totalCouponBps, createdAt, maturityDate] = noteData as [
      readonly string[],
      bigint,
      string,
      number,
      number,
      bigint,
      bigint,
      bigint,
      bigint,
    ];

    const [, , nextObservationTime, currentTriggerBps, couponPerObsBps] = statusData as [
      number,
      number,
      bigint,
      bigint,
      bigint,
    ];

    note = {
      basket,
      notional,
      holder,
      state: state as NoteState,
      observations,
      memoryCoupon,
      totalCouponBps,
      createdAt,
      maturityDate,
      nextObservationTime,
      currentTriggerBps,
      couponPerObsBps,
    };
  }

  const stateConfig = note ? NOTE_STATE_CONFIG[note.state] : undefined;

  return { note, stateConfig, isLoading, isError };
}
