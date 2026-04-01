'use client';

import { formatBps } from '@/lib/format';
import { PROTOCOL_CONSTANTS } from '@/lib/constants';
import type { NoteDetail } from '@/hooks/useNoteDetail';

interface BarrierChartProps {
  note: NoteDetail;
}

const PADDING = { top: 24, right: 16, bottom: 36, left: 48 };
const Y_MIN = 0;
const Y_MAX = 120;

function yToSvg(bps: number, height: number): number {
  const pct = bps / 100;
  return PADDING.top + (1 - (pct - Y_MIN) / (Y_MAX - Y_MIN)) * height;
}

function xToSvg(obsIndex: number, total: number, width: number): number {
  return PADDING.left + ((obsIndex + 0.5) / total) * width;
}

export function BarrierChart({ note }: BarrierChartProps) {
  const autocallTrigger = Number(note.currentTriggerBps);
  const couponBarrier = PROTOCOL_CONSTANTS.COUPON_BARRIER_BPS;
  const kiBarrier = PROTOCOL_CONSTANTS.KI_BARRIER_BPS;
  const maxObs = PROTOCOL_CONSTANTS.MAX_OBSERVATIONS;

  const triggerLevels = Array.from({ length: maxObs }, (_, i) => ({
    obs: i + 1,
    bps: PROTOCOL_CONSTANTS.AUTOCALL_TRIGGER_BPS - i * PROTOCOL_CONSTANTS.STEP_DOWN_BPS,
  }));

  const svgWidth = 600;
  const svgHeight = 280;
  const chartW = svgWidth - PADDING.left - PADDING.right;
  const chartH = svgHeight - PADDING.top - PADDING.bottom;

  const yTicks = [0, 25, 50, 75, 100];

  // Build the step-down path
  const stepPoints = triggerLevels.map((l, i) => ({
    x: xToSvg(i, maxObs, chartW),
    y: yToSvg(l.bps, chartH),
  }));
  const stepPath = stepPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
      <h3 className="text-sm font-medium text-white mb-2">Barrier Levels</h3>

      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {/* Y-axis grid lines + labels */}
        {yTicks.map((pct) => {
          const y = yToSvg(pct * 100, chartH);
          return (
            <g key={pct}>
              <line
                x1={PADDING.left}
                x2={svgWidth - PADDING.right}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
              <text
                x={PADDING.left - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-white/30"
                fontSize={11}
                fontFamily="monospace"
              >
                {pct}%
              </text>
            </g>
          );
        })}

        {/* Coupon barrier zone (subtle fill below coupon line) */}
        <rect
          x={PADDING.left}
          y={yToSvg(couponBarrier, chartH)}
          width={chartW}
          height={yToSvg(0, chartH) - yToSvg(couponBarrier, chartH)}
          fill="rgba(239,68,68,0.04)"
        />

        {/* Coupon barrier line */}
        <line
          x1={PADDING.left}
          x2={svgWidth - PADDING.right}
          y1={yToSvg(couponBarrier, chartH)}
          y2={yToSvg(couponBarrier, chartH)}
          stroke="#ef4444"
          strokeWidth={1}
          strokeDasharray="6 4"
          opacity={0.6}
        />
        <text
          x={svgWidth - PADDING.right}
          y={yToSvg(couponBarrier, chartH) - 6}
          textAnchor="end"
          className="fill-[#ef4444]"
          fontSize={10}
          fontFamily="monospace"
          opacity={0.8}
        >
          Coupon Barrier {formatBps(couponBarrier)}
        </text>

        {/* KI barrier line (only show if different from coupon) */}
        {kiBarrier !== couponBarrier && (
          <>
            <line
              x1={PADDING.left}
              x2={svgWidth - PADDING.right}
              y1={yToSvg(kiBarrier, chartH)}
              y2={yToSvg(kiBarrier, chartH)}
              stroke="#ef4444"
              strokeWidth={1}
              strokeDasharray="2 3"
              opacity={0.4}
            />
            <text
              x={svgWidth - PADDING.right}
              y={yToSvg(kiBarrier, chartH) - 6}
              textAnchor="end"
              className="fill-[#ef4444]"
              fontSize={10}
              fontFamily="monospace"
              opacity={0.6}
            >
              KI {formatBps(kiBarrier)}
            </text>
          </>
        )}

        {/* Autocall step-down line */}
        <path
          d={stepPath}
          fill="none"
          stroke="#206040"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          opacity={0.7}
        />

        {/* Autocall label */}
        <text
          x={svgWidth - PADDING.right}
          y={yToSvg(autocallTrigger, chartH) - 6}
          textAnchor="end"
          className="fill-[#40a040]"
          fontSize={10}
          fontFamily="monospace"
          opacity={0.8}
        >
          Autocall {formatBps(autocallTrigger)}
        </text>

        {/* Observation dots + labels */}
        {triggerLevels.map((level) => {
          const isPast = level.obs <= note.observations;
          const isCurrent = level.bps === autocallTrigger;
          const cx = xToSvg(level.obs - 1, maxObs, chartW);
          const cy = yToSvg(level.bps, chartH);

          return (
            <g key={level.obs}>
              {/* Vertical column guide */}
              <line
                x1={cx}
                x2={cx}
                y1={PADDING.top}
                y2={svgHeight - PADDING.bottom}
                stroke="rgba(255,255,255,0.03)"
                strokeWidth={1}
              />

              {/* Dot */}
              {isCurrent && (
                <circle cx={cx} cy={cy} r={8} fill="#206040" opacity={0.2} />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={isPast ? 4.5 : isCurrent ? 5 : 3.5}
                fill={isPast ? '#40a040' : isCurrent ? '#206040' : 'rgba(255,255,255,0.15)'}
                stroke={isPast ? '#40a040' : isCurrent ? '#40a040' : 'none'}
                strokeWidth={isCurrent ? 1.5 : 0}
              />

              {/* Obs label at bottom */}
              <text
                x={cx}
                y={svgHeight - PADDING.bottom + 16}
                textAnchor="middle"
                fontSize={10}
                fontFamily="monospace"
                className={isPast ? 'fill-[#40a040]' : isCurrent ? 'fill-white/60' : 'fill-white/25'}
              >
                Obs {level.obs}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
