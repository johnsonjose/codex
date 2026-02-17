'use client';

import { createChart, ISeriesApi, LineData, UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

type Props = {
  latestPrice: number;
};

export default function HeartbeatChart({ latestPrice }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const dataRef = useRef<LineData[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: 'rgba(0,0,0,0)' },
        textColor: '#9ca3af',
      },
      grid: {
        horzLines: { color: 'rgba(255,255,255,0.06)' },
        vertLines: { color: 'rgba(255,255,255,0.04)' },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, timeVisible: true, secondsVisible: true },
      crosshair: { vertLine: { visible: false }, horzLine: { visible: false } },
      localization: { locale: 'en-US' },
      autoSize: true,
    });

    const series = chart.addLineSeries({
      color: '#33ff9c',
      lineWidth: 3,
      lastValueVisible: true,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
    });

    seriesRef.current = series;

    return () => {
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!latestPrice || !seriesRef.current) return;

    const now = Math.floor(Date.now() / 1000) as UTCTimestamp;
    const wobble = (Math.sin(Date.now() / 200) + Math.sin(Date.now() / 50) * 0.3) * (latestPrice * 0.0008);
    const point = { time: now, value: latestPrice + wobble };

    dataRef.current = [...dataRef.current.slice(-119), point];
    seriesRef.current.setData(dataRef.current);
  }, [latestPrice]);

  return (
    <div className="glass relative h-[320px] w-full overflow-hidden rounded-2xl p-2">
      <div className="pointer-events-none absolute inset-0 animate-pulseGlow bg-gradient-to-r from-emerald-400/5 via-cyan-400/10 to-emerald-400/5" />
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
