'use client';

import Link from 'next/link';
import { Skeleton } from '@/components/ui/Skeleton';
import { BasketIcons } from '@/components/ui/BasketIcons';
import { StreamingAmount } from '@/components/ui/StreamingAmount';
import { formatUSDC, formatBps } from '@/lib/format';
import { NOTE_STATE_CONFIG } from '@/lib/noteStates';
import type { UserNote } from '@/hooks/useUserNotes';

interface NotesListProps {
  notes: UserNote[];
  isLoading: boolean;
}

function shortenNoteId(noteId: string): string {
  return `${noteId.slice(0, 10)}...${noteId.slice(-6)}`;
}

function formatDate(timestamp: bigint): string {
  if (timestamp === 0n) return '--';
  return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function NotesList({ notes, isLoading }: NotesListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-24" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">My Notes</p>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-white/30 mb-6">No notes yet</p>
          <Link
            href="/app/deposit"
            className="inline-block px-8 py-3 rounded-full border border-white/20 text-sm font-medium text-white hover:bg-white/5 transition-colors"
          >
            Create your first note
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => {
            const stateConfig = NOTE_STATE_CONFIG[note.state];
            return (
              <Link
                key={note.noteId}
                href={`/app/note/${note.noteId}`}
                className="flex items-center gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 group"
              >
                <BasketIcons addresses={note.basket} size="sm" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-mono text-xs text-white/30">
                      {shortenNoteId(note.noteId)}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full ${stateConfig.bgColor} ${stateConfig.color}`}
                    >
                      {stateConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-white/25">
                    <span>Obs {note.observations}/6</span>
                    <span className="w-px h-2.5 bg-white/10" />
                    <span>Maturity {formatDate(note.maturityDate)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-light tabular-nums text-white">
                    ${formatUSDC(note.notional)}
                  </p>
                  {note.streams.length > 0 ? (
                    <StreamingAmount streams={note.streams} />
                  ) : note.totalCouponBps > 0n ? (
                    <p className="text-xs font-mono tabular-nums text-[#40a040]/60 mt-0.5">
                      +{formatBps(note.totalCouponBps)} coupon
                    </p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
