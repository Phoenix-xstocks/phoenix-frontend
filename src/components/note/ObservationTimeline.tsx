'use client';

import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { formatBps } from '@/lib/format';
import { NoteState, NOTE_STATE_CONFIG } from '@/lib/noteStates';
import { PROTOCOL_CONSTANTS } from '@/lib/constants';
import type { NoteDetail } from '@/hooks/useNoteDetail';

interface ObservationTimelineProps {
  note: NoteDetail;
}

function getTriggerForObs(index: number): number {
  return PROTOCOL_CONSTANTS.AUTOCALL_TRIGGER_BPS - index * PROTOCOL_CONSTANTS.STEP_DOWN_BPS;
}

const BORDER_COLORS: Record<number, string> = {
  [NoteState.Active]: 'border-l-gain',
  [NoteState.ObservationPending]: 'border-l-yellow-400',
  [NoteState.Autocalled]: 'border-l-gain',
  [NoteState.MaturityCheck]: 'border-l-blue-400',
  [NoteState.Settled]: 'border-l-gray-500',
};

export function ObservationTimeline({ note }: ObservationTimelineProps) {
  const isActive = note.state === NoteState.Active || note.state === NoteState.ObservationPending;
  const isTerminal = [
    NoteState.Settled,
    NoteState.Rolled,
    NoteState.Cancelled,
  ].includes(note.state);

  const stateConfig = NOTE_STATE_CONFIG[note.state];
  const borderColor = BORDER_COLORS[note.state] ?? 'border-l-white/20';
  const observations = Array.from({ length: PROTOCOL_CONSTANTS.MAX_OBSERVATIONS }, (_, i) => i);

  return (
    <div className={`bg-white/5 backdrop-blur-md rounded-xl border border-white/10 border-l-4 ${borderColor} p-6 ${isTerminal ? 'opacity-60' : ''}`}>
      {/* Status header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-white drop-shadow-lg">{stateConfig.label}</h3>
          {(note.state === NoteState.Active || note.state === NoteState.ObservationPending) && (
            <span className="text-xs text-muted-foreground">
              Trigger {formatBps(note.currentTriggerBps)} | Barrier {formatBps(PROTOCOL_CONSTANTS.COUPON_BARRIER_BPS)}
            </span>
          )}
        </div>
        {note.state === NoteState.Active && note.nextObservationTime > 0n && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-xs text-muted-foreground">Next obs</span>
            <CountdownTimer targetTimestamp={Number(note.nextObservationTime)} />
          </div>
        )}
        {note.state === NoteState.ObservationPending && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
            </span>
            <span className="text-xs text-yellow-400">Pending</span>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-0">
        {observations.map((i) => {
          const isCompleted = i < note.observations;
          const isCurrent = i === note.observations && isActive;
          const isFuture = !isCompleted && !isCurrent;
          const trigger = getTriggerForObs(i);

          return (
            <div key={i} className="flex items-center flex-1 w-full md:w-auto">
              <div className="flex flex-col items-center min-w-[48px]">
                {/* Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-gain text-white'
                      : isCurrent
                        ? 'bg-white/10 text-white ring-2 ring-gain/50 animate-pulse'
                        : 'bg-white/5 border border-white/10 text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>

                {/* Label below */}
                <div className="mt-2 text-center">
                  {isCompleted && (
                    <p className="text-xs text-gain">Passed</p>
                  )}
                  {isCurrent && (
                    <p className="text-xs text-white/60">{formatBps(trigger)}</p>
                  )}
                  {isFuture && (
                    <p className="text-xs text-muted-foreground">
                      {formatBps(trigger)}
                    </p>
                  )}
                </div>
              </div>

              {/* Connecting line (not after last) */}
              {i < PROTOCOL_CONSTANTS.MAX_OBSERVATIONS - 1 && (
                <div
                  className={`hidden md:block h-0.5 flex-1 mx-1 ${
                    isCompleted ? 'bg-gain/40' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
