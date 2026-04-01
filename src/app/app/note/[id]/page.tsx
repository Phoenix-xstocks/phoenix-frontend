'use client';

import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { Skeleton } from '@/components/ui/Skeleton';
import { NoteHeader } from '@/components/note/NoteHeader';
import { KeyMetricsGrid } from '@/components/note/KeyMetricsGrid';
import { ObservationTimeline } from '@/components/note/ObservationTimeline';
import { BarrierChart } from '@/components/note/BarrierChart';
import { NoteActions } from '@/components/note/NoteActions';
import { NoteEventTimeline } from '@/components/note/NoteEventTimeline';
import { useNoteDetail } from '@/hooks/useNoteDetail';
import { useNoteEventHistory } from '@/hooks/useNoteEventHistory';
import { NoteState } from '@/lib/noteStates';
import { shortenAddress } from '@/lib/format';

const VALID_NOTE_ID = /^0x[a-fA-F0-9]{64}$/;

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  const noteId = params.id as `0x${string}`;
  const isValidId = VALID_NOTE_ID.test(noteId);
  const { note, stateConfig, isLoading, isError } = useNoteDetail(isValidId ? noteId : undefined);
  const { events: noteEvents, isLoading: isLoadingEvents } = useNoteEventHistory(isValidId ? noteId : undefined);

  if (!isValidId) {
    return (
      <PageContainer title="Invalid Note" subtitle="The note ID format is invalid">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8 text-center">
            <p className="text-loss text-lg font-medium mb-2">Invalid Note ID</p>
            <p className="text-sm text-muted-foreground mb-4">
              Expected a 32-byte hex string (0x...)
            </p>
            <Link
              href="/app/dashboard"
              className="px-6 py-3 bg-white text-black hover:bg-white/90 rounded-lg font-medium transition-colors inline-block"
            >
              Back to Notes
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer title="Note" subtitle="Loading...">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </PageContainer>
    );
  }

  if (isError || !note) {
    return (
      <PageContainer title="Note Not Found" subtitle="This note does not exist">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8 text-center">
            <p className="text-loss text-lg font-medium mb-2">Note Not Found</p>
            <p className="text-sm text-muted-foreground mb-4">
              The note {shortenAddress(noteId, 8)} could not be found on-chain.
            </p>
            <Link
              href="/app/dashboard"
              className="px-6 py-3 bg-white text-black hover:bg-white/90 rounded-lg font-medium transition-colors inline-block"
            >
              Back to Notes
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  const isPreActive = note.state <= NoteState.Priced;
  const isEmergency = note.state === NoteState.EmergencyPaused;

  return (
    <PageContainer
      title={`Note #${shortenAddress(noteId, 6)}`}
      subtitle={stateConfig?.description}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {isEmergency && (
          <div className="bg-orange-400/10 border border-orange-400/30 rounded-lg p-4 text-sm text-orange-400">
            This note is under emergency pause. Protocol governance is reviewing the situation.
          </div>
        )}

        <NoteHeader note={note} noteId={noteId} />

        {!isPreActive && (
          <>
            <KeyMetricsGrid note={note} />
            <ObservationTimeline note={note} />
            <BarrierChart note={note} />
          </>
        )}

        <NoteEventTimeline events={noteEvents} isLoading={isLoadingEvents} />

        <NoteActions note={note} noteId={noteId} />
      </div>
    </PageContainer>
  );
}
