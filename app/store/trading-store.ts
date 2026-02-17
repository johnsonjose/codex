'use client';

import { create } from 'zustand';

export type Side = 'long' | 'short';
export type Position = {
  market: string;
  side: Side;
  entryPrice: number;
  currentPrice: number;
  leverage: number;
  margin: number;
  size: number;
  liquidationPrice: number;
  pnl: number;
  openedAt: number;
};

export type TradeRecord = {
  id: string;
  market: string;
  side: Side;
  entryPrice: number;
  exitPrice: number;
  leverage: number;
  pnl: number;
  outcome: 'win' | 'loss' | 'liquidated';
  closedAt: number;
};

type TradingState = {
  selectedMarket: string;
  leverage: number;
  balance: number;
  wins: number;
  losses: number;
  position: Position | null;
  history: TradeRecord[];
  setMarket: (market: string) => void;
  setLeverage: (leverage: number) => void;
  openPosition: (side: Side, price: number) => void;
  onPriceTick: (price: number) => void;
  closePosition: (reason?: 'manual' | 'liquidated') => void;
  resetDemo: () => void;
};

const DEMO_BALANCE = 1000;
const FIXED_MARGIN = 10;
const MM_RATE = 0.005;

const calcLiquidation = (entry: number, side: Side, leverage: number) => {
  const move = 1 / leverage - MM_RATE;
  return side === 'long' ? entry * (1 - move) : entry * (1 + move);
};

const calcPnl = (position: Position, markPrice: number) => {
  const quantity = position.size / position.entryPrice;
  if (position.side === 'long') {
    return (markPrice - position.entryPrice) * quantity;
  }
  return (position.entryPrice - markPrice) * quantity;
};

export const useTradingStore = create<TradingState>((set, get) => ({
  selectedMarket: '',
  leverage: 5,
  balance: DEMO_BALANCE,
  wins: 0,
  losses: 0,
  position: null,
  history: [],
  setMarket: (market) => set({ selectedMarket: market }),
  setLeverage: (leverage) => set({ leverage }),
  openPosition: (side, price) => {
    const { selectedMarket, leverage, position } = get();
    if (!selectedMarket || position) return;

    const size = FIXED_MARGIN * leverage;
    const liquidationPrice = calcLiquidation(price, side, leverage);
    set({
      position: {
        market: selectedMarket,
        side,
        entryPrice: price,
        currentPrice: price,
        leverage,
        margin: FIXED_MARGIN,
        size,
        liquidationPrice,
        pnl: 0,
        openedAt: Date.now(),
      },
    });
  },
  onPriceTick: (price) => {
    const { position } = get();
    if (!position) return;

    const pnl = calcPnl(position, price);
    const updatedPosition: Position = { ...position, currentPrice: price, pnl };

    const liquidated =
      (position.side === 'long' && price <= position.liquidationPrice) ||
      (position.side === 'short' && price >= position.liquidationPrice);

    if (liquidated) {
      set({ position: updatedPosition });
      get().closePosition('liquidated');
      return;
    }

    set({ position: updatedPosition });
  },
  closePosition: (reason = 'manual') => {
    const { position, history, balance, wins, losses } = get();
    if (!position) return;

    const outcome: TradeRecord['outcome'] =
      reason === 'liquidated' ? 'liquidated' : position.pnl >= 0 ? 'win' : 'loss';

    set({
      balance: Math.max(0, balance + position.pnl),
      wins: outcome === 'win' ? wins + 1 : wins,
      losses: outcome === 'loss' || outcome === 'liquidated' ? losses + 1 : losses,
      history: [
        {
          id: crypto.randomUUID(),
          market: position.market,
          side: position.side,
          entryPrice: position.entryPrice,
          exitPrice: position.currentPrice,
          leverage: position.leverage,
          pnl: position.pnl,
          outcome,
          closedAt: Date.now(),
        },
        ...history,
      ].slice(0, 50),
      position: null,
    });
  },
  resetDemo: () =>
    set({
      selectedMarket: '',
      leverage: 5,
      balance: DEMO_BALANCE,
      wins: 0,
      losses: 0,
      position: null,
      history: [],
    }),
}));
