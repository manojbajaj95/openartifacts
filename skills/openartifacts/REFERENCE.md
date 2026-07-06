# OpenArtifacts reference

Details for non-default setups and direct API use. For the standard share workflow, see [SKILL.md](SKILL.md).

## CLI commands

```bash
npx openartifacts@latest upload <file>            # upload, print share link
npx openartifacts@latest upload <file> -s <url>   # one-off server override
npx openartifacts@latest config                   # show active config
npx openartifacts@latest config --server <url> --viewer <url>   # save self-hosted config
npx openartifacts@latest init --server <url> --viewer <url>     # write default config
```

## Configuration resolution

Highest precedence first:

1. `-s/--server` flag (upload only)
2. `OA_SERVER_URL` / `OA_VIEWER_URL` environment variables
3. `~/.config/openartifacts/config.json` — only honored when it contains `"selfHosted": true` (written by `config`/`init`)
4. Built-in default: `https://oartifacts.vercel.app`

`server` is the API base the CLI uploads to; `viewer` is the host used in the printed share link. They are usually the same.

## Self-hosted instance

```bash
npx openartifacts@latest config --server https://artifacts.example.com --viewer https://artifacts.example.com
npx openartifacts@latest upload ./file.md
```

## Local development (this monorepo)

```bash
npm run build
npm run openartifacts -- config --server http://localhost:3000 --viewer http://localhost:3000
npm run upload -- ./path/to/file.md
```

## HTTP API

No authentication on the default deployment. Base URL is the server host.

### Upload

```bash
curl -F "file=@/path/to/design.md" https://oartifacts.vercel.app/api/uploads
```

Response:

```json
{
  "artifact": {
    "id": "abc123xyz",
    "filename": "design.md",
    "contentType": "text/markdown",
    "kind": "markdown",
    "size": 4096,
    "createdAt": "2026-07-06T21:00:00.000Z",
    "viewUrl": "https://oartifacts.vercel.app/a/abc123xyz"
  },
  "contentUrl": "/api/artifacts/abc123xyz/content"
}
```

Uploads over the size limit return `413` (default limit 10 MB; self-hosted servers can change it with `OA_MAX_UPLOAD_BYTES`).

### Read

- `GET /api/artifacts/{id}` — metadata plus feedback list
- `GET /api/artifacts/{id}/content` — raw file bytes; add `?download=1` to force attachment

### Feedback

- `GET /api/artifacts/{id}/feedback` — list comments (oldest first)
- `POST /api/artifacts/{id}/feedback` — add a comment

```bash
curl -X POST https://oartifacts.vercel.app/api/artifacts/abc123xyz/feedback \
     -H "Content-Type: application/json" \
     -d '{"author":"Alex","body":"Looks good — ship it."}'
```

POST body: `body` (required, ≤ 4000 chars), `author` (optional, ≤ 80 chars, defaults to `"Anonymous"`). Rate limit: 10 posts per minute per IP per artifact (`429` with `Retry-After`).

## Supported formats (full)

Artifact `kind` is derived from the file extension:

| Kind | Extensions | Viewer behavior |
|------|-----------|-----------------|
| markdown | `.md`, `.markdown` | GFM rendering, fenced `mermaid` blocks drawn as diagrams |
| mermaid | `.mmd`, `.mermaid` | Rendered diagram |
| html | `.html`, `.htm` | Sandboxed iframe live preview |
| image | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg` | Inline image |
| code | `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.py`, `.go`, `.rs`, `.rb`, `.java`, `.c`, `.cpp`, `.h`, `.cs`, `.sh`, `.sql`, `.css`, `.scss`, `.yaml`, `.yml`, `.toml`, `.xml`, `.ini`, `Dockerfile` | Syntax highlighting with line numbers |
| diff | `.patch`, `.diff` | Rendered diff |
| json | `.json` | Collapsible JSON tree |
| trace | `.jsonl` (or JSON arrays of `{label, ...}` objects) | Structured trace viewer |
| text | `.txt`, `.log`, `.csv` | Plain text with line numbers; ANSI logs render as terminal output |
| binary | anything else | Download link only |

## Web upload

Users can also drag-and-drop at the OpenArtifacts home page. Agents should prefer the CLI — it is scriptable and prints the link directly.
