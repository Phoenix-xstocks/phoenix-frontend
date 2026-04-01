import { AutocallEngineABI } from './abis/AutocallEngine';
import { XYieldVaultABI } from './abis/XYieldVault';
import { NoteTokenABI } from './abis/NoteToken';
import { ERC20ABI } from './abis/ERC20';
import { VolOracleABI } from './abis/VolOracle';
import { OptionPricerABI } from './abis/OptionPricer';
import { CREConsumerABI } from './abis/CREConsumer';
import { CouponCalculatorABI } from './abis/CouponCalculator';
import { PythAdapterABI } from './abis/PythAdapter';
import { HedgeManagerABI } from './abis/HedgeManager';
import { CarryEngineABI } from './abis/CarryEngine';
import { ReserveFundABI } from './abis/ReserveFund';
import { FeeCollectorABI } from './abis/FeeCollector';
import { IssuanceGateABI } from './abis/IssuanceGate';
import { EpochManagerABI } from './abis/EpochManager';
import { CouponStreamerABI } from './abis/CouponStreamer';
import { ProtocolStatsABI } from './abis/ProtocolStats';
import { NadoAdapterABI } from './abis/NadoAdapter';
import { TydroAdapterABI } from './abis/TydroAdapter';
import { TestnetSwapABI } from './abis/TestnetSwap';

export const CONTRACTS = {
  // --- Core ---
  AutocallEngine: {
    address: '0xe6bf9838b13956f9ff8bde0008d7b333f82293b7' as const,
    abi: AutocallEngineABI,
  },
  XYieldVault: {
    address: '0xd4a1d2ffd7e12cdf44fdd20cbbd398cbd6320e32' as const,
    abi: XYieldVaultABI,
  },
  NoteToken: {
    address: '0xb72654ed175dfd49146ae163d494b4339f445482' as const,
    abi: NoteTokenABI,
  },

  // --- Pricing ---
  VolOracle: {
    address: '0x6097447ca69d03657a1a8d7429fabf0e5cc29c40' as const,
    abi: VolOracleABI,
  },
  OptionPricer: {
    address: '0x2671146F16460A788697E6DB9302C1a9d7F19e4e' as const,
    abi: OptionPricerABI,
  },
  CREConsumer: {
    address: '0x57f95ca8a2b92702fe62fd8bf343c6e181f4cbfd' as const,
    abi: CREConsumerABI,
  },
  CouponCalculator: {
    address: '0xfea833ba9df8e27a62cf573dcea43e52e6663998' as const,
    abi: CouponCalculatorABI,
  },
  IssuanceGate: {
    address: '0xa5d0862376a6e991132454cef55aa3a697ca9fb3' as const,
    abi: IssuanceGateABI,
  },

  // --- Hedge ---
  HedgeManager: {
    address: '0x36a261175b390d2f538d41323451bbf0243f2986' as const,
    abi: HedgeManagerABI,
  },
  CarryEngine: {
    address: '0xe621d8fcc8756caa681681c6b3d478b1ccb95fa4' as const,
    abi: CarryEngineABI,
  },

  // --- Periphery ---
  EpochManager: {
    address: '0x81ab879a5012a910c014ccd1a03419973dfd763a' as const,
    abi: EpochManagerABI,
  },
  FeeCollector: {
    address: '0x21c03f6dbb112f0effece0341881c6e2e611f03b' as const,
    abi: FeeCollectorABI,
  },
  ReserveFund: {
    address: '0x29d34dc6a93f3d611c4c453d554cf64a84ffdc3c' as const,
    abi: ReserveFundABI,
  },
  CouponStreamer: {
    address: '0xe220e9de9086f823b39cc5271912f0c17e7aeb80' as const,
    abi: CouponStreamerABI,
  },
  ProtocolStats: {
    address: '0x4075d5a6725f3710031984970e4b44670a0acaae' as const,
    abi: ProtocolStatsABI,
  },

  // --- Integrations ---
  PythAdapter: {
    address: '0x63033a6cd890e45812684f090f1a889f14938e1c' as const,
    abi: PythAdapterABI,
  },
  NadoAdapter: {
    address: '0x2d3d888695ada36b73c8ca8d771e78baf6f58c63' as const,
    abi: NadoAdapterABI,
  },
  TydroAdapter: {
    address: '0x1153ae807dd985cb66860a43cf6bef4c91d15d71' as const,
    abi: TydroAdapterABI,
  },
  TestnetSwap: {
    address: '0x10415db61BC994f00028B6Cc1bddc04c76bd0fB4' as const,
    abi: TestnetSwapABI,
  },

  // --- Tokens ---
  USDC: {
    address: '0x6b57475467cd854d36Be7FB614caDa5207838943' as const,
    abi: ERC20ABI,
  },
} as const;
