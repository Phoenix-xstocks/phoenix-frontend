'use client';

import { XSTOCKS, FLAGSHIP_BASKET } from '@/lib/constants';
import { TokenIcon } from '@/components/ui/TokenIcon';

interface BasketSelectorProps {
  selected: string[];
  onChange: (basket: string[]) => void;
}

const xStockList = Object.values(XSTOCKS);

export function BasketSelector({ selected, onChange }: BasketSelectorProps) {
  const toggleToken = (address: string) => {
    if (selected.includes(address)) {
      onChange(selected.filter((a) => a !== address));
    } else {
      onChange([...selected, address]);
    }
  };

  const selectFlagship = () => {
    onChange([...FLAGSHIP_BASKET]);
  };

  const isFlagshipSelected =
    FLAGSHIP_BASKET.length === selected.length &&
    FLAGSHIP_BASKET.every((addr) => selected.includes(addr));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted">Select Basket Tokens</h3>
        <button
          onClick={selectFlagship}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
            isFlagshipSelected
              ? 'bg-accent/10 border-accent text-accent'
              : 'bg-surface-2 border-border text-muted hover:text-white hover:border-white/20'
          }`}
        >
          Flagship Basket
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {xStockList.map((token) => {
          const isSelected = selected.includes(token.address);
          return (
            <button
              key={token.address}
              onClick={() => toggleToken(token.address)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-accent/5 border-accent shadow-[0_0_0_1px] shadow-accent/20'
                  : 'bg-surface border-border hover:border-white/20'
              }`}
            >
              <TokenIcon symbol={token.symbol} size="md" />
              <div className="text-left">
                <div className="text-sm font-medium text-white">{token.symbol}</div>
                <div className="text-xs text-muted">{token.name}</div>
              </div>
            </button>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-xs text-loss">Select at least one token for the basket.</p>
      )}
    </div>
  );
}
