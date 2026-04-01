export interface IndexerEvent {
  id: string;
  eventSignature: string;
  eventParams: string[];
  blockNumber: number;
  blockTimestamp: string;
  txHash: string;
}

export interface IndexerTransactionEvent {
  type: 'deposit' | 'coupon' | 'settlement' | 'autocall' | 'streamed' | 'missed' | 'cancelled';
  noteId: string;
  amount: string;
  blockNumber: number;
  blockTimestamp: string;
  txHash: string;
}

export interface IndexerUserNote {
  noteId: string;
  notional: string;
  createdAt: string;
  lastKnownState: string | null;
}
