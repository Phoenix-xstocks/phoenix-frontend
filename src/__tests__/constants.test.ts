import { describe, it, expect } from 'vitest';
import {
  BASKET_ASSETS,
  FLAGSHIP_BASKET,
  PROTOCOL_CONSTANTS,
  TARGET_APY_BPS,
} from '@/lib/constants';

describe('PROTOCOL_CONSTANTS', () => {
  it('MIN_NOTE_SIZE is 100 USDC', () => {
    expect(PROTOCOL_CONSTANTS.MIN_NOTE_SIZE).toBe(100_000_000n);
  });

  it('MAX_NOTE_SIZE is 100k USDC', () => {
    expect(PROTOCOL_CONSTANTS.MAX_NOTE_SIZE).toBe(100_000_000_000n);
  });

  it('MIN < MAX note size', () => {
    expect(PROTOCOL_CONSTANTS.MIN_NOTE_SIZE).toBeLessThan(
      PROTOCOL_CONSTANTS.MAX_NOTE_SIZE,
    );
  });

  it('total fee equals embedded + origination', () => {
    expect(PROTOCOL_CONSTANTS.TOTAL_FEE_BPS).toBe(
      PROTOCOL_CONSTANTS.EMBEDDED_FEE_BPS + PROTOCOL_CONSTANTS.ORIGINATION_FEE_BPS,
    );
  });

  it('maturity equals observations * interval', () => {
    expect(PROTOCOL_CONSTANTS.MATURITY_DAYS).toBe(
      PROTOCOL_CONSTANTS.MAX_OBSERVATIONS * PROTOCOL_CONSTANTS.OBS_INTERVAL_DAYS,
    );
  });

  it('coupon barrier equals KI barrier', () => {
    expect(PROTOCOL_CONSTANTS.COUPON_BARRIER_BPS).toBe(
      PROTOCOL_CONSTANTS.KI_BARRIER_BPS,
    );
  });

  it('autocall trigger is 100%', () => {
    expect(PROTOCOL_CONSTANTS.AUTOCALL_TRIGGER_BPS).toBe(10_000);
  });

  it('USDC decimals is 6', () => {
    expect(PROTOCOL_CONSTANTS.USDC_DECIMALS).toBe(6);
  });
});

describe('BASKET_ASSETS', () => {
  it('has exactly 2 assets', () => {
    expect(Object.keys(BASKET_ASSETS)).toHaveLength(2);
  });

  it('NASDAQx has required fields', () => {
    expect(BASKET_ASSETS.NASDAQx).toMatchObject({
      symbol: 'NASDAQx',
      name: 'Nasdaq 100',
    });
    expect(BASKET_ASSETS.NASDAQx.address).toMatch(/^0x/);
    expect(BASKET_ASSETS.NASDAQx.color).toBeDefined();
  });

  it('SPXx has required fields', () => {
    expect(BASKET_ASSETS.SPXx).toMatchObject({
      symbol: 'SPXx',
      name: 'S&P 500',
    });
    expect(BASKET_ASSETS.SPXx.address).toMatch(/^0x/);
    expect(BASKET_ASSETS.SPXx.color).toBeDefined();
  });
});

describe('FLAGSHIP_BASKET', () => {
  it('has exactly 2 addresses', () => {
    expect(FLAGSHIP_BASKET).toHaveLength(2);
  });

  it('contains both basket asset addresses', () => {
    expect(FLAGSHIP_BASKET).toContain(BASKET_ASSETS.NASDAQx.address);
    expect(FLAGSHIP_BASKET).toContain(BASKET_ASSETS.SPXx.address);
  });
});

describe('TARGET_APY_BPS', () => {
  it('is 12%', () => {
    expect(TARGET_APY_BPS).toBe(1_200);
  });
});
