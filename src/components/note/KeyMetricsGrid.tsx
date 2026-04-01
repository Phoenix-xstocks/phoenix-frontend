'use client';

import { StatCard } from '@/components/ui/StatCard';
import { formatBps, formatUSDC } from '@/lib/format';
import { PROTOCOL_CONSTANTS } from '@/lib/constants';
import type { NoteDetail } from '@/hooks/useNoteDetail';

interface KeyMetricsGridProps {
  note: NoteDetail;
}

export function KeyMetricsGrid({ note }: KeyMetricsGridProps) {
  const hasMemoryCoupon = note.memoryCoupon > 0n;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Annual Coupon"
        value={formatBps(note.totalCouponBps)}
        subValue={`${formatBps(note.couponPerObsBps)} per obs`}
      />
      <StatCard
        label="Observations"
        value={`${note.observations} / ${PROTOCOL_CONSTANTS.MAX_OBSERVATIONS}`}
        subValue={`Every ${PROTOCOL_CONSTANTS.OBS_INTERVAL_DAYS} days`}
      />
      <StatCard
        label="Memory Coupon"
        value={formatUSDC(note.memoryCoupon)}
        prefix="$"
        subValue={hasMemoryCoupon ? 'Accumulated unpaid' : 'None'}
        className={hasMemoryCoupon ? 'border-l-4 border-l-loss' : ''}
      />
      <StatCard
        label="Current Trigger"
        value={formatBps(note.currentTriggerBps)}
        subValue={`Step-down: ${formatBps(PROTOCOL_CONSTANTS.STEP_DOWN_BPS)}`}
      />
    </div>
  );
}
