'use client';

import { PROTOCOL_CONSTANTS } from '@/lib/constants';
import { formatUSDC } from '@/lib/format';
import { TokenIcon } from '@/components/ui/TokenIcon';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  balance: bigint | undefined;
}

export function AmountInput({ value, onChange, balance }: AmountInputProps) {
  const numericValue = parseFloat(value) || 0;
  const minUSDC = Number(PROTOCOL_CONSTANTS.MIN_NOTE_SIZE) / 1e6;
  const maxUSDC = Number(PROTOCOL_CONSTANTS.MAX_NOTE_SIZE) / 1e6;

  const isBelow = value !== '' && numericValue > 0 && numericValue < minUSDC;
  const isAbove = numericValue > maxUSDC;
  const hasError = isBelow || isAbove;

  const handleMax = () => {
    if (balance === undefined) return;
    const capped = balance > PROTOCOL_CONSTANTS.MAX_NOTE_SIZE
      ? PROTOCOL_CONSTANTS.MAX_NOTE_SIZE
      : balance;
    const usdcValue = Number(capped) / 1e6;
    onChange(usdcValue.toString());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '' || /^\d*\.?\d{0,6}$/.test(raw)) {
      onChange(raw);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-muted">Deposit Amount</label>
        {balance !== undefined && (
          <span className="text-xs text-muted">
            Balance: <span className="font-mono text-white">{formatUSDC(balance)}</span> USDC
          </span>
        )}
      </div>

      <div className="relative flex items-center rounded-xl border border-border bg-surface-2 focus-within:border-accent transition-colors">
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={value}
          onChange={handleChange}
          className="flex-1 bg-transparent px-4 py-4 text-2xl font-mono tabular-nums text-white placeholder:text-muted/40 outline-none"
        />
        <div className="flex items-center gap-2 pr-4">
          {balance !== undefined && (
            <button
              onClick={handleMax}
              className="px-2 py-1 text-xs font-medium text-accent bg-accent/10 rounded hover:bg-accent/20 transition-colors"
            >
              MAX
            </button>
          )}
          <div className="flex items-center gap-1.5 pl-2 border-l border-border">
            <TokenIcon symbol="USDC" size="sm" />
            <span className="text-sm font-medium text-white">USDC</span>
          </div>
        </div>
      </div>

      {hasError && (
        <p className="text-xs text-loss">
          {isBelow
            ? `Minimum deposit is ${minUSDC.toLocaleString()} USDC`
            : `Maximum deposit is ${maxUSDC.toLocaleString()} USDC`}
        </p>
      )}
    </div>
  );
}
