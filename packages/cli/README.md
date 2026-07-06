# openartifacts

Upload a file, get a shareable link. No install required.

## Quick start

Requires [Node.js 20+](https://nodejs.org/).

```bash
npx openartifacts@latest upload ./design.md
# → https://openartifacts.dev/a/abc123xyz
```

## Commands

```bash
npx openartifacts@latest upload ./file.md
npx openartifacts@latest config
npx openartifacts@latest config --server https://artifacts.example.com
```

Config: `~/.config/openartifacts/config.json`

Environment variables: `OA_SERVER_URL`, `OA_VIEWER_URL`
