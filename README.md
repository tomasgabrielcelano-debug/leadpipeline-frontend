# LeadPipeline Frontend (Vite + React)

This is the **internal UI** for LeadPipeline (conversations, details, etc.).  
In production it should be deployed to **Cloudflare Pages** (or any static host) and talk to the API running on your VPS.

## 1) Configure the API URL

This frontend reads the API base URL from an environment variable:

- **VITE_API_BASE_URL** (example: `https://api.lead.techxto.ar`)

If `VITE_API_BASE_URL` is empty, the app uses **relative URLs** (useful for local dev with the Vite proxy).

Create a local `.env` (or copy from `.env.example`) when developing.

## 2) Local development

```bash
npm install
npm run dev
```

The dev server uses a proxy so `/api/*` requests go to `http://localhost:5081` (see `vite.config.ts`).

## 3) Cloudflare Pages (production)

### Build settings
- **Build command:** `npm ci && npm run build`
- **Build output directory:** `dist`

### Environment variables (Pages → Settings → Environment variables)
Set:
- `VITE_API_BASE_URL = https://api.lead.techxto.ar`
- `VITE_ENABLE_WEBHOOK_TESTER = false` (recommended)

### SPA routing
This repo includes `public/_redirects` so refresh / deep-links work (SPA fallback to `index.html`).

## 4) Security note (important)
The **Webhook tester** UI is meant for local testing only.  
Do **not** enable it in production unless you fully understand the risk (it encourages typing secrets in the browser).
