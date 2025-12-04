
# Schale Dashboard

A polished Blue Archive inspired dashboard with glass UI, animated widgets, and an Arona AI assistant backed by an Express proxy for Google Gemini.

## Tech Stack

- **Frontend:** React 19 + Vite, Tailwind CDN, TypeScript, componentized under `src/`
- **Backend:** Express 4 + Zod validation + Undici fetch, located in `server/`
- **Build tooling:** Vite for SPA, standalone TypeScript build for the API

```
project-root/
??? src/                     # ?? React ?????
?   ??? components/          # ????
?   ??? hooks/               # ??? hooks
?   ??? features/            # ???????/?????
?   ??? services/            # ?????????
?   ??? utils/               # ????
?
??? server/                  # ?? Express + TypeScript ???
?
??? dist/                    # ???????npm run build?
?
??? dist-server/             # ???????npm run build:server?

```

## Environment Variables

### Local Development
Copy `.env.example` to `.env.local` and fill in your API key:

```bash
cp .env.example .env.local
# edit .env.local
GEMINI_API_KEY=your_key_here
```

### Production
Production uses `ecosystem.config.cjs` for configuration. See [DEPLOY_LINUX.md](./DEPLOY_LINUX.md).

## NPM Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Run Vite + Express together (uses `concurrently`) |
| `npm run dev:client` | Frontend only dev server (Vite) |
| `npm run dev:server` | Backend only dev server (tsx watch) |
| `npm run build` | Build both client and server for production |
| `npm run build:client` | Build the React app to `dist/` |
| `npm run build:server` | Type-check & emit Express API into `dist-server/` |
| `npm run preview` | Preview static frontend |
| `npm run start:server` | Run compiled Express server (expects `dist-server/`) |
| `npm run commit` | Interactive git commit helper |

## Windows Local Testing Workflow

1. **Install dependencies**: `npm install`
2. **Configure env**: 
    - Copy `.env.example` to `.env.local`
    - Edit `.env.local` and fill in your `GEMINI_API_KEY`
3. **Run both tiers**: `npm run dev`
    - Vite serves the SPA on `http://localhost:3000`
    - Express listens on `http://localhost:4000` and is proxied via Vite (`/api/*`)
4. **Verify**: open the site, ensure weather/location permissions are granted, and send an Arona prompt to confirm backend connectivity.

## Production Build & Run

```bash
npm install
npm run build                   # builds both dist/ and dist-server/
# serve the frontend via nginx (see below) or any static host
npm run start:server            # starts Express on $SERVER_PORT (default 4000)
```

The backend is stateless; deploy it as a service (PM2/systemd/Docker) and point `/api` traffic to it.

## Linux + Nginx Deployment Plan

See [DEPLOY_LINUX.md](./DEPLOY_LINUX.md) for detailed instructions.

## Operational Notes

- **Weather widget** falls back to Tokyo coordinates if the browser blocks geolocation.
- **Music widget** keeps uploads client-side only; refreshing clears the track.
- **Wallpaper uploads** are persisted to `localStorage`; large files trigger a graceful warning and stay for the current session only.
- **Arona assistant** requires the backend to have `GEMINI_API_KEY`. The frontend automatically warns users if the `/api/arona/health` check fails.
