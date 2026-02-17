'use client';

import { useEffect, useRef } from 'react';

type TickCallback = (price: number) => void;

const WS_URL = process.env.NEXT_PUBLIC_HYPERLIQUID_WS_URL ?? 'wss://api.hyperliquid.xyz/ws';

export function useHyperliquidFeed(market: string, onTick: TickCallback) {
  const callbackRef = useRef(onTick);
  callbackRef.current = onTick;

  useEffect(() => {
    if (!market) return;

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          method: 'subscribe',
          subscription: { type: 'allMids' },
        }),
      );
    };

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      const mids = payload?.data?.mids;
      const price = mids?.[market];
      if (price) {
        callbackRef.current(Number(price));
      }
    };

    return () => {
      ws.send(
        JSON.stringify({
          method: 'unsubscribe',
          subscription: { type: 'allMids' },
        }),
      );
      ws.close();
    };
  }, [market]);
}
