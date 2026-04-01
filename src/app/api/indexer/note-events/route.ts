import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { parseEventParams } from '@/lib/parse-event-params';
import type { IndexerEvent } from '@/lib/indexer-types';

export async function GET(request: NextRequest) {
  const noteId = request.nextUrl.searchParams.get('noteId');

  if (!noteId) {
    return NextResponse.json({ error: 'noteId is required' }, { status: 400 });
  }

  try {
    const rows = await sql`
      SELECT id, event_signature, event_params, block_number, block_timestamp, transaction_hash
      FROM indexer.engine_events
      WHERE event_params[1] = ${noteId}
      ORDER BY block_number ASC, log_index ASC
    `;

    const events: IndexerEvent[] = rows.map((row) => {
      const sig = row.event_signature as string;
      const rawParams = row.event_params as string[];

      return {
        id: row.id as string,
        eventSignature: sig,
        eventParams: Object.entries(parseEventParams(sig, rawParams)).map(
          ([k, v]) => `${k}=${v}`,
        ),
        blockNumber: Number(row.block_number),
        blockTimestamp: row.block_timestamp as string,
        txHash: row.transaction_hash as string,
      };
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Indexer note-events query failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
