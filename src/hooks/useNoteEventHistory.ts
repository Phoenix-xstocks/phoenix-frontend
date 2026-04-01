'use client';

import { useQuery } from '@tanstack/react-query';
import type { IndexerEvent } from '@/lib/indexer-types';

export function useNoteEventHistory(noteId: `0x${string}` | undefined) {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['note-events', noteId],
    queryFn: async (): Promise<IndexerEvent[]> => {
      const res = await fetch(`/api/indexer/note-events?noteId=${noteId}`);
      if (!res.ok) throw new Error('Failed to fetch note events');
      return res.json();
    },
    enabled: !!noteId,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  return { events, isLoading };
}
