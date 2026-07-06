---
name: openartifacts
description: >-
  Upload a local file as a rendered artifact with a shareable review link, and
  fetch reviewer comments on it. Use when the user wants to share a spec,
  design doc, diagram, prototype, or image with a person or team for feedback;
  send a review link in Slack, email, or a PR; check comments on a shared
  artifact; or mentions OpenArtifacts or "share this artifact."
---

# OpenArtifacts

OpenArtifacts turns a local file into a browser-rendered artifact with a stable share URL and a comment thread. No account is needed to upload, view, or comment.

**Default host:** `https://oartifacts.vercel.app`. Self-hosted and local-dev setups: see [REFERENCE.md](REFERENCE.md).

## Quick start

```bash
npx openartifacts@latest upload ./design.md
```

Output ends with the share link — that is the line to return to the user:

```
Uploaded design.md
kind: markdown
size: 4.2 KB

Share link:
https://oartifacts.vercel.app/a/abc123xyz
```

## Share workflow

Copy this checklist and track progress:

```
Share progress:
- [ ] Confirm the file exists and is safe to share (no secrets, under 10 MB)
- [ ] Run the upload yourself (don't ask the user to)
- [ ] Return the share link (the URL after "Share link:")
- [ ] Tell the user what reviewers will see and how comments work
```

1. **Pick the file.** Prefer the artifact already created or referenced in the conversation. If several files matter, upload each and return one link per file.
2. **Upload** with the quick-start command. Use descriptive filenames (`checkout-flow-spec.md`) — the filename appears in the viewer header.
3. **Hand off the link.** Suggest where to paste it (Slack, email, PR, ticket) and note that reviewers open the link and comment on the page with no login.

Example response:

> Uploaded `design.md`. Share this link for review:
> https://oartifacts.vercel.app/a/abc123xyz
>
> Reviewers will see rendered markdown (mermaid blocks included) and can leave comments right on the page — no account needed.

## Check feedback

The artifact id is the last path segment of the share URL (`/a/<id>`). Fetch comments with:

```bash
curl -s https://oartifacts.vercel.app/api/artifacts/<id>/feedback
```

Returns `{"feedback": [{"author", "body", "createdAt", ...}]}` sorted oldest-first. Summarize new comments for the user instead of dumping raw JSON. Posting replies via API: see [REFERENCE.md](REFERENCE.md).

## What renders

| File type | Viewer behavior |
|-----------|-----------------|
| `.md` | Markdown (GFM) with fenced mermaid blocks |
| `.mmd`, `.mermaid` | Mermaid diagram |
| `.html` | Sandboxed live preview |
| Images (png, jpg, gif, webp, svg) | Inline image |
| Code (`.ts`, `.py`, `.go`, `.sql`, …) | Syntax-highlighted source |
| `.patch`, `.diff` | Rendered diff |
| `.json`, `.jsonl` | JSON tree / trace viewer |
| `.txt`, `.log`, `.csv` | Plain text; ANSI logs render as terminal output |
| Everything else | Download link only |

Full list in [REFERENCE.md](REFERENCE.md).

## When not to use

- **Secrets** — never upload `.env` files, keys, tokens, or private customer data. Skim the file first if unsure.
- **Source code review** — use a PR or patch workflow; OpenArtifacts is for rendered deliverables.
- **Live collaboration** — links are read-only views with async comments, not co-editing.
- **Files over 10 MB** — the server rejects them.

## Troubleshooting

- **Upload fails / server unreachable** — check active config with `npx openartifacts@latest config`; the user may be on a self-hosted instance ([REFERENCE.md](REFERENCE.md)).
- **Wrong host in printed link** — `OA_SERVER_URL` / `OA_VIEWER_URL` env vars override config; unset or fix them.
