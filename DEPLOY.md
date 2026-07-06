# Deploy: Vercel + Supabase

## Overview

| Component | Service |
|-----------|---------|
| App (API + viewer) | [Vercel](https://vercel.com) — `apps/web` |
| Postgres | [Supabase](https://supabase.com) Database |
| File storage | Supabase Storage (S3-compatible API) |
| CLI | npm — `npx openartifacts@latest upload file.md` |

---

## 1. Supabase setup

### Database

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. **Project Settings → Database**:
   - Copy the **Transaction pooler** URI (port `6543`) → use as `DATABASE_URL` on Vercel.
   - Copy the **Direct connection** URI (port `5432`) → use locally for migrations only.

Transaction pooler example:

```
postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Storage (S3)

1. **Storage → New bucket** → name it `artifacts` (or your choice).
2. **Project Settings → Storage → S3 Access Keys** → create keys.
3. Note your project ref for the S3 endpoint:

```
https://[project-ref].supabase.co/storage/v1/s3
```

### Apply schema (once, from your laptop)

```bash
cp .env.example apps/web/.env.local
```

Set in `apps/web/.env.local`:

```env
# Direct connection (5432) — migrations only
DATABASE_URL=postgres://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres

OA_S3_ENDPOINT=https://[project-ref].supabase.co/storage/v1/s3
OA_S3_REGION=us-east-1
OA_S3_BUCKET=artifacts
OA_S3_ACCESS_KEY=...
OA_S3_SECRET_KEY=...
OA_VIEWER_URL=https://openartifacts.dev
```

```bash
npm install
npm run db:migrate
```

---

## 2. Vercel setup

1. [Import the repo](https://vercel.com/new) `manojbajaj95/openartifacts`.
2. **Root Directory:** `apps/web` (Vercel reads `apps/web/vercel.json` for monorepo install/build).
3. **Framework Preset:** Next.js (auto-detected).

### Environment variables

Add these in **Vercel → Project → Settings → Environment Variables** (Production + Preview):

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Supabase **transaction pooler** URI (port `6543`) |
| `OA_VIEWER_URL` | `https://openartifacts.dev` (your Vercel domain) |
| `OA_S3_ENDPOINT` | `https://[project-ref].supabase.co/storage/v1/s3` |
| `OA_S3_REGION` | `us-east-1` |
| `OA_S3_BUCKET` | `artifacts` |
| `OA_S3_ACCESS_KEY` | From Supabase S3 keys |
| `OA_S3_SECRET_KEY` | From Supabase S3 keys |

4. Deploy.

### Custom domain

**Vercel → Project → Settings → Domains** → add `openartifacts.dev`.

Update `OA_VIEWER_URL` to match. Update CLI defaults in `packages/shared/src/index.ts` if needed, then release a new CLI version.

---

## 3. Verify

```bash
npx openartifacts@latest config \
  --server https://openartifacts.dev \
  --viewer https://openartifacts.dev

npx openartifacts@latest upload ./README.md
```

Open the printed URL — you should see the artifact and be able to leave feedback.

---

## 4. Ongoing

| Task | How |
|------|-----|
| App deploys | Push/merge to `main` → Vercel auto-deploys |
| Schema changes | `npm run db:generate` → `npm run db:migrate` locally (direct URL) |
| CLI releases | Merge release-please PR → npm publish via GitHub Actions |

---

## Troubleshooting

**`DATABASE_URL is required`** — env var missing or not set for the right Vercel environment.

**DB connection errors on Vercel** — use the **pooler** URL (`6543`), not the direct URL (`5432`).

**S3 upload fails** — check bucket name, S3 keys, and that the endpoint includes `/storage/v1/s3`.

**Share links show wrong domain** — set `OA_VIEWER_URL` to your production URL and redeploy.
