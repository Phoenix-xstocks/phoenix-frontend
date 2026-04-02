import { describe, it, expect } from 'vitest';
import {
  formatUSDC,
  formatUSDCCompact,
  formatBps,
  formatPercent,
  formatDuration,
  parseUSDC,
  shortenAddress,
} from '@/lib/format';

describe('formatUSDC', () => {
  it('formats 1 USDC correctly', () => {
    expect(formatUSDC(1_000_000n)).toBe('1.00');
  });

  it('formats fractional USDC', () => {
    expect(formatUSDC(1_500_000n)).toBe('1.50');
  });

  it('formats 100 USDC', () => {
    expect(formatUSDC(100_000_000n)).toBe('100.00');
  });

  it('truncates to 2 decimals by default', () => {
    expect(formatUSDC(1_234_567n)).toBe('1.23');
  });

  it('formats zero', () => {
    expect(formatUSDC(0n)).toBe('0.00');
  });

  it('formats large amounts with commas', () => {
    expect(formatUSDC(100_000_000_000n)).toBe('100,000.00');
  });

  it('respects custom decimal parameter', () => {
    expect(formatUSDC(1_234_567n, 4)).toBe('1.2346');
  });

  it('formats with zero decimals', () => {
    expect(formatUSDC(1_500_000n, 0)).toBe('2');
  });
});

describe('formatUSDCCompact', () => {
  it('formats millions with M suffix', () => {
    expect(formatUSDCCompact(1_000_000_000_000n)).toBe('1.0M');
  });

  it('formats fractional millions', () => {
    expect(formatUSDCCompact(5_500_000_000_000n)).toBe('5.5M');
  });

  it('formats thousands with K suffix', () => {
    expect(formatUSDCCompact(1_000_000_000n)).toBe('1.0K');
  });

  it('formats small amounts with decimals', () => {
    expect(formatUSDCCompact(500_000_000n)).toBe('500.00');
  });

  it('formats zero', () => {
    expect(formatUSDCCompact(0n)).toBe('0.00');
  });
});

describe('formatBps', () => {
  it('formats 100 bps as 1%', () => {
    expect(formatBps(100)).toBe('1.00%');
  });

  it('formats 7000 bps as 70%', () => {
    expect(formatBps(7000)).toBe('70.00%');
  });

  it('formats bigint bps', () => {
    expect(formatBps(50n)).toBe('0.50%');
  });

  it('formats zero', () => {
    expect(formatBps(0)).toBe('0.00%');
  });

  it('formats 10000 bps as 100%', () => {
    expect(formatBps(10000)).toBe('100.00%');
  });
});

describe('formatPercent', () => {
  it('formats with 2 decimals by default', () => {
    expect(formatPercent(12.5)).toBe('12.50%');
  });

  it('formats zero', () => {
    expect(formatPercent(0)).toBe('0.00%');
  });

  it('formats 100%', () => {
    expect(formatPercent(100)).toBe('100.00%');
  });

  it('respects custom decimals', () => {
    expect(formatPercent(12.345, 1)).toBe('12.3%');
  });
});

describe('formatDuration', () => {
  it('formats days and hours', () => {
    expect(formatDuration(90000)).toBe('1d 1h');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(3700)).toBe('1h 1m');
  });

  it('formats minutes only', () => {
    expect(formatDuration(300)).toBe('5m');
  });

  it('formats zero seconds', () => {
    expect(formatDuration(0)).toBe('0m');
  });

  it('formats exact day', () => {
    expect(formatDuration(86400)).toBe('1d 0h');
  });

  it('formats multiple days', () => {
    expect(formatDuration(172800)).toBe('2d 0h');
  });
});

describe('parseUSDC', () => {
  it('parses whole number', () => {
    expect(parseUSDC('100')).toBe(100_000_000n);
  });

  it('parses decimal', () => {
    expect(parseUSDC('1.5')).toBe(1_500_000n);
  });

  it('parses zero', () => {
    expect(parseUSDC('0')).toBe(0n);
  });

  it('returns 0 for empty string', () => {
    expect(parseUSDC('')).toBe(0n);
  });

  it('returns 0 for non-numeric string', () => {
    expect(parseUSDC('abc')).toBe(0n);
  });

  it('returns 0 for negative value', () => {
    expect(parseUSDC('-10')).toBe(0n);
  });

  it('parses smallest unit', () => {
    expect(parseUSDC('0.000001')).toBe(1n);
  });
});

describe('shortenAddress', () => {
  const addr = '0x1234567890abcdef1234567890abcdef12345678';

  it('shortens with default chars', () => {
    expect(shortenAddress(addr)).toBe('0x1234...5678');
  });

  it('shortens with custom chars', () => {
    expect(shortenAddress(addr, 6)).toBe('0x123456...345678');
  });
});
