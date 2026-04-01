import { TARGET_APY_BPS } from '@/lib/constants';
import { formatUSDC } from '@/lib/format';
import { MonoNumber } from '@/components/ui/MonoNumber';

interface EstimatedCouponProps {
  netAmount: bigint;
}

export function EstimatedCoupon({ netAmount }: EstimatedCouponProps) {
  if (netAmount <= 0n) return null;

  const annualYield = (netAmount * BigInt(TARGET_APY_BPS)) / 10_000n;
  const monthlyYield = annualYield / 12n;
  const apyPercent = (TARGET_APY_BPS / 100).toFixed(1);

  return (
    <div className="rounded-xl border border-border bg-surface p-4 space-y-4">
      <h3 className="text-sm font-medium text-muted">Estimated Coupon Projection</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-xs text-muted">APY</div>
          <MonoNumber value={`${apyPercent}%`} size="lg" className="text-accent" />
        </div>

        <div className="space-y-1">
          <div className="text-xs text-muted">Estimated Annual Yield</div>
          <MonoNumber value={formatUSDC(annualYield)} prefix="$" size="lg" className="text-gain" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-sm text-muted">Monthly Equivalent</span>
        <MonoNumber value={formatUSDC(monthlyYield)} prefix="~$" suffix="/ mo" size="sm" className="text-white" />
      </div>

      <p className="text-xs text-muted/70 leading-relaxed">
        Estimates based on current market conditions. Actual returns depend on observation outcomes.
      </p>
    </div>
  );
}
