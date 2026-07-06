# Product

## Register

product

## Users

Developers, designers, and technical collaborators who need to share work-in-progress artifacts — markdown specs, diagrams, HTML prototypes, images — and collect lightweight feedback without spinning up a full review stack. They work in terminals and browsers, often under time pressure, and value speed and clarity over ceremony.

The landing page (`/`) speaks to evaluators and first-time uploaders; the artifact viewer (`/a/[id]`) is where repeat use happens. Treat the viewer as the primary product surface; the home page is a concise brand entry point.

## Product Purpose

OpenArtifacts lets anyone upload a file via CLI and get a shareable link. The web app renders supported formats (markdown, mermaid, HTML, images, text) and hosts a simple feedback thread per artifact. Success means: upload → link → readable render → comment, with minimal friction and no account required for basic flows.

## Brand Personality

Precise, quiet, trustworthy. A dev tool that stays out of the way — tight hierarchy, restrained color, no performance theater. Reference feel: Linear (focused typography, fast surfaces, opinionated restraint).

## Anti-references

- SaaS landing clichés: hero metrics, gradient text, eyebrow kickers on every section, identical icon-card grids
- Decorative glass, neon gradients, or "AI workflow tool" aesthetics
- Warm cream editorial backgrounds that compete with artifact content
- Chrome that competes with the artifact being reviewed

## Design Principles

1. **Content is the UI** — The artifact is the hero; chrome stays thin and consistent so markdown, diagrams, and HTML read clearly.
2. **Terminal-to-browser continuity** — CLI output and the web viewer should feel like one product: same voice, same density, no marketing gap between `npx upload` and the opened link.
3. **Quiet confidence** — Show capability through rendering quality and copy precision, not feature billboards or social proof widgets.
4. **Split register, shared system** — Home can be slightly more expressive; viewer pages stay utilitarian. One type and color system, different emphasis levels.
5. **Fast paths** — Fewer clicks to feedback; obvious upload instructions; no dead ends on empty states.

## Accessibility & Inclusion

Dev-first baseline: WCAG 2.2 AA for contrast, keyboard access on interactive controls, and `prefers-reduced-motion` respected on any motion. No special accommodations beyond that unless user needs are surfaced later.
