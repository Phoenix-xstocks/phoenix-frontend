'use client';

import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { formatBps } from '@/lib/format';
import { NoteState } from '@/lib/noteStates';
import { PROTOCOL_CONSTANTS } from '@/lib/constants';
import type { NoteDetail } from '@/hooks/useNoteDetail';

interface ObservationTimelineProps {
  note: NoteDetail;
}

function getTriggerForObs(index: number): number {
  return PROTOCOL_CONSTANTS.AUTOCALL_TRIGGER_BPS - index * PROTOCOL_CONSTANTS.STEP_DOWN_BPS;
}

export function ObservationTimeline({ note }: ObservationTimelineProps) {
  const isActive = note.state === NoteState.Active || note.state === NoteState.ObservationPending;
  const isTerminal = [
    NoteState.Settled,
    NoteState.Rolled,
    NoteState.Cancelled,
  ].includes(note.state);

  const observations = Array.from({ length: PROTOCOL_CONSTANTS.MAX_OBSERVATIONS }, (_, i) => i);

  return (
    <div className={`bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 ${isTerminal ? 'opacity-60' : ''}`}>
      <h3 className="text-sm font-medium text-white mb-4 drop-shadow-lg">Observation Timeline</h3>

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
                    <p className="text-xs text-gain">Completed</p>
                  )}
                  {isCurrent && (
                    <div className="text-xs">
                      <CountdownTimer
                        targetTimestamp={Number(note.nextObservationTime)}
                      />
                    </div>
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
