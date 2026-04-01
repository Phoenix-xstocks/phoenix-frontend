'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { TransactionButton } from '@/components/ui/TransactionButton';
import { formatBps } from '@/lib/format';
import { NoteState, NOTE_STATE_CONFIG } from '@/lib/noteStates';
import { CONTRACTS } from '@/lib/contracts';
import { PROTOCOL_CONSTANTS } from '@/lib/constants';
import type { NoteDetail } from '@/hooks/useNoteDetail';

interface NoteActionsProps {
  note: NoteDetail;
  noteId: `0x${string}`;
}

const BORDER_COLORS: Record<NoteState, string> = {
  [NoteState.Created]: 'border-l-gray-400',
  [NoteState.Priced]: 'border-l-cyan-400',
  [NoteState.Active]: 'border-l-gain',
  [NoteState.ObservationPending]: 'border-l-yellow-400',
  [NoteState.Autocalled]: 'border-l-gain',
  [NoteState.MaturityCheck]: 'border-l-blue-400',
  [NoteState.KISettle]: 'border-l-loss',
  [NoteState.NoKISettle]: 'border-l-gain',
  [NoteState.Settled]: 'border-l-gray-500',
  [NoteState.Rolled]: 'border-l-purple-400',
  [NoteState.Cancelled]: 'border-l-loss',
  [NoteState.EmergencyPaused]: 'border-l-orange-400',
};

function KISettleActions({ noteId }: { noteId: `0x${string}` }) {
  const [choice, setChoice] = useState<'cash' | 'physical' | null>(null);

  const { writeContract, data: txHash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  function settle(preferPhysical: boolean) {
    setChoice(preferPhysical ? 'physical' : 'cash');
    writeContract({
      address: CONTRACTS.AutocallEngine.address,
      abi: CONTRACTS.AutocallEngine.abi,
      functionName: 'settleKi',
      args: [noteId, preferPhysical],
    });
  }

  const isLoading = isPending || isConfirming;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        The knock-in barrier has been breached. Choose your settlement method within the deadline.
      </p>
      <div className="flex gap-4">
        <TransactionButton
          label="Cash Settlement"
          onClick={() => settle(false)}
          isLoading={isLoading && choice === 'cash'}
          disabled={isLoading || isSuccess}
        />
        <TransactionButton
          label="Physical Delivery"
          onClick={() => settle(true)}
          isLoading={isLoading && choice === 'physical'}
          disabled={isLoading || isSuccess}
          variant="secondary"
        />
      </div>
      {isSuccess && (
        <p className="text-sm text-gain">Settlement submitted successfully.</p>
      )}
      <p className="text-xs text-muted-foreground">
        After {PROTOCOL_CONSTANTS.KI_SETTLE_DEADLINE_DAYS} days, admin may force-settle as cash.
      </p>
    </div>
  );
}

export function NoteActions({ note, noteId }: NoteActionsProps) {
  const stateConfig = NOTE_STATE_CONFIG[note.state];
  const borderColor = BORDER_COLORS[note.state];

  return (
    <div className={`bg-white/5 backdrop-blur-md rounded-xl border border-white/10 border-l-4 ${borderColor} p-6`}>
      <h3 className="text-sm font-medium text-white mb-3 drop-shadow-lg">
        {stateConfig.label}
      </h3>

      {note.state === NoteState.Created && (
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-400" />
          </div>
          <p className="text-sm text-muted-foreground">Awaiting pricing from oracle...</p>
        </div>
      )}

      {note.state === NoteState.Priced && (
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400" />
          </div>
          <p className="text-sm text-muted-foreground">Note priced, awaiting activation.</p>
        </div>
      )}

      {note.state === NoteState.Active && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Next observation in:</p>
            <CountdownTimer targetTimestamp={Number(note.nextObservationTime)} />
          </div>
          <p className="text-xs text-muted-foreground">
            Current trigger: {formatBps(note.currentTriggerBps)} | Coupon barrier: {formatBps(PROTOCOL_CONSTANTS.COUPON_BARRIER_BPS)}
          </p>
        </div>
      )}

      {note.state === NoteState.ObservationPending && (
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400" />
          </div>
          <p className="text-sm text-muted-foreground">Observation window open. Keeper will trigger shortly.</p>
        </div>
      )}

      {note.state === NoteState.Autocalled && (
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-gain" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm text-white">
            Note autocalled at observation #{note.observations}. Principal + coupons returning.
          </p>
        </div>
      )}

      {note.state === NoteState.MaturityCheck && (
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-400" />
          </div>
          <p className="text-sm text-muted-foreground">Maturity reached. Checking KI barrier...</p>
        </div>
      )}

      {note.state === NoteState.KISettle && (
        <KISettleActions noteId={noteId} />
      )}

      {note.state === NoteState.NoKISettle && (
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-gain" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm text-white">No KI breach. Settling at par value.</p>
        </div>
      )}

      {note.state === NoteState.Settled && (
        <p className="text-sm text-muted-foreground">Note fully settled. Funds have been returned.</p>
      )}

      {note.state === NoteState.Rolled && (
        <p className="text-sm text-muted-foreground">Note rolled into a new product.</p>
      )}

      {note.state === NoteState.Cancelled && (
        <p className="text-sm text-muted-foreground">Note cancelled. Funds returned to depositor.</p>
      )}

      {note.state === NoteState.EmergencyPaused && (
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm text-orange-400">Emergency pause active. Protocol governance is reviewing.</p>
        </div>
      )}
    </div>
  );
}
