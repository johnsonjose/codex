# Johnson Jose — Brand + Hyperliquid Paper Trading

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment Variables

Create `.env.local`:

```bash
HYPERLIQUID_INFO_URL=https://api.hyperliquid.xyz/info
NEXT_PUBLIC_HYPERLIQUID_WS_URL=wss://api.hyperliquid.xyz/ws
```

## Production Build

```bash
npm run build
npm run start
```

## Vercel Deployment

1. Push repo to GitHub.
2. Import into Vercel.
3. Configure environment variables:
   - `HYPERLIQUID_INFO_URL`
   - `NEXT_PUBLIC_HYPERLIQUID_WS_URL`
4. Deploy.

