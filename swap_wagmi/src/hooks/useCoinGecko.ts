import { useQuery } from '@tanstack/react-query';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

interface EthPrice {
  usd: number;
  usd_24h_change: number;
}

interface ChartPoint {
  timestamp: number;
  price: number;
}

async function fetchEthPrice(): Promise<EthPrice> {
  const res = await fetch(
    `${COINGECKO_BASE}/simple/price?ids=ethereum,usd-coin&vs_currencies=usd&include_24hr_change=true`
  );
  if (!res.ok) throw new Error('CoinGecko price fetch failed');
  const data = await res.json();
  return {
    usd: data.ethereum.usd,
    usd_24h_change: data.ethereum.usd_24h_change,
  };
}

async function fetchEthChart(days: number): Promise<ChartPoint[]> {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/ethereum/market_chart?vs_currency=usd&days=${days}&interval=daily`
  );
  if (!res.ok) throw new Error('CoinGecko chart fetch failed');
  const data = await res.json();
  return (data.prices as [number, number][]).map(([timestamp, price]) => ({
    timestamp,
    price: Math.round(price * 100) / 100,
  }));
}

async function fetchUsdcChart(days: number): Promise<ChartPoint[]> {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/usd-coin/market_chart?vs_currency=usd&days=${days}&interval=daily`
  );
  if (!res.ok) throw new Error('CoinGecko USDC chart fetch failed');
  const data = await res.json();
  return (data.prices as [number, number][]).map(([timestamp, price]) => ({
    timestamp,
    price: Math.round(price * 10000) / 10000,
  }));
}

export function useEthPrice() {
  return useQuery({
    queryKey: ['eth-price'],
    queryFn: fetchEthPrice,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}

export function useEthChart(days = 30) {
  return useQuery({
    queryKey: ['eth-chart', days],
    queryFn: () => fetchEthChart(days),
    staleTime: 5 * 60_000,
  });
}

export function useUsdcChart(days = 30) {
  return useQuery({
    queryKey: ['usdc-chart', days],
    queryFn: () => fetchUsdcChart(days),
    staleTime: 5 * 60_000,
  });
}

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  usd: number;
  usd_24h_change: number;
}

const MARKET_COINS = 'ethereum,bitcoin,solana,binancecoin,matic-network';

async function fetchMarketPrices(): Promise<CoinPrice[]> {
  const res = await fetch(
    `${COINGECKO_BASE}/simple/price?ids=${MARKET_COINS}&vs_currencies=usd&include_24hr_change=true`
  );
  if (!res.ok) throw new Error('CoinGecko market fetch failed');
  const data = await res.json();
  return [
    { id: 'ethereum',      symbol: 'ETH',   name: 'Ethereum', usd: data.ethereum?.usd,       usd_24h_change: data.ethereum?.usd_24h_change },
    { id: 'bitcoin',       symbol: 'BTC',   name: 'Bitcoin',  usd: data.bitcoin?.usd,        usd_24h_change: data.bitcoin?.usd_24h_change },
    { id: 'solana',        symbol: 'SOL',   name: 'Solana',   usd: data.solana?.usd,         usd_24h_change: data.solana?.usd_24h_change },
    { id: 'binancecoin',   symbol: 'BNB',   name: 'BNB',      usd: data.binancecoin?.usd,    usd_24h_change: data.binancecoin?.usd_24h_change },
    { id: 'matic-network', symbol: 'MATIC', name: 'Polygon',  usd: data['matic-network']?.usd, usd_24h_change: data['matic-network']?.usd_24h_change },
  ];
}

export function useMarketPrices() {
  return useQuery({
    queryKey: ['market-prices'],
    queryFn: fetchMarketPrices,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
