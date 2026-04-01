'use client';

import { BASKET_ASSETS, FLAGSHIP_BASKET } from '@/lib/constants';
import { TokenIcon } from '@/components/ui/TokenIcon';

interface BasketSelectorProps {
  selected: string[];
  onChange: (basket: string[]) => void;
}

interface BasketOption {
  id: string;
  name: string;
  description: string;
  assets: readonly string[];
  symbols: string[];
  comingSoon?: boolean;
}

const BASKETS: BasketOption[] = [
  {
    id: 'flagship',
    name: 'Flagship',
    description: 'Nasdaq 100 + S&P 500',
    assets: FLAGSHIP_BASKET,
    symbols: ['NASDAQx', 'SPXx'],
  },
  {
    id: 'dow-dax',
    name: 'Atlantic',
    description: 'Dow Jones 30 + DAX 40',
    assets: [],
    symbols: ['DOWx', 'DAXx'],
    comingSoon: true,
  },
  {
    id: 'ai-tech',
    name: 'AI & Tech',
    description: 'AI & Tech Leaders',
    assets: [],
    symbols: ['AIx'],
    comingSoon: true,
  },
  {
    id: 'crypto',
    name: 'Crypto Blue Chips',
    description: 'BTC + ETH',
    assets: [],
    symbols: ['CRYPTOx'],
    comingSoon: true,
  },
];

function arraysEqual(a: string[], b: readonly string[]) {
  if (a.length !== b.length) return false;
  return b.every((addr) => a.includes(addr));
}

export function BasketSelector({ selected, onChange }: BasketSelectorProps) {
  const selectedBasketId = BASKETS.find(
    (b) => !b.comingSoon && arraysEqual(selected, b.assets),
  )?.id;

  const selectBasket = (basket: BasketOption) => {
    if (basket.comingSoon) return;
    onChange([...basket.assets]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Select Basket</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BASKETS.map((basket) => {
          const isSelected = selectedBasketId === basket.id;
          return (
            <button
              key={basket.id}
              onClick={() => selectBasket(basket)}
              disabled={basket.comingSoon}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                basket.comingSoon
                  ? 'opacity-40 cursor-not-allowed bg-white/[0.02] border-white/5'
                  : isSelected
                    ? 'bg-white/20 border-white/30'
                    : 'bg-white/5 border-white/10 backdrop-blur-md hover:border-white/20'
              }`}
            >
              <div className="flex -space-x-2">
                {basket.symbols.map((symbol) => (
                  <TokenIcon key={symbol} symbol={symbol} size="md" className="ring-1 ring-black/50" />
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-white">{basket.name}</div>
                <div className="text-xs text-muted-foreground">{basket.description}</div>
              </div>
              {basket.comingSoon && (
                <span className="absolute top-2 right-2 text-[10px] font-medium text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-xs text-loss">Select a basket to continue.</p>
      )}
    </div>
  );
}
