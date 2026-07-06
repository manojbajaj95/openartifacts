# OpenArtifacts

Share files and get feedback — markdown, images, HTML, mermaid, and more. One CLI command uploads to S3-compatible storage; the Next.js app renders artifacts and collects comments.

## Quick start

```bash
npm install
cp .env.example apps/web/.env.local
# Set DATABASE_URL and S3 credentials

docker compose up -d db   # local Postgres
npm run db:push           # apply schema (or: npm run db:migrate after db:generate)

npm run dev
```

Upload from another terminal:

```bash
npm run build
npm run openartifacts -- config --server http://localhost:3000 --viewer http://localhost:3000
npm run upload -- ./README.md
```

Or link locally: `npm link -w openartifacts`, then `openartifacts upload ./README.md`.

The CLI prints a shareable URL like `http://localhost:3000/a/abc123xyz`.

## Architecture

```
┌─────────┐     POST /api/uploads      ┌──────────────┐
│ openartifacts CLI │ ─────────────────► │  Next.js app │
└─────────┘                            │  (API+viewer)│
                                       └──────┬───────┘
                                              │
                              ┌───────────────┼───────────────┐
                              ▼               ▼               ▼
                          PostgreSQL       S3 bucket      /a/[id] renderer
                       (Drizzle ORM)   (file bytes)   markdown/mermaid/html
```

- **CLI** (`packages/cli`) — `openartifacts upload <file>` posts multipart form data to the server.
- **Web** (`apps/web`) — API routes, artifact viewer, feedback.
- **Shared** (`packages/shared`) — types and MIME helpers.

## For end users (no repo clone)

Publish the `openartifacts` npm package:

```bash
npm run publish:cli
# If you have 2FA enabled:
NPM_OTP=123456 npm run publish:cli
```

Then anyone can run:

```bash
npx openartifacts@latest upload ./design.md
```

The name `oa` on npm is taken by another package — don't use it.

## CLI (development)

```bash
openartifacts upload design.md
openartifacts config
openartifacts config --server URL
openartifacts init
```

Environment overrides:

- `OA_SERVER_URL` — API base URL (default: `https://openartifacts.dev`)
- `OA_VIEWER_URL` — printed link base (default: same as server)

## Self-hosting

See **[DEPLOY.md](./DEPLOY.md)** for Vercel + Supabase (recommended) or Docker.

1. Deploy `apps/web` (Vercel, Docker, Fly, etc.).
2. Create an S3-compatible bucket.
3. Set environment variables (see `.env.example`).
4. Point users' CLI at your URL: `openartifacts config --server https://artifacts.example.com`

### Supabase Storage

Create a bucket (e.g. `artifacts`) and generate S3 access keys in Project Settings → Storage.

```env
OA_S3_ENDPOINT=https://<project-ref>.supabase.co/storage/v1/s3
OA_S3_REGION=us-east-1
OA_S3_BUCKET=artifacts
OA_S3_ACCESS_KEY=...
OA_S3_SECRET_KEY=...
OA_VIEWER_URL=https://your-domain.com
```

### Docker

```bash
docker compose up -d db
npm run db:push
docker compose up --build web
```

### Database (Drizzle + PostgreSQL)

Schema lives in `apps/web/lib/db/schema.ts`.

```bash
npm run db:generate   # create SQL migrations from schema changes
npm run db:migrate    # apply migrations
npm run db:push       # push schema directly (dev)
npm run db:studio     # Drizzle Studio GUI
```

Set `DATABASE_URL` (Supabase Postgres works too — use the connection string from Project Settings → Database).

## Supported artifact types

| Extension / type | Rendered as |
|------------------|-------------|
| `.md` | Markdown (GFM) with fenced mermaid blocks |
| `.mmd`, `.mermaid` | Mermaid diagram |
| `.html`, `.htm` | Sandboxed iframe |
| Images | Inline image |
| `.txt`, other text | Monospace pre block |
| Other | Download link |

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/uploads` | Multipart upload (`file` field) |
| `GET` | `/api/artifacts/:id` | Metadata + presigned content URL |
| `GET` | `/api/artifacts/:id/content` | Proxy file bytes for viewer |
| `GET/POST` | `/api/artifacts/:id/feedback` | List or add comments |

## Monorepo scripts

All commands use `npm run` — no `npx` required.

```bash
npm run dev                          # Next.js dev server
npm run build                        # shared + cli + web
npm run db:push                      # sync schema to Postgres
npm run upload -- ./file.md          # upload via CLI (run build first)
npm run openartifacts -- config --server URL
```
