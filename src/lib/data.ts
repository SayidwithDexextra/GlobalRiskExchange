// Market data types and constants

import {
  exampleBySymbol,
  formatExampleChange,
  formatExamplePrice,
  tickerFromExamples,
} from "@/lib/exampleMarkets";

export type Market = {
  id: string;
  name: string;
  unit: string;
  cat: string;
  base: number;
  dec: number;
  settle: string;
  pct?: boolean;
  ab?: string;
};

export const MARKETS: Market[] = [
  { id: 'GPU-H100', name: 'GPU compute, H100', unit: '$/hr', cat: 'Compute', base: 2.0, dec: 2, settle: '31 MAR 2027', ab: 'GP' },
  { id: 'PRICE-EGGS', name: 'Eggs, Grade A', unit: '$/dozen', cat: 'Commodities', base: 2.715, dec: 3, settle: '31 DEC 2026' },
  { id: 'ERCOT-N', name: 'ERCOT North power', unit: '$/MWh', cat: 'Energy', base: 38.4, dec: 2, settle: '30 JUN 2027' },
  { id: 'FREIGHT-FEU', name: 'Asia to US freight', unit: '$/FEU', cat: 'Freight', base: 2140, dec: 0, settle: '31 JAN 2027' },
  { id: 'DRAM-DDR5', name: 'DRAM DDR5 spot', unit: '$/Gb', cat: 'Compute', base: 4.85, dec: 2, settle: '31 MAR 2027' },
  { id: 'US-CPI-YOY', name: 'US CPI, year on year', unit: '%', cat: 'Macro', base: 2.9, dec: 2, settle: '15 JAN 2027', pct: true },
  { id: 'BTC-MINE-M', name: 'BTC mining margin', unit: 'BTC / POWER', cat: 'Ratio', base: 48.2, dec: 2, settle: '31 MAR 2027' },
];

export const FILTERS = ['All', 'Commodities', 'Energy', 'Compute', 'Freight', 'Macro', 'Ratio'] as const;

export const FEATURED_KPIS = { vol: '$412K', oi: '$1.9M', traders: '186' };

// Featured series (deterministic, no PRNG)
export const FEATURED_SERIES = Array.from({ length: 90 }, (_, i) => {
  const t = i / 89;
  return 1.72 + 0.28 * (t * t * (3 - 2 * t)) + 0.035 * Math.sin(t * 11) + 0.02 * Math.sin(t * 23 + 1)
    - (0.035 * Math.sin(11) + 0.02 * Math.sin(24)) * t;
});

// Ticker data, from the shared example list
export const TICKER: [string, string, number][] = tickerFromExamples();

export const STATS = [
  { label: 'What you can list', value: 'Any', sub: 'PUBLIC NUMBER' },
  { label: 'Fee per trade', value: '~0.10%', sub: 'VS ~2%' },
  { label: 'Settlement', value: 'UMA', sub: 'OPTIMISTIC ORACLE' },
  { label: 'Custody', value: 'Your wallet', sub: 'USDC' },
  { label: 'Gas', value: '$0', sub: 'GASLESS' },
];

export const GLASS_STATS = [
  { v: '0.25 to 1%+', d: "Typical cost hidden in a bank's spread on a bespoke hedge.", x: '~0.10% FEE', tint: 'radial-gradient(circle,color-mix(in srgb,var(--green) 8%,transparent),transparent 70%)' },
  { v: '~2%', d: 'Typical fee per trade on popular prediction markets.', x: '~0.10% FEE', tint: 'radial-gradient(circle,color-mix(in srgb,var(--blue) 6%,transparent),transparent 70%)' },
  { v: 'Platform only', d: 'Who decides which new markets get listed on most venues.', x: 'ANYONE LISTS', tint: 'radial-gradient(circle,color-mix(in srgb,var(--green) 8%,transparent),transparent 70%)' },
  { v: 'Institutions', d: "Who gets access to a bank's hedging desk.", x: 'ANYONE TRADES', tint: 'radial-gradient(circle,color-mix(in srgb,var(--blue) 6%,transparent),transparent 70%)' },
];

const dashGpu = exampleBySymbol('GPU-H100');
const dashErcot = exampleBySymbol('ERCOT-N');
const dashGpuChg = formatExampleChange(dashGpu.change);
const dashErcotChg = formatExampleChange(dashErcot.change);

// Hero dashboard data
export const DASH_ASSETS = [
  { sym: 'PRICE-EGGS', p: 'live', c: 'live', dot: '#F5F5F5' },
  { sym: dashGpu.symbol, p: formatExamplePrice(dashGpu), c: dashGpuChg.text, col: dashGpuChg.color, dot: '#808080' },
  { sym: dashErcot.symbol, p: formatExamplePrice(dashErcot), c: dashErcotChg.text, col: dashErcotChg.color, dot: '#4ADE80' },
];

export const MY_MARKETS = [
  { sym: 'PRICE-EGGS', p: 'live', dot: '#F5F5F5' },
  { sym: dashGpu.symbol, p: formatExamplePrice(dashGpu), dot: '#808080' },
  { sym: dashErcot.symbol, p: formatExamplePrice(dashErcot), dot: '#4ADE80' },
];

export const POSITIONS: [string, 'Long' | 'Short', number, number | 'live', number, number][] = [
  ['PRICE-EGGS', 'Long', 2.690, 'live', 20000, 3],
  ['GPU-H100', 'Short', 2.06, dashGpu.price, 10000, dashGpu.decimals],
  ['ERCOT-N', 'Long', 42.35, dashErcot.price, 400, dashErcot.decimals],
];

export const DASH_DATES = ['OCT 1', 'OCT 4', 'OCT 7', 'OCT 10', 'OCT 13', 'OCT 16'];

// Network diagram nodes
export const NET_NODES = [
  { id: 'imp', n: 'Importer', d: 'Pays for goods priced in freight it cannot hedge.', x: 170, y: 130, nw: [110, 380], tag: 'BESPOKE TERMS', dtag: 'OPEN LISTING' },
  { id: 'dc', n: 'Data center', d: 'Large power buyer. Big enough for a bank desk.', x: 370, y: 70, ok: true },
  { id: 'farm', n: 'Farmer', d: 'Exposed to crop and fertilizer prices every season.', x: 120, y: 330, nw: [40, 510], tag: 'CREDIT CHECK', dtag: 'ANYONE TRADES' },
  { id: 'mine', n: 'Miner', d: 'Margin swings with power cost and BTC price.', x: 240, y: 500, wideOnly: true },
  { id: 'air', n: 'Airline', d: 'Fuel is its largest variable cost.', x: 840, y: 80, dtag: 'ONE SIGNATURE' },
  { id: 'fund', n: 'Fund', d: 'Has a credit line and a dealer. Gets a quote.', x: 1060, y: 160, nw: [250, 380], ok: true },
  { id: 'ret', n: 'Retail trader', d: 'Wants a view on real prices. No access to a desk.', x: 1070, y: 370, nw: [320, 510], tag: 'GEOGRAPHY', dtag: '~0.10% FEE' },
  { id: 'smb', n: 'Small business', d: 'Too small for a bank minimum ticket.', x: 980, y: 510, wideOnly: true, tag: '$ MINIMUMS' },
] as const;

export const NET_LAYOUT = {
  wide: { vb: [1200, 600], hub: [600, 270], bank: [600, 480], usdc: [400, 500], uma: [800, 500] },
  narrow: { vb: [360, 640], hub: [180, 96], bank: [180, 590], usdc: [50, 225], uma: [310, 225] },
};

export const NET_SIDE = [
  { key: 'u', title: 'USDC COLLATERAL', titleNarrow: 'USDC', d: 'Held in contracts, not by us' },
  { key: 'm', title: 'UMA ORACLE', titleNarrow: 'UMA ORACLE', d: 'Settles from public data' },
];

// Market tables
const EX = 'https://dexetera.xyz/explore';

export const SINGLE_METRIC = [
  { name: 'Eggs', sym: 'PRICE-EGGS · BLS', long: 'Bakeries, food makers', short: 'Egg producers', href: 'https://dexetera.xyz/token/PRICE-EGGS' },
  { name: 'GPU compute', sym: 'GPU-H100 · $/HR', long: 'AI labs, inference cos.', short: 'GPU clouds', href: EX },
  { name: 'Regional power', sym: 'ERCOT / PJM · $/MWH', long: 'Data centers, factories', short: 'Generators', href: EX },
  { name: 'Ocean freight', sym: 'FREIGHT-FEU · $/FEU', long: 'Importers, retailers', short: 'Carriers', href: EX },
  { name: 'DRAM / NAND', sym: 'DRAM-DDR5 · $/GB', long: 'Device makers', short: 'Memory producers', href: EX },
];

export const RATIO = [
  { name: 'Power-plant margin', sym: 'POWER / GAS', long: 'Large power buyers', short: 'Gas-fired generators', href: EX },
  { name: 'BTC mining margin', sym: 'BTC / POWER', long: 'Funds, traders', short: 'Miners', href: EX },
  { name: 'Farming margin', sym: 'CROP / FERTILIZER', long: 'Food processors', short: 'Farmers', href: EX },
  { name: 'AI margin', sym: 'AI REVENUE / CHIP COST', long: 'Funds, traders', short: 'AI companies', href: EX },
  { name: 'Data-center margin', sym: 'COMPUTE / POWER', long: 'Funds, traders', short: 'GPU clouds', href: EX },
];

export const TYPE_TABLES = [
  { title: 'Single metric', count: '5', sub: 'One public number', rows: SINGLE_METRIC },
  { title: 'Ratio', count: '5', sub: 'The gap between two numbers', rows: RATIO },
];

// Features
export const FEATURES = [
  { icon: 'activity', t: 'Order book', d: 'Bids, asks, and liquidations.' },
  { icon: 'wallet', t: 'USDC, non-custodial', d: 'Funds stay in your wallet and contracts.' },
  { icon: 'zap', t: 'Gasless, one signature', d: 'Trade or list without paying gas.' },
  { icon: 'shield-check', t: 'Public data + UMA', d: 'Named sources, open disputes.' },
  { icon: 'sparkles', t: 'List in minutes', d: 'The AI wizard drafts the market.' },
];

// Comparison table
export const COMPARE: { f: string; d: string; o: [string, 1 | 0 | -1][] }[] = [
  { f: 'What you trade', d: 'Any real number', o: [['Yes/no events', -1], ['Crypto only', -1], ['Real risk', 1]] },
  { f: 'Who can list', d: 'Anyone', o: [['Platform only', -1], ['Platform only', -1], ['Banks only', -1]] },
  { f: 'Who can trade', d: 'Anyone', o: [['Some regions', -1], ['Anyone', 1], ['Institutions', -1]] },
  { f: 'Who settles', d: 'Public data + UMA', o: [['The platform', -1], ['Mark price', 0], ['The bank', -1]] },
  { f: 'Who holds funds', d: 'You do', o: [['The platform', -1], ['You do', 1], ['The bank', -1]] },
  { f: 'Cost to trade', d: '~0.10%', o: [['~2%', -1], ['Varies', 0], ['0.25 to 1%+ spread', -1]] },
];

export const COMPARE_COLS = ['FEATURE', 'DEXETERA', 'PREDICTION MKTS', 'CRYPTO PERPS', 'BANKS'];

// FAQ
export const FAQ: [string, string][] = [
  ['How does creating a market work?', 'Describe the number in plain language. The AI wizard turns it into a market, suggests public sources to settle against, and lists it with one signature. The bond and any penalty are shown before you sign. Creators earn 20% of the trading fees their market generates.'],
  ['How is a market settled?', 'At expiry the final value is captured from the named public source and a snapshot is saved to archive.org. Anyone can challenge it during the challenge window. Disputes escalate to UMA.'],
  ['What is UMA?', 'UMA runs an optimistic oracle. A proposed value is accepted unless someone disputes it within a set window. Disputed values are resolved by UMA token holders voting on the evidence.'],
  ['Who holds my funds?', "You do. Dexetera is non-custodial. Your USDC stays in your wallet and in the market's smart contracts. Dexetera never takes custody."],
  ['What does it cost to trade?', 'About 0.10% per trade, with no gas thanks to gasless mode. 20% of that fee goes to the market\'s creator. For comparison, popular prediction markets charge around 2%, and bank hedges hide 0.25 to 1% or more in the spread.'],
  ['What makes a good market?', 'A number that a public source publishes on a regular schedule, that is hard to manipulate, and that has people on both sides who care where it goes.'],
  ['Can I exit before settlement?', 'Yes. Close all or part of a position at any time against the order book. Your P&L is realized at the price you exit.'],
  ['What happens if the data source is disputed?', "Anyone can challenge the proposed final value during the challenge window. The archived snapshot serves as the record, and UMA's oracle makes the final decision."],
];

export const FOOTER_CHIPS = ['PRICE-EGGS', 'PRICE-MILK-US', 'CRUDE-OIL', 'GOLD'];

export const LEDGERS = [
  { name: 'InferCo', role: 'Buys GPU compute', side: '↗ LONG', sideColor: '#4ADE80', sideBg: 'rgba(16,185,129,0.12)', sideLine: 'rgba(16,185,129,0.22)' },
  { name: 'RigCloud', role: 'Sells GPU compute', side: '↘ SHORT', sideColor: '#F87171', sideBg: 'rgba(248,113,113,0.10)', sideLine: 'rgba(248,113,113,0.22)' },
];

// Navigation links (same on all pages)
export const NAV_LINKS = [
  { label: 'Markets', href: '/#markets' },
  { label: 'Product', href: '/#product' },
  { label: 'Whitepaper', href: '/whitepaper' },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
];

// Footer links
export const FOOTER_LINKS = {
  product: [
    { label: 'Markets', href: 'https://dexetera.xyz/explore' },
    { label: 'Launch app', href: 'https://dexetera.xyz' },
    { label: 'Create a market', href: 'https://dexetera.xyz/new-market' },
  ],
  learn: [
    { label: 'How it works', href: '/#how' },
    { label: 'Whitepaper', href: '/whitepaper' },
  ],
  company: [
    { label: 'Team', href: '/team' },
    { label: 'Contact', href: '/contact' },
    { label: 'X / Twitter', href: 'https://x.com/dexeteralabs' },
    { label: 'admin@dexetera.xyz', href: 'mailto:admin@dexetera.xyz' },
  ],
};
