import Image from 'next/image';

interface TokenIconProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 20,
  md: 32,
  lg: 40,
};

const tokenLogos: Record<string, string> = {
  NASDAQx: '/nasdaq.svg',
  SPXx: '/sp500.svg',
  USDC: '/usdc.svg',
  DOWx: '/dow.svg',
  DAXx: '/dax.svg',
  AIx: '/ai.svg',
  CRYPTOx: '/crypto.svg',
};

const tokenColors: Record<string, string> = {
  NASDAQx: 'bg-[#0096D6]/20',
  SPXx: 'bg-[#E3242B]/20',
  DOWx: 'bg-[#1A5276]/20',
  DAXx: 'bg-[#003399]/20',
  AIx: 'bg-[#7C3AED]/20',
  CRYPTOx: 'bg-[#F7931A]/20',
};

const fullCircleLogos = new Set(['USDC']);

export function TokenIcon({ symbol, size = 'md', className = '' }: TokenIconProps) {
  const px = sizeMap[size];
  const logo = tokenLogos[symbol];

  if (logo) {
    const isFull = fullCircleLogos.has(symbol);
    return (
      <div
        className={`rounded-full flex items-center justify-center overflow-hidden ${isFull ? '' : tokenColors[symbol] || ''} ${className}`}
        style={{ width: px, height: px }}
      >
        <Image
          src={logo}
          alt={symbol}
          width={px}
          height={px}
          className={isFull ? 'object-cover w-full h-full' : 'object-contain p-1'}
        />
      </div>
    );
  }

  const colorClass = tokenColors[symbol] || 'bg-gray-500/20 text-gray-400';
  const textSize = size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm';

  return (
    <div
      className={`rounded-full flex items-center justify-center font-mono font-bold ${colorClass} ${textSize} ${className}`}
      style={{ width: px, height: px }}
    >
      {symbol.slice(0, 2)}
    </div>
  );
}
