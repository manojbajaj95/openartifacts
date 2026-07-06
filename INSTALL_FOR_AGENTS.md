# Install OpenArtifacts for agents

Instructions for coding agents (Cursor, Claude Code, Codex, and other skills-aware agents). If a human pointed you at this file, follow the steps below, then confirm to the user what was installed.

## 1. Install the skill

```bash
npx skills add manojbajaj95/openartifacts -g -y -a universal
```

This installs the `openartifacts` skill globally via the [skills](https://www.npmjs.com/package/skills) CLI into the shared `~/.agents/skills/` directory, which Cursor, Amp, Codex, and most other agents read. Drop `-g` to install for the current project only. If your agent uses its own skills directory instead (for example Claude Code), name it explicitly: `-a claude-code`.

**Known upstream issue** — running without `-a` (plain `-g -y`) may print `✗ openartifacts → PromptScript: PromptScript does not support global skill installation`. This is a cosmetic bug in the skills CLI (PromptScript is a project-only target); the skill still installs correctly for every other agent, so the line can be ignored.

**Manual fallback** — if the `skills` CLI is unavailable, copy the skill folder directly:

```bash
git clone --depth 1 https://github.com/manojbajaj95/openartifacts /tmp/openartifacts
cp -R /tmp/openartifacts/skills/openartifacts ~/.cursor/skills/   # or .claude/skills/, .agents/skills/
```

## 2. Verify the CLI

No separate install is needed — `npx` fetches the published package on demand:

```bash
npx openartifacts@latest --version
```

The CLI talks to the default host `https://oartifacts.vercel.app` out of the box. For a self-hosted instance, configure once:

```bash
npx openartifacts@latest config --server https://artifacts.example.com --viewer https://artifacts.example.com
```

## 3. Use it

The skill teaches the full workflow, but the short version:

```bash
npx openartifacts@latest upload ./design.md
```

- The output ends with a share link (`https://oartifacts.vercel.app/a/<id>`) — return it to the user so they can send it to reviewers.
- Reviewers open the link and comment on the page; no account needed.
- Fetch comments later with `GET /api/artifacts/<id>/feedback`.

Full workflow and API details live in [skills/openartifacts/SKILL.md](skills/openartifacts/SKILL.md) and [skills/openartifacts/REFERENCE.md](skills/openartifacts/REFERENCE.md).

## What to tell the user when done

1. The `openartifacts` skill is installed (globally or per-project).
2. They can now ask you to "share this file for feedback" and you will upload it and hand back a review link.
3. Uploads go to the public default host unless a self-hosted server is configured — remind them not to share secrets.
