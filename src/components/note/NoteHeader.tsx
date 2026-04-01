'use client';

import { Badge } from '@/components/ui/Badge';
import { TokenIcon } from '@/components/ui/TokenIcon';
import { MonoNumber } from '@/components/ui/MonoNumber';
import { formatUSDC, shortenAddress } from '@/lib/format';
import { NOTE_STATE_CONFIG, NoteState } from '@/lib/noteStates';
import { XSTOCKS } from '@/lib/constants';
import type { NoteDetail } from '@/hooks/useNoteDetail';

const ADDRESS_TO_SYMBOL: Record<string, string> = Object.fromEntries(
  Object.values(XSTOCKS).map((s) => [s.address.toLowerCase(), s.symbol])
);

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface NoteHeaderProps {
  note: NoteDetail;
  noteId: string;
}

export function NoteHeader({ note, noteId }: NoteHeaderProps) {
  const stateConfig = NOTE_STATE_CONFIG[note.state];

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {note.basket.map((addr) => {
            const symbol = ADDRESS_TO_SYMBOL[addr.toLowerCase()] ?? '??';
            return <TokenIcon key={addr} symbol={symbol} size="md" />;
          })}
          <span className="text-sm text-muted-foreground font-mono">
            {note.basket.map((addr) => ADDRESS_TO_SYMBOL[addr.toLowerCase()] ?? '??').join(' / ')}
          </span>
        </div>
        <Badge
          label={stateConfig.label}
          color={stateConfig.color}
          bgColor={stateConfig.bgColor}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Notional</p>
          <MonoNumber value={formatUSDC(note.notional)} prefix="$" size="md" className="text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Holder</p>
          <p className="text-sm font-mono text-white">{shortenAddress(note.holder, 6)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Created</p>
          <p className="text-sm text-white">{formatDate(note.createdAt)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Maturity</p>
          <p className="text-sm text-white">{formatDate(note.maturityDate)}</p>
        </div>
      </div>
    </div>
  );
}
