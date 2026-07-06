# Agent context

## Sharing artifacts

When the user wants to share a file with a person or team for review, read **[skills/openartifacts/SKILL.md](skills/openartifacts/SKILL.md)** and upload via `npx openartifacts@latest upload <file>`.

## Design Context

Impeccable design context for the web app lives in **`apps/web/`**:

- **[PRODUCT.md](apps/web/PRODUCT.md)** — register (`product`, with brand home + product viewer split), users, personality (precise · quiet · trustworthy), anti-references, and strategic principles.
- **[DESIGN.md](apps/web/DESIGN.md)** — visual tokens, typography, components, and do's/don'ts ("The Review Console" north star).
- **Live mode** — configured at `apps/web/.impeccable/live/config.json` (Next.js App Router).

Run Impeccable commands from `apps/web` or with `--target apps/web`.
