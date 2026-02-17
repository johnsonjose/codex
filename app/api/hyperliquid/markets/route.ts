import { NextResponse } from 'next/server';
import { fetchPerpMarkets } from '@/app/lib/hyperliquid';

export async function GET() {
  try {
    const markets = await fetchPerpMarkets();
    return NextResponse.json({ markets });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
