import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { parseEventParams } from '@/lib/parse-event-params';
import type { IndexerTransactionEvent } from '@/lib/indexer-types';

const EVENT_TYPE_MAP: Record<string, IndexerTransactionEvent['type']> = {
  NoteCreated: 'deposit',
  CouponPaid: 'coupon',
  NoteSettled: 'settlement',
  NoteAutocalled: 'autocall',
  CouponStreamed: 'streamed',
  CouponMissed: 'missed',
  NoteCancelled: 'cancelled',
};

const AMOUNT_FIELD_MAP: Record<string, string> = {
  NoteCreated: 'notional',
  CouponPaid: 'amount',
  NoteSettled: 'payout',
  CouponStreamed: 'amount',
  CouponMissed: 'memoryAccumulated',
  NoteAutocalled: 'observation',
  NoteCancelled: '',
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const address = searchParams.get('address');
  const noteIdsParam = searchParams.get('noteIds');
  const limit = Math.min(Number(searchParams.get('limit') || '20'), 100);

  if (!address) {
    return NextResponse.json({ error: 'address is required' }, { status: 400 });
  }

  const noteIds = noteIdsParam ? noteIdsParam.split(',').filter(Boolean) : [];

  try {
    let rows;

    if (noteIds.length > 0) {
      rows = await sql`
        SELECT id, event_signature, event_params, block_number, block_timestamp, transaction_hash
        FROM indexer.engine_events
        WHERE (
          (event_signature = 'NoteCreated' AND lower(event_params[2]) = lower(${address}))
          OR (event_signature IN ('CouponPaid', 'NoteSettled', 'NoteAutocalled', 'CouponMissed', 'CouponStreamed', 'NoteCancelled')
              AND event_params[1] = ANY(${noteIds}))
        )
        ORDER BY block_number DESC, log_index DESC
        LIMIT ${limit}
      `;
    } else {
      rows = await sql`
        SELECT id, event_signature, event_params, block_number, block_timestamp, transaction_hash
        FROM indexer.engine_events
        WHERE event_signature = 'NoteCreated'
          AND lower(event_params[2]) = lower(${address})
        ORDER BY block_number DESC, log_index DESC
        LIMIT ${limit}
      `;
    }

    const events: IndexerTransactionEvent[] = rows.map((row) => {
      const sig = row.event_signature as string;
      const params = parseEventParams(sig, row.event_params as string[]);
      const amountField = AMOUNT_FIELD_MAP[sig] || '';

      return {
        type: EVENT_TYPE_MAP[sig] || 'deposit',
        noteId: params.noteId || '',
        amount: amountField ? (params[amountField] || '0') : '0',
        blockNumber: Number(row.block_number),
        blockTimestamp: row.block_timestamp as string,
        txHash: row.transaction_hash as string,
      };
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Indexer transactions query failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
