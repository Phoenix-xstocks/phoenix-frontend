interface TokenIconProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

const tokenColors: Record<string, string> = {
  NVDAx: 'bg-[#76b900]/20 text-[#76b900]',
  TSLAx: 'bg-[#cc0000]/20 text-[#cc0000]',
  METAx: 'bg-[#0668E1]/20 text-[#0668E1]',
  AAPLx: 'bg-[#A2AAAD]/20 text-[#A2AAAD]',
  MSFTx: 'bg-[#00A4EF]/20 text-[#00A4EF]',
  AMZNx: 'bg-[#FF9900]/20 text-[#FF9900]',
  GOOGLx: 'bg-[#4285F4]/20 text-[#4285F4]',
  USDC: 'bg-blue-500/20 text-blue-400',
};

export function TokenIcon({ symbol, size = 'md', className = '' }: TokenIconProps) {
  const colorClass = tokenColors[symbol] || 'bg-gray-500/20 text-gray-400';
  return (
    <div className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center font-mono font-bold ${className}`}>
      {symbol.slice(0, 2)}
    </div>
  );
}
