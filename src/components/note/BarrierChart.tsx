'use client';

import { formatBps } from '@/lib/format';
import { PROTOCOL_CONSTANTS } from '@/lib/constants';
import type { NoteDetail } from '@/hooks/useNoteDetail';

interface BarrierChartProps {
  note: NoteDetail;
}

const SCALE_MAX = 120;

function pctPosition(bps: number): number {
  return (bps / 100 / SCALE_MAX) * 100;
}

export function BarrierChart({ note }: BarrierChartProps) {
  const autocallTrigger = Number(note.currentTriggerBps);
  const couponBarrier = PROTOCOL_CONSTANTS.COUPON_BARRIER_BPS;
  const kiBarrier = PROTOCOL_CONSTANTS.KI_BARRIER_BPS;

  const triggerLevels = Array.from({ length: PROTOCOL_CONSTANTS.MAX_OBSERVATIONS }, (_, i) => ({
    obs: i + 1,
    bps: PROTOCOL_CONSTANTS.AUTOCALL_TRIGGER_BPS - i * PROTOCOL_CONSTANTS.STEP_DOWN_BPS,
  }));

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
      <h3 className="text-sm font-medium text-white mb-4 drop-shadow-lg">Barrier Levels</h3>

      <div className="relative h-48">
        {/* Scale labels on the left */}
        {[0, 25, 50, 75, 100].map((pct) => (
          <div
            key={pct}
            className="absolute left-0 text-xs text-muted-foreground font-mono"
            style={{ bottom: `${(pct / SCALE_MAX) * 100}%`, transform: 'translateY(50%)' }}
          >
            {pct}%
          </div>
        ))}

        {/* Chart area */}
        <div className="absolute left-10 right-0 top-0 bottom-0">
          {/* Grid lines */}
          {[25, 50, 75, 100].map((pct) => (
            <div
              key={pct}
              className="absolute left-0 right-0 border-t border-white/5"
              style={{ bottom: `${(pct / SCALE_MAX) * 100}%` }}
            />
          ))}

          {/* Autocall trigger line */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-accent"
            style={{ bottom: `${pctPosition(autocallTrigger)}%` }}
          >
            <span className="absolute right-0 -top-5 text-xs text-accent font-mono">
              Autocall {formatBps(autocallTrigger)}
            </span>
          </div>

          {/* Coupon barrier line */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-gain"
            style={{ bottom: `${pctPosition(couponBarrier)}%` }}
          >
            <span className="absolute right-0 -top-5 text-xs text-gain font-mono">
              Coupon {formatBps(couponBarrier)}
            </span>
          </div>

          {/* KI barrier line */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-loss"
            style={{ bottom: `${pctPosition(kiBarrier)}%` }}
          >
            <span className="absolute right-0 -top-5 text-xs text-loss font-mono">
              KI {formatBps(kiBarrier)}
            </span>
          </div>

          {/* Trigger step-down markers */}
          <div className="absolute left-0 right-0 bottom-0 top-0 flex justify-around items-end">
            {triggerLevels.map((level) => {
              const isCurrent = level.bps === autocallTrigger;
              const isPast = level.obs <= note.observations;
              return (
                <div
                  key={level.obs}
                  className="flex flex-col items-center"
                  style={{ position: 'absolute', bottom: `${pctPosition(level.bps)}%`, left: `${((level.obs - 0.5) / PROTOCOL_CONSTANTS.MAX_OBSERVATIONS) * 100}%`, transform: 'translate(-50%, 50%)' }}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isPast
                        ? 'bg-gain'
                        : isCurrent
                          ? 'bg-accent ring-2 ring-accent/30'
                          : 'bg-white/20'
                    }`}
                  />
                  <span className={`text-[10px] mt-1 ${isPast ? 'text-gain' : isCurrent ? 'text-accent' : 'text-muted-foreground'}`}>
                    Obs {level.obs}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
