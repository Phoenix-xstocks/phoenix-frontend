interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  prefix?: string;
  className?: string;
}

export function StatCard({ label, value, subValue, prefix, className = '' }: StatCardProps) {
  return (
    <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 ${className}`}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-mono tabular-nums text-white">
        {prefix && <span className="text-muted-foreground text-lg">{prefix}</span>}
        {value}
      </p>
      {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
    </div>
  );
}
