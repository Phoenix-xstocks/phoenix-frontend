'use client';

import { BASKET_ASSETS, FLAGSHIP_BASKET } from '@/lib/constants';
import { TokenIcon } from '@/components/ui/TokenIcon';

interface BasketSelectorProps {
  selected: string[];
  onChange: (basket: string[]) => void;
}

const assetList = Object.values(BASKET_ASSETS);

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
        <h3 className="text-sm font-medium text-muted-foreground">Select Basket Indices</h3>
        <button
          onClick={selectFlagship}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
            isFlagshipSelected
              ? 'bg-white/20 border-white/30 text-white'
              : 'bg-white/5 border-white/10 text-muted-foreground hover:text-white hover:bg-white/10'
          }`}
        >
          Flagship Basket
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {assetList.map((token) => {
          const isSelected = selected.includes(token.address);
          return (
            <button
              key={token.address}
              onClick={() => toggleToken(token.address)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-white/20 border-white/30'
                  : 'bg-white/5 border-white/10 backdrop-blur-md hover:border-white/20'
              }`}
            >
              <TokenIcon symbol={token.symbol} size="md" />
              <div className="text-left">
                <div className="text-sm font-medium text-white">{token.symbol}</div>
                <div className="text-xs text-muted-foreground">{token.name}</div>
              </div>
            </button>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-xs text-loss">Select at least one index for the basket.</p>
      )}
    </div>
  );
}
