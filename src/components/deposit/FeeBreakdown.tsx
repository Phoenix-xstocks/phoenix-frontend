import { PROTOCOL_CONSTANTS } from '@/lib/constants';
import { formatUSDC, formatBps } from '@/lib/format';

interface FeeBreakdownProps {
  amount: bigint;
}

export function FeeBreakdown({ amount }: FeeBreakdownProps) {
  const embeddedFee = (amount * PROTOCOL_CONSTANTS.EMBEDDED_FEE_BPS) / 10_000n;
  const originationFee = (amount * PROTOCOL_CONSTANTS.ORIGINATION_FEE_BPS) / 10_000n;
  const totalFees = embeddedFee + originationFee;
  const netAmount = amount - totalFees;

  if (amount <= 0n) return null;

  return (
    <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
      <h3 className="text-sm font-medium text-muted">Fee Breakdown</h3>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">
            Embedded Fee ({formatBps(PROTOCOL_CONSTANTS.EMBEDDED_FEE_BPS)})
          </span>
          <span className="text-sm font-mono tabular-nums text-white">
            -{formatUSDC(embeddedFee)} USDC
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">
            Origination Fee ({formatBps(PROTOCOL_CONSTANTS.ORIGINATION_FEE_BPS)})
          </span>
          <span className="text-sm font-mono tabular-nums text-white">
            -{formatUSDC(originationFee)} USDC
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Total Fees</span>
          <span className="text-sm font-mono tabular-nums text-white">
            -{formatUSDC(totalFees)} USDC
          </span>
        </div>
      </div>

      <div className="border-t border-border pt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">Net Amount</span>
          <span className="text-base font-mono tabular-nums font-medium text-gain">
            {formatUSDC(netAmount)} USDC
          </span>
        </div>
      </div>
    </div>
  );
}
