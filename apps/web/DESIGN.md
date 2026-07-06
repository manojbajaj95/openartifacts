<!-- SEED: re-run $impeccable document once there's code to capture the actual tokens and components. -->

---
name: OpenArtifacts
description: Precise, quiet surfaces for sharing artifacts and collecting feedback — light and dark.
---

# Design System: OpenArtifacts

## 1. Overview

**Creative North Star: "The Review Console"**

OpenArtifacts is a developer-facing review surface: the artifact is the work, the UI is the frame. Visual language follows Linear's tight hierarchy and restrained color — fast to parse, never competing with markdown, diagrams, or HTML prototypes. Cool neutral canvases in both light and dark modes signal "tooling" without neon or glass theatrics.

The home page (`/`) may introduce the product in slightly larger type; artifact pages (`/a/[id]`) stay utilitarian. Both share one token set; emphasis shifts, not aesthetics. **One semantic token layer, two theme value sets** — components never hard-code light or dark colors.

**Key Characteristics:**

- Restrained color strategy: cool neutrals (light or dark) with a single blue accent on ≤10% of any screen
- Dual theme: light and dark share the same accent hue (~250° OKLCH), structure, and component vocabulary
- IBM Plex Sans for UI chrome; IBM Plex Mono for code and CLI snippets
- Flat surfaces separated by 1px borders and subtle tonal lifts — not drop shadows
- 8–12px corner radii; pills reserved for small tags only
- Responsive motion: state feedback and subtle reveals, never page-load choreography
- Uppercase eyebrows only where they label artifact kind or product name — never on every section
- Theme follows `prefers-color-scheme` by default; manual toggle available in site chrome

## 2. Colors

Cool console palette in both modes. One accent hue family (blue, ~250° OKLCH) carried sparingly. Warm sand, parchment, or cream neutrals are explicitly out of scope in **both** themes — light mode uses a cool off-white, not editorial warmth.

### Theme architecture

Semantic tokens (`background`, `foreground`, `card`, `border`, `input`, `primary`, `link`, `muted-foreground`, `destructive`, etc.) are the only colors components reference. Each token resolves to a light value on `:root` and a dark value under `.dark` (or the inverse — pick one default, mirror the other). Accent hues stay aligned across themes; only lightness and chroma shift for contrast.

**Default:** match `prefers-color-scheme`. **Override:** theme toggle in `SiteHeader` / `ArtifactToolbar`, persisted to `localStorage`, applied via class on `<html>` before first paint to avoid flash.

Set `color-scheme: light dark` on `:root` so native controls respect the active theme.

### Primary (shared across themes)

- **Signal Blue** `[to be resolved during implementation]`: Links, focus affordances, one eyebrow per view. Used on ≤10% of any screen. Slightly higher chroma in light mode for link legibility on off-white.
- **Action Blue** `[to be resolved during implementation]`: Primary button fill and border. Dark mode: desaturated for solid fills on dark canvas. Light mode: deep enough for white label at ≥4.5:1.

### Dark theme — neutrals

- **Canvas** `[to be resolved during implementation]`: Near-black cool base (~L 0.14–0.16, hue ~250). Subtle radial ambient washes (cool blue and violet at low opacity) — never neon, never glass.
- **Surface** `[to be resolved during implementation]`: Cards, viewer chrome, feedback panels — ~L 0.19–0.23, often at 88–92% mix with transparency over canvas.
- **Inset** `[to be resolved during implementation]`: Code blocks, inputs — darker than surface (~L 0.14–0.17).
- **Border** `[to be resolved during implementation]`: ~L 0.30–0.35, 1px dividers.
- **Ink** `[to be resolved during implementation]`: Primary text (~L 0.90–0.94).
- **Ink Muted** `[to be resolved during implementation]`: Meta, timestamps (~L 0.68–0.72). ≥4.5:1 against canvas.

### Light theme — neutrals

- **Canvas** `[to be resolved during implementation]`: Cool off-white (~L 0.97–0.99, chroma ≤0.008 toward hue 250). Not warm cream — chroma stays cool or zero. No ambient gradient required; a single flat canvas is fine.
- **Surface** `[to be resolved during implementation]`: Cards, viewer chrome — ~L 0.99–1.0 or canvas + border definition. Artifact frame may use a hairline tint (~L 0.96) to lift content without shadow.
- **Inset** `[to be resolved during implementation]`: Code blocks, inputs — ~L 0.94–0.96, slightly cooler than canvas.
- **Border** `[to be resolved during implementation]`: ~L 0.86–0.90, 1px dividers. Visible but quiet.
- **Ink** `[to be resolved during implementation]`: Primary text (~L 0.18–0.22, hue ~250).
- **Ink Muted** `[to be resolved during implementation]`: Meta, timestamps (~L 0.45–0.52). ≥4.5:1 against canvas and inset backgrounds.

### Tertiary (shared)

- **Danger Rose** `[to be resolved during implementation]`: Form errors and destructive feedback. Light mode: slightly deeper rose for contrast on off-white; dark mode: current soft rose on dark inset.

### Named Rules

**The One Accent Rule.** Blue accent appears on links, one eyebrow per view, and primary buttons — not on decorative borders, backgrounds, or section dividers. Same rule in both themes.

**The No Cream Rule.** Light backgrounds are cool off-white (chroma toward 250° or zero), never warm sand, parchment, or beige. Dark backgrounds stay cool near-black. Warmth is not how this product signals friendliness.

**The Restrained Rule.** Tinted neutrals carry the surface; one accent hue family does the signaling work. If a screen feels colorful, the accent coverage is too high.

**The Theme Parity Rule.** Every semantic token exists in both themes. No component branches on `isDark` for color — only the token layer switches. Hover, focus, disabled, and error states must be defined per theme.

**The Artifact Contrast Rule.** The artifact viewer frame is the highest-contrast region on artifact pages in **both** themes — slightly lifted surface mix in dark mode, hairline tint + border in light mode. Chrome stays thinner than the artifact.

## 3. Typography

**Display Font:** IBM Plex Sans `[font pairing to be chosen at implementation]`  
**Body Font:** IBM Plex Sans (same stack)  
**Mono Font:** IBM Plex Mono (with SF Mono, ui-monospace fallbacks)

**Character:** Technical and calm — humanist sans with enough warmth for long reading, mono for anything the CLI prints. Terminal-to-browser continuity: the same voice from `npx upload` to the opened link.

### Hierarchy

- **Display** (600, fixed rem scale ~2–2.25rem, 1.1–1.12 line-height, letter-spacing ≥ -0.04em): Home hero only. `text-wrap: balance`.
- **Title** (600, ~1.5–1.625rem, 1.2 line-height): Artifact filename; `word-break: break-word` for long names.
- **Body** (400, 1rem / 1.125rem lede, 1.5 line-height): Descriptions and feedback copy; cap prose near 65–75ch in markdown viewer.
- **Label** (500, 0.72–0.75rem, 0.1–0.12em tracking, uppercase): Eyebrows for product name or artifact kind — one per header block.
- **Mono** (400, ~0.8125rem): CLI commands, `pre`, and inline `code`.

Product surfaces use a **fixed rem scale**, not fluid clamp headings — users view at consistent DPI; sidebars and toolbars should not shrink display type.

### Named Rules

**The Eyebrow Sparingly Rule.** At most one uppercase tracked label per major header. No section-index eyebrows (01 / ABOUT / PROCESS).

**The Mono Continuity Rule.** Anything the CLI prints or the user copies appears in Plex Mono — never a second sans for code.

## 4. Elevation

Flat by default in both themes. Depth is tonal, not shadowed. Surfaces lift via `color-mix` tints over the canvas — dark mode may use subtle radial washes; light mode relies on border + hairline surface tint. Borders (`1px solid`) define edges; wide soft `box-shadow` is not used on cards or buttons in either theme.

Responsive motion may add subtle opacity or transform feedback on hover/focus — never structural shadow stacks. Theme switch itself: instant or ≤150ms crossfade on `background-color` / `color` only — no layout animation.

### Named Rules

**The Flat Frame Rule.** Viewer and feedback panels use border + tint only. If depth is needed, increase border contrast or surface mix — never add a 16px blur shadow alongside a 1px border.

## 5. Components

Components will be defined when the design is applied to the codebase. Direction until then:

### Theme toggle

- **Placement:** `SiteHeader` and `ArtifactToolbar` — icon button (sun/moon or system/auto), same position in both chrome variants.
- **States:** light, dark, system (follows `prefers-color-scheme`).
- **Behavior:** persist choice; apply class on `<html>` before paint; `aria-label` and `title` describe current mode and next action.
- **Focus:** same ring vocabulary as other toolbar controls.

### Buttons

- **Shape:** 8px radius; compact height (~32px default)
- **Primary:** Action Blue fill, white label, 150ms state transitions
- **Secondary / Ghost:** Border + tint only; no shadow decoration
- **Disabled:** 60% opacity, `cursor: not-allowed`

### Cards / Containers

- **Corner Style:** 12px max on hero command card and artifact viewer
- **Background:** Surface at 90–92% mix with transparency
- **Border:** 1px border token
- **Internal Padding:** 1.25rem standard

### Inputs / Fields

- **Style:** Full-width, inset background, 1px border, 8px radius
- **Focus:** Border shift toward accent + 2px ring at 40% opacity
- **Placeholder:** Must meet muted ink contrast on inset background

### Navigation

- Site pages (`/`, `/about`, `/api`): compact wordmark header, text links, GitHub in muted ink with accent hover, theme toggle at trailing edge.
- Artifact pages (`/a/[id]`): sticky ~44px toolbar with back/wordmark, truncated filename, mono kind badge, copy/share controls, theme toggle, overflow menu — no full marketing header.

### Feedback

- Bordered rows, ~10px radius, surface tint background
- Empty state: dashed border, centered copy — teaches the interface, not "nothing here"

## 6. Do's and Don'ts

### Do:

- **Do** keep the artifact viewer the brightest, highest-contrast region on artifact pages — in both light and dark.
- **Do** use IBM Plex Mono for CLI examples and code fences so terminal → browser feels continuous.
- **Do** respect `prefers-reduced-motion` — crossfade or instant transition as the reduce alternative.
- **Do** use `color-scheme: light dark` on `:root` and match it to the active theme class.
- **Do** ship hover, focus, active, disabled, and error states on every interactive control — per theme.
- **Do** verify contrast in both themes before shipping (body ≥4.5:1, large text ≥3:1, placeholders ≥4.5:1).

### Don't:

- **Don't** use SaaS landing clichés — hero metrics, gradient text, eyebrow kickers on every section, or identical icon-card grids.
- **Don't** pair `border: 1px solid` with wide soft drop shadows on the same element.
- **Don't** exceed 12px radius on cards or panels (pills reserved for small tags/buttons).
- **Don't** add glassmorphism, neon gradients, or purple "AI tool" ambient lighting — dark mode washes stay subtle; light mode skips them entirely.
- **Don't** use warm cream editorial backgrounds in light mode — cool off-white only.
- **Don't** let chrome compete with the artifact being reviewed.
- **Don't** use decorative motion that doesn't convey state — no orchestrated page-load sequences on product surfaces.
- **Don't** ship light theme as an afterthought — if a token works in dark only, it is incomplete.
- **Don't** invert logos or icons independently of the token layer; use `currentColor` and semantic foreground tokens.
