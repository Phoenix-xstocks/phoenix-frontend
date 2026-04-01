'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { inkSepolia } from '@/lib/chains';
import type { IndexerEvent } from '@/lib/indexer-types';

interface NoteEventTimelineProps {
  events: IndexerEvent[];
  isLoading: boolean;
}

const EVENT_STYLE: Record<string, { label: string; icon: string; color: string }> = {
  NoteCreated: { label: 'Created', icon: '+', color: 'text-cyan-400' },
  NoteStateChanged: { label: 'State Changed', icon: '~', color: 'text-white/70' },
  CouponPaid: { label: 'Coupon Paid', icon: '$', color: 'text-[#40a040]' },
  CouponMissed: { label: 'Coupon Missed', icon: 'x', color: 'text-red-400' },
  CouponStreamed: { label: 'Coupon Streamed', icon: '~', color: 'text-[#40a040]/70' },
  NoteAutocalled: { label: 'Autocalled', icon: '!', color: 'text-amber-400' },
  NoteSettled: { label: 'Settled', icon: '=', color: 'text-white' },
  RequestPricing: { label: 'Pricing Requested', icon: '?', color: 'text-white/50' },
  EmergencyPaused: { label: 'Emergency Pause', icon: '||', color: 'text-orange-400' },
  EmergencyResumed: { label: 'Resumed', icon: '>', color: 'text-[#40a040]' },
  NoteCancelled: { label: 'Cancelled', icon: '-', color: 'text-white/40' },
};

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatParam(param: string): string {
  const [key, value] = param.split('=');
  if (!value) return param;
  if (key === 'noteId') return '';
  if (value.startsWith('0x') && value.length > 16) {
    return `${key}: ${value.slice(0, 8)}...${value.slice(-6)}`;
  }
  return `${key}: ${value}`;
}

function shortenHash(hash: string): string {
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

export function NoteEventTimeline({ events, isLoading }: NoteEventTimelineProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <Skeleton className="h-4 w-40 mb-5" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) return null;

  const explorerUrl = inkSepolia.blockExplorers.default.url;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm text-white/40 mb-5 tracking-wide uppercase">Event History</p>

      <div className="relative">
        <div className="absolute left-[13px] top-3 bottom-3 w-px bg-white/10" />

        <div className="space-y-1">
          {events.map((evt) => {
            const style = EVENT_STYLE[evt.eventSignature] || {
              label: evt.eventSignature,
              icon: '.',
              color: 'text-white/40',
            };
            const params = evt.eventParams
              .map(formatParam)
              .filter(Boolean);

            return (
              <div
                key={evt.id}
                className="flex items-start gap-3 pl-1 py-2"
              >
                <span
                  className={`relative z-10 w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-white/5 border border-white/10 font-mono text-xs ${style.color}`}
                >
                  {style.icon}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${style.color}`}>
                      {style.label}
                    </span>
                    <span className="text-xs text-white/20">
                      {formatTimestamp(evt.blockTimestamp)}
                    </span>
                  </div>
                  {params.length > 0 && (
                    <p className="text-xs text-white/30 font-mono mt-0.5 truncate">
                      {params.join(' / ')}
                    </p>
                  )}
                </div>

                <a
                  href={`${explorerUrl}/tx/${evt.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-white/15 hover:text-white/40 transition-colors flex-shrink-0"
                >
                  {shortenHash(evt.txHash)}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
