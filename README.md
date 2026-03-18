# 🏀 Sharpshooter — March Madness 2026

Fantasy league live scoreboard with ESPN data, insights, and head-to-head analytics.

---

## Deployment Guide

### Step 1 — Deploy the ESPN Proxy (Cloudflare Worker)

The app needs a proxy to fetch live ESPN data without CORS errors.

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign up free
2. Click **Workers & Pages** → **Create** → **Create Worker**
3. Delete all the default code in the editor
4. Paste in the contents of `espn-proxy-worker.js` (in this repo)
5. Click **Deploy**
6. Copy your worker URL — it looks like: `https://sharpshooter-proxy.YOUR-NAME.workers.dev`

---

### Step 2 — Update the proxy URL in the app

Open `src/App.jsx` and find the two lines that say:

```
https://YOUR-WORKER.workers.dev/scoreboard
https://YOUR-WORKER.workers.dev/summary
```

Replace `YOUR-WORKER.workers.dev` with your actual worker URL from Step 1.

Example — if your worker URL is `sharpshooter-proxy.bob.workers.dev`, change it to:
```
https://sharpshooter-proxy.bob.workers.dev/scoreboard
https://sharpshooter-proxy.bob.workers.dev/summary
```

Commit and push this change to GitHub.

---

### Step 3 — Deploy the dashboard (Cloudflare Pages)

1. In Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages**
2. Click **Connect to Git** → authorize GitHub → select this repo
3. Set build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**

Cloudflare will build and deploy the app. You'll get a URL like:
`https://sharpshooter.pages.dev`

**Share that URL with your league.**

Every time you push a change to GitHub, Cloudflare auto-redeploys in about 30 seconds.

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## File Structure

```
sharpshooter/
├── index.html              # HTML entry point
├── vite.config.js          # Vite config
├── package.json
├── espn-proxy-worker.js    # Cloudflare Worker (deploy separately)
└── src/
    ├── main.jsx            # React entry point
    └── App.jsx             # Full app — edit rosters/projections here
```

---

## Updating Rosters or Projections

All roster data lives at the top of `src/App.jsx` in the `ROSTERS` object.
Each player has: `name`, `school`, `espnId`, `projected`, `seed`, `region`.

To find a player's ESPN ID, search for them on ESPN and grab the numeric ID from the URL.
