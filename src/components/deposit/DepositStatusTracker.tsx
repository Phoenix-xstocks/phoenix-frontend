'use client';

import { BASKET_ASSETS, PROTOCOL_CONSTANTS } from '@/lib/constants';
import { formatUSDC } from '@/lib/format';
import { TokenIcon } from '@/components/ui/TokenIcon';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { TransactionButton } from '@/components/ui/TransactionButton';

interface DepositStatusTrackerProps {
  requestId: bigint;
  amount: bigint;
  basket: string[];
  requestedAt: number;
  status: 'pending' | 'ready' | 'expired';
  onClaim: () => void;
  onRefund: () => void;
}

const xStocksByAddress = Object.fromEntries(
  Object.values(BASKET_ASSETS).map((t) => [t.address.toLowerCase(), t])
);

export function DepositStatusTracker({
  requestId,
  amount,
  basket,
  requestedAt,
  status,
  onClaim,
  onRefund,
}: DepositStatusTrackerProps) {
  const claimDeadline = requestedAt + PROTOCOL_CONSTANTS.CLAIM_DEADLINE_HOURS * 3600;

  return (
    <div className="rounded-xl border border-border bg-surface p-6 space-y-5">
      {/* Header */}
      {status === 'pending' && (
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
          </div>
          <div>
            <h3 className="text-base font-medium text-white">Pricing in progress...</h3>
            <p className="text-sm text-muted">
              Chainlink oracles are pricing your basket. This typically takes a few minutes.
            </p>
          </div>
        </div>
      )}

      {status === 'ready' && (
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-gain" />
          <div>
            <h3 className="text-base font-medium text-gain">Ready to claim</h3>
            <p className="text-sm text-muted">
              Your deposit has been priced. Claim your NoteToken before the deadline.
            </p>
          </div>
        </div>
      )}

      {status === 'expired' && (
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-loss" />
          <div>
            <h3 className="text-base font-medium text-loss">Deposit expired</h3>
            <p className="text-sm text-muted">
              The claim deadline has passed. You can refund your USDC.
            </p>
          </div>
        </div>
      )}

      {/* Request details */}
      <div className="space-y-3 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Request ID</span>
          <span className="text-sm font-mono text-white">#{requestId.toString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Amount</span>
          <span className="text-sm font-mono tabular-nums text-white">
            {formatUSDC(amount)} USDC
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Basket</span>
          <div className="flex items-center gap-1.5">
            {basket.map((addr) => {
              const token = xStocksByAddress[addr.toLowerCase()];
              return token ? (
                <TokenIcon key={addr} symbol={token.symbol} size="sm" />
              ) : null;
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Requested</span>
          <span className="text-sm font-mono text-white">
            {new Date(requestedAt * 1000).toLocaleString()}
          </span>
        </div>

        {status !== 'expired' && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Claim Deadline</span>
            <CountdownTimer targetTimestamp={claimDeadline} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-border">
        {status === 'ready' && (
          <TransactionButton label="Claim NoteToken" onClick={onClaim} variant="primary" />
        )}
        {status === 'expired' && (
          <TransactionButton label="Refund USDC" onClick={onRefund} variant="secondary" />
        )}
      </div>
    </div>
  );
}
