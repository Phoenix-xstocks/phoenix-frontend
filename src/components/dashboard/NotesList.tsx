'use client';

import Link from 'next/link';
import { Skeleton } from '@/components/ui/Skeleton';
import { BasketIcons } from '@/components/ui/BasketIcons';
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
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <Skeleton className="h-4 w-24 mb-5" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm text-white/40 mb-5 tracking-wide uppercase">My Notes</p>

      {notes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white/30 mb-4">No notes yet</p>
          <Link
            href="/app/deposit"
            className="inline-block px-5 py-2.5 rounded-lg bg-[#206040] text-white text-sm hover:bg-[#206040]/80 transition-colors"
          >
            Create your first note
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const stateConfig = NOTE_STATE_CONFIG[note.state];
            return (
              <Link
                key={note.noteId}
                href={`/app/note/${note.noteId}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group"
              >
                <BasketIcons addresses={note.basket} size="sm" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-white/40">
                      {shortenNoteId(note.noteId)}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${stateConfig.bgColor} ${stateConfig.color}`}
                    >
                      {stateConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/30">
                    <span>
                      Obs {note.observations}/6
                    </span>
                    <span className="w-px h-3 bg-white/10" />
                    <span>Maturity {formatDate(note.maturityDate)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-mono tabular-nums text-white">
                    ${formatUSDC(note.notional)}
                  </p>
                  {note.totalCouponBps > 0n && (
                    <p className="text-xs font-mono tabular-nums text-[#40a040]/70">
                      +{formatBps(note.totalCouponBps)} coupon
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
