const ENGINE_PARAM_SCHEMAS: Record<string, string[]> = {
  NoteCreated: ['noteId', 'holder', 'notional'],
  NoteStateChanged: ['noteId', 'fromState', 'toState'],
  CouponPaid: ['noteId', 'amount', 'memoryPaid'],
  CouponMissed: ['noteId', 'memoryAccumulated'],
  CouponStreamed: ['noteId', 'streamId', 'amount'],
  NoteAutocalled: ['noteId', 'observation'],
  NoteSettled: ['noteId', 'payout', 'kiPhysical'],
  RequestPricing: ['noteId', 'basket', 'notional'],
  EmergencyPaused: ['noteId'],
  EmergencyResumed: ['noteId'],
  NoteCancelled: ['noteId'],
};

const VAULT_PARAM_SCHEMAS: Record<string, string[]> = {
  DepositRequested: ['requestId', 'depositor', 'amount'],
  DepositReadyToClaim: ['requestId', 'noteId'],
  DepositClaimed: ['requestId', 'noteId', 'tokenId'],
  DepositRefunded: ['requestId', 'depositor', 'amount'],
};

const STREAMER_PARAM_SCHEMAS: Record<string, string[]> = {
  CouponStreamStarted: ['noteId', 'holder', 'streamId', 'amount'],
  CouponStreamCancelled: ['noteId', 'streamId', 'refundedAmount'],
  CouponWithdrawn: ['streamId', 'recipient', 'amount'],
};

const NOTETOKEN_PARAM_SCHEMAS: Record<string, string[]> = {
  NoteMinted: ['noteId', 'holder', 'amount'],
  NoteBurned: ['noteId', 'holder', 'amount'],
};

const ALL_SCHEMAS: Record<string, string[]> = {
  ...ENGINE_PARAM_SCHEMAS,
  ...VAULT_PARAM_SCHEMAS,
  ...STREAMER_PARAM_SCHEMAS,
  ...NOTETOKEN_PARAM_SCHEMAS,
};

export function parseEventParams(
  eventSignature: string,
  eventParams: string[],
): Record<string, string> {
  const schema = ALL_SCHEMAS[eventSignature];
  if (!schema) return {};
  const result: Record<string, string> = {};
  for (let i = 0; i < schema.length; i++) {
    if (i < eventParams.length) {
      result[schema[i]] = eventParams[i];
    }
  }
  return result;
}
