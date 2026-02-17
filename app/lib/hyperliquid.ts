export type PerpMarket = {
  name: string;
  maxLeverage: number;
  szDecimals: number;
};

export type MidPriceMap = Record<string, string>;

const HYPERLIQUID_INFO_URL = process.env.HYPERLIQUID_INFO_URL ?? 'https://api.hyperliquid.xyz/info';

export async function fetchPerpMarkets(): Promise<PerpMarket[]> {
  const response = await fetch(HYPERLIQUID_INFO_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'meta' }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Hyperliquid markets: ${response.status}`);
  }

  const data = await response.json();
  return (data?.universe ?? []).map((item: { name: string; maxLeverage: number; szDecimals: number }) => ({
    name: item.name,
    maxLeverage: item.maxLeverage,
    szDecimals: item.szDecimals,
  }));
}

export async function fetchAllMids(): Promise<MidPriceMap> {
  const response = await fetch(HYPERLIQUID_INFO_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'allMids' }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Hyperliquid prices: ${response.status}`);
  }

  return response.json();
}
