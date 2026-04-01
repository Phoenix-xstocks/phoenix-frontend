import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { IndexerUserNote } from '@/lib/indexer-types';

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'address is required' }, { status: 400 });
  }

  try {
    const rows = await sql`
      WITH user_notes AS (
        SELECT
          event_params[1] AS note_id,
          event_params[3] AS notional,
          block_timestamp AS created_at
        FROM indexer.engine_events
        WHERE event_signature = 'NoteCreated'
          AND lower(event_params[2]) = lower(${address})
      ),
      latest_state AS (
        SELECT DISTINCT ON (event_params[1])
          event_params[1] AS note_id,
          event_params[3] AS current_state
        FROM indexer.engine_events
        WHERE event_signature = 'NoteStateChanged'
          AND event_params[1] IN (SELECT note_id FROM user_notes)
        ORDER BY event_params[1], block_number DESC, log_index DESC
      )
      SELECT
        un.note_id,
        un.notional,
        un.created_at,
        ls.current_state AS last_known_state
      FROM user_notes un
      LEFT JOIN latest_state ls ON un.note_id = ls.note_id
      ORDER BY un.created_at DESC
    `;

    const notes: IndexerUserNote[] = rows.map((row) => ({
      noteId: row.note_id as string,
      notional: row.notional as string,
      createdAt: row.created_at as string,
      lastKnownState: (row.last_known_state as string) || null,
    }));

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Indexer user-notes query failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
