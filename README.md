# منصة التطبيقات والمتابعة الفنية

Standalone React SPA for **applications + access credentials**, sharing the same NestJS API and JWT users as the notes overview app.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS (RTL)
- Hash router (`/#/apps`, `/#/apps/credentials`)
- Same backend: `overview_backend` (`/v1`)

## Who can sign in

Only **assistant** (مساعد) job title or **system admin**. Other accounts see an access-denied screen after login.

## Local development

```bash
# Terminal 1 — Nest API (sibling repo)
cd ../overview_backend && npm run start:dev

# Terminal 2 — this SPA (port 5181)
cp .env.example .env.local   # if needed
npm install
npm run dev
```

Open [http://localhost:5181](http://localhost:5181). Vite proxies `/v1` → `http://localhost:3000`.

Session tokens use separate storage keys (`apps-workspace.*`) so this SPA does not share browser session with the notes overview.

## Environment

| Variable | Notes |
| --- | --- |
| `VITE_API_MODE` | `nest` (recommended) |
| `VITE_API_BASE_URL` | Dev: `/v1` (proxy). Prod: same-origin `/v1` or absolute API URL |

## CORS (shared backend)

Add this frontend’s origin to `overview_backend` `CORS_ORIGINS` (comma-separated), e.g.:

```env
CORS_ORIGINS=http://localhost:5173,http://localhost:5181,http://127.0.0.1:5181,...
```

In production, include the public apps frontend origin (e.g. `https://apps.example.gov.eg`). Restart the API after changing origins.

## Deploy suggestion

Same pattern as the notes overview frontend:

1. `npm run build` → static files in `dist/`
2. Serve with nginx (see `nginx.conf` + `Dockerfile`)
3. Proxy `/v1/` to the Nest backend container/service
4. Ensure `CORS_ORIGINS` includes this site’s origin if the API is on a different host (same-origin `/v1` proxy avoids CORS)

Example compose service name: `apps-frontend` on a dedicated host/path, alongside the existing notes frontend and `backend`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on **5181** |
| `npm run build` | Production build |
| `npm run preview` | Preview `dist/` |
| `npm run lint` | Oxlint |
