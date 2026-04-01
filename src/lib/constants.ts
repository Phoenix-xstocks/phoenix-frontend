export const BASKET_ASSETS = {
  NASDAQx: {
    address: '0x267ED9BC43B16D832cB9Aaf0e3445f0cC9f536d9' as const,
    symbol: 'NASDAQx',
    name: 'Nasdaq 100',
    color: '#0096D6',
  },
  SPXx: {
    address: '0x9eF9f9B22d3CA9769e28e769e2AAA3C2B0072D0e' as const,
    symbol: 'SPXx',
    name: 'S&P 500',
    color: '#E3242B',
  },
} as const;

export const FLAGSHIP_BASKET = [
  BASKET_ASSETS.NASDAQx.address,
  BASKET_ASSETS.SPXx.address,
] as const;

export const PROTOCOL_CONSTANTS = {
  MIN_NOTE_SIZE: 100_000_000n, // 100 USDC (6 decimals)
  MAX_NOTE_SIZE: 100_000_000_000n, // 100k USDC
  MAX_TVL: 5_000_000_000_000n, // 5M USDC
  EMBEDDED_FEE_BPS: 50n, // 0.5%
  ORIGINATION_FEE_BPS: 10n, // 0.1%
  TOTAL_FEE_BPS: 60n, // 0.6%
  MAX_OBSERVATIONS: 6,
  OBS_INTERVAL_DAYS: 30,
  MATURITY_DAYS: 180,
  COUPON_BARRIER_BPS: 7_000, // 70%
  AUTOCALL_TRIGGER_BPS: 10_000, // 100%
  STEP_DOWN_BPS: 200, // 2%
  KI_BARRIER_BPS: 7_000, // 70%
  KI_SETTLE_DEADLINE_DAYS: 7,
  CLAIM_DEADLINE_HOURS: 24,
  EPOCH_DURATION_HOURS: 48,
  USDC_DECIMALS: 6,
} as const;

export const TARGET_APY_BPS = 1_200; // 12%
