export interface SidebarSection {
  title: string;
  items: { label: string; slug: string[] }[];
}

export const SIDEBAR: SidebarSection[] = [
  {
    title: 'Protocol',
    items: [
      { label: 'Introduction', slug: [] },
      { label: 'Overview', slug: ['protocol', 'overview'] },
      { label: 'Note Lifecycle', slug: ['protocol', 'note-lifecycle'] },
      { label: 'Deposit Flow', slug: ['protocol', 'deposit-flow'] },
      { label: 'Pricing', slug: ['protocol', 'pricing'] },
      { label: 'Delta-Neutral Hedging', slug: ['protocol', 'hedging'] },
      { label: 'Epoch Waterfall', slug: ['protocol', 'waterfall'] },
      { label: 'Integrations', slug: ['protocol', 'integrations'] },
      { label: 'Risk Management', slug: ['protocol', 'risk'] },
      { label: 'Protocol Constants', slug: ['protocol', 'constants'] },
    ],
  },
  {
    title: 'Core Contracts',
    items: [
      { label: 'AutocallEngine', slug: ['technical', 'core', 'contract.AutocallEngine'] },
      { label: 'NoteToken', slug: ['technical', 'core', 'contract.NoteToken'] },
      { label: 'XYieldVault', slug: ['technical', 'core', 'contract.XYieldVault'] },
    ],
  },
  {
    title: 'Hedge Contracts',
    items: [
      { label: 'HedgeManager', slug: ['technical', 'hedge', 'contract.HedgeManager'] },
      { label: 'CarryEngine', slug: ['technical', 'hedge', 'contract.CarryEngine'] },
    ],
  },
  {
    title: 'Pricing Contracts',
    items: [
      { label: 'CREConsumer', slug: ['technical', 'pricing', 'contract.CREConsumer'] },
      { label: 'OptionPricer', slug: ['technical', 'pricing', 'contract.OptionPricer'] },
      { label: 'CouponCalculator', slug: ['technical', 'pricing', 'contract.CouponCalculator'] },
      { label: 'IssuanceGate', slug: ['technical', 'pricing', 'contract.IssuanceGate'] },
      { label: 'VolOracle', slug: ['technical', 'pricing', 'contract.VolOracle'] },
    ],
  },
  {
    title: 'Periphery Contracts',
    items: [
      { label: 'EpochManager', slug: ['technical', 'periphery', 'contract.EpochManager'] },
      { label: 'FeeCollector', slug: ['technical', 'periphery', 'contract.FeeCollector'] },
      { label: 'ReserveFund', slug: ['technical', 'periphery', 'contract.ReserveFund'] },
      { label: 'ProtocolStats', slug: ['technical', 'periphery', 'contract.ProtocolStats'] },
    ],
  },
  {
    title: 'Integration Contracts',
    items: [
      { label: 'ChainlinkPriceFeed', slug: ['technical', 'integrations', 'contract.ChainlinkPriceFeed'] },
      { label: 'PythAdapter', slug: ['technical', 'integrations', 'contract.PythAdapter'] },
      { label: 'OneInchSwapper', slug: ['technical', 'integrations', 'contract.OneInchSwapper'] },
      { label: 'NadoAdapter', slug: ['technical', 'integrations', 'contract.NadoAdapter'] },
      { label: 'TydroAdapter', slug: ['technical', 'integrations', 'contract.TydroAdapter'] },
      { label: 'EulerAdapter', slug: ['technical', 'integrations', 'contract.EulerAdapter'] },
      { label: 'CouponStreamer', slug: ['technical', 'integrations', 'contract.CouponStreamer'] },
      { label: 'TestnetSwap', slug: ['technical', 'integrations', 'contract.TestnetSwap'] },
      { label: 'ChainlinkCRE', slug: ['technical', 'integrations', 'contract.ChainlinkCRE'] },
    ],
  },
];
