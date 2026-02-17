'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import HeartbeatChart from './HeartbeatChart';
import { useTradingStore } from '@/app/store/trading-store';
import { useHyperliquidFeed } from '@/app/lib/use-hyperliquid-feed';

type Market = { name: string; maxLeverage: number };

export default function TradingSection() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [latestPrice, setLatestPrice] = useState(0);
  const [liquidationFlash, setLiquidationFlash] = useState(false);

  const {
    selectedMarket,
    leverage,
    balance,
    wins,
    losses,
    history,
    position,
    setMarket,
    setLeverage,
    openPosition,
    onPriceTick,
    closePosition,
    resetDemo,
  } = useTradingStore();

  useEffect(() => {
    fetch('/api/hyperliquid/markets')
      .then((res) => res.json())
      .then((data) => {
        setMarkets(data.markets ?? []);
        if (!selectedMarket && data.markets?.[0]?.name) setMarket(data.markets[0].name);
      });
  }, [selectedMarket, setMarket]);

  const maxAllowedLeverage = useMemo(
    () => Math.min(markets.find((m) => m.name === selectedMarket)?.maxLeverage ?? 20, 20),
    [markets, selectedMarket],
  );

  useHyperliquidFeed(selectedMarket, (price) => {
    setLatestPrice(price);
    onPriceTick(price);
  });

  useEffect(() => {
    if (!position) return;
    const liquidated =
      (position.side === 'long' && position.currentPrice <= position.liquidationPrice) ||
      (position.side === 'short' && position.currentPrice >= position.liquidationPrice);

    if (liquidated) {
      setLiquidationFlash(true);
      const t = setTimeout(() => setLiquidationFlash(false), 900);
      return () => clearTimeout(t);
    }
  }, [position]);

  const risk = Math.round((leverage / 20) * 100);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold md:text-3xl">Hyperliquid Paper Trading</h2>
        <button className="rounded-lg border border-white/15 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10" onClick={resetDemo}>
          Reset Demo Account
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className={`space-y-4 rounded-2xl ${liquidationFlash ? 'animate-pulse bg-red-500/10' : ''}`}>
          <div className="glass flex flex-wrap items-center gap-3 rounded-xl p-4">
            <select
              value={selectedMarket}
              onChange={(e) => setMarket(e.target.value)}
              className="rounded-lg border border-white/15 bg-panel px-3 py-2 text-sm"
            >
              {markets.map((market) => (
                <option key={market.name} value={market.name}>
                  {market.name}
                </option>
              ))}
            </select>
            <div className="numeric text-xl font-semibold">${latestPrice.toFixed(4)}</div>
            <div className="ml-auto text-sm text-zinc-400">Margin: $10 Isolated</div>
          </div>

          <HeartbeatChart latestPrice={latestPrice} />

          <div className="glass rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Boost {leverage.toFixed(0)}x</span>
              <span className="text-zinc-400">Risk {risk}%</span>
            </div>
            <motion.input
              whileTap={{ scale: 0.98 }}
              type="range"
              min={1}
              max={maxAllowedLeverage}
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              className="h-2 w-full cursor-grab appearance-none rounded-lg bg-zinc-700 accent-cyan-300"
            />
            <div className="mt-2 h-2 rounded-full bg-zinc-800">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-rose-500" style={{ width: `${risk}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="rounded-xl bg-emerald-500/20 p-4 text-lg font-semibold text-emerald-300 shadow-neon hover:bg-emerald-500/30"
              onClick={() => openPosition('long', latestPrice)}
              disabled={!latestPrice || !!position}
            >
              UP
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="rounded-xl bg-rose-500/20 p-4 text-lg font-semibold text-rose-300 shadow-redNeon hover:bg-rose-500/30"
              onClick={() => openPosition('short', latestPrice)}
              disabled={!latestPrice || !!position}
            >
              DOWN
            </motion.button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm uppercase tracking-[0.14em] text-zinc-400">Demo Balance</h3>
            <div className="numeric mt-2 text-3xl font-semibold">${balance.toFixed(2)}</div>
            <div className="mt-2 flex gap-4 text-sm text-zinc-300">
              <span>Wins: {wins}</span>
              <span>Losses: {losses}</span>
            </div>
          </div>

          <div className="glass rounded-xl p-4">
            <h3 className="mb-3 text-sm uppercase tracking-[0.14em] text-zinc-400">Active Position</h3>
            {position ? (
              <div className="space-y-2 text-sm">
                <div>{position.market} · {position.side.toUpperCase()} · {position.leverage}x</div>
                <div className="numeric">Entry: ${position.entryPrice.toFixed(4)}</div>
                <div className="numeric">Liq: ${position.liquidationPrice.toFixed(4)}</div>
                <div className={`numeric text-lg font-semibold ${position.pnl >= 0 ? 'text-neonGreen' : 'text-neonRed'}`}>
                  PnL: ${position.pnl.toFixed(3)}
                </div>
                <button onClick={() => closePosition()} className="mt-2 rounded-md border border-white/15 px-3 py-1 text-xs hover:bg-white/10">
                  Close Position
                </button>
              </div>
            ) : (
              <p className="text-sm text-zinc-400">No active position</p>
            )}
          </div>

          <div className="glass rounded-xl p-4">
            <h3 className="mb-3 text-sm uppercase tracking-[0.14em] text-zinc-400">Trade History</h3>
            <div className="max-h-[280px] space-y-2 overflow-auto pr-1 text-xs">
              {history.length === 0 && <p className="text-zinc-500">No trades yet</p>}
              {history.map((trade) => (
                <div key={trade.id} className="rounded-lg border border-white/10 p-2">
                  <div className="flex justify-between">
                    <span>{trade.market} {trade.side}</span>
                    <span className={trade.pnl >= 0 ? 'text-neonGreen' : 'text-neonRed'}>${trade.pnl.toFixed(3)}</span>
                  </div>
                  <div className="mt-1 text-zinc-400">{new Date(trade.closedAt).toLocaleTimeString()} · {trade.outcome}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
