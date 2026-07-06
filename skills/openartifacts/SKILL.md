---
name: openartifacts
description: >-
  Upload and share files as rendered artifacts with a feedback link. Use when
  the user wants to share a spec, design doc, diagram, HTML prototype, or image
  with a person or team; send a review link in Slack, email, or a PR; collect
  feedback on a deliverable; or asks to use OpenArtifacts, openartifacts, or
  "share this artifact."
---

# OpenArtifacts

OpenArtifacts turns a local file into a browser-rendered artifact with a shareable URL and a comment thread. No account required for upload or review.

**Default host:** `https://oartifacts.vercel.app` (override with config or env vars).

## When to use

Use OpenArtifacts when the deliverable is a **file** and the goal is **async review**:

- Share a markdown spec, RFC, or design doc with a teammate
- Send a mermaid diagram or HTML prototype for feedback
- Drop a link in Slack, email, or a PR instead of pasting long content
- Collect comments on work-in-progress without Notion, Figma, or a doc platform

## When not to use

- **Secrets or credentials** — never upload `.env`, keys, tokens, or private customer data
- **Source code review** — use a PR or patch; OpenArtifacts is for rendered deliverables
- **Live collaboration** — links are read-only views with async comments, not co-editing
- **Large binaries** — unsupported formats only get a download link; prefer files under ~10 MB

## Share workflow

Copy this checklist and track progress:

```
Share progress:
- [ ] Confirm the file exists and is safe to share (no secrets)
- [ ] Upload the file
- [ ] Give the user the viewer URL
- [ ] Suggest where to paste it (Slack, email, PR) and what reviewers will see
```

### Step 1: Pick the file

Prefer the artifact the user already created or referenced in the conversation — e.g. `design.md`, `architecture.mmd`, `prototype.html`, `screenshot.png`.

If multiple files matter, upload each one separately and return multiple links.

### Step 2: Upload

**End users (any project):**

```bash
npx openartifacts@latest upload ./path/to/file.md
```

The command prints one URL on stdout, e.g. `https://oartifacts.vercel.app/a/abc123xyz`. **Return that URL to the user.**

**This monorepo (local dev):**

```bash
npm run build
npm run openartifacts -- config --server http://localhost:3000 --viewer http://localhost:3000
npm run upload -- ./path/to/file.md
```

**Self-hosted instance:**

```bash
npx openartifacts@latest config --server https://artifacts.example.com --viewer https://artifacts.example.com
npx openartifacts@latest upload ./path/to/file.md
```

Environment overrides (take precedence over config file):

- `OA_SERVER_URL` — API base URL
- `OA_VIEWER_URL` — URL printed in links

Config file: `~/.config/openartifacts/config.json`

### Step 3: Tell the user what to do with the link

Give them:

1. The **viewer URL** (from upload stdout)
2. **What renders** — see table below
3. **Where to paste it** — Slack thread, email, PR comment, Linear ticket, etc.
4. **How feedback works** — reviewers open the link and leave comments on the page; no login required

Example response:

> Uploaded `design.md`. Share this link with your team:
> https://oartifacts.vercel.app/a/abc123xyz
>
> They'll see rendered markdown (including mermaid blocks). Comments go on the artifact page.

## Supported formats

| File type | Viewer behavior |
|-----------|-----------------|
| `.md` | Markdown (GFM) with fenced mermaid |
| `.mmd`, `.mermaid` | Mermaid diagram |
| `.html`, `.htm` | Sandboxed iframe preview |
| Images (png, jpg, gif, webp, svg) | Inline image |
| `.txt` and other text | Monospace pre block |
| Everything else | Download link only |

## Agent tips

- **Run the upload yourself** — do not tell the user to run the command unless upload fails or they prefer to run it locally.
- **Prefer links over pasting** — if the artifact is long (spec, doc, diagram), upload and share the URL instead of dumping content into chat.
- **One link per artifact** — each upload gets a unique `/a/[id]` URL; links are stable and do not expire by default.
- **Name the file clearly** — the original filename appears in the viewer header; use descriptive names like `checkout-flow-spec.md`.
- **Check upload errors** — if the server is unreachable, verify config (`npx openartifacts@latest config`) or ask whether they use a self-hosted instance.

## Optional: web upload

If the user prefers a browser, they can drag-and-drop at the OpenArtifacts home page. Agents should still prefer the CLI — it is scriptable and returns the link directly.
