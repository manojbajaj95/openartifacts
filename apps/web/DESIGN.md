---
name: OpenArtifacts
description: Precise, quiet surfaces for sharing artifacts and collecting feedback.
colors:
  canvas: "#0b0d10"
  surface: "#14181f"
  surface-inset: "#0a0e14"
  border: "#2a3140"
  ink: "#e8ecf4"
  ink-muted: "#9aa6bd"
  accent: "#6ea8ff"
  accent-strong: "#3d6fbf"
  danger: "#ff7b7b"
  ambient-blue: "#1a2744"
  ambient-violet: "#2a1838"
typography:
  display:
    fontFamily: "\"IBM Plex Sans\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "\"IBM Plex Sans\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "\"IBM Plex Sans\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "\"IBM Plex Sans\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.12em"
  mono:
    fontFamily: "\"IBM Plex Mono\", \"SF Mono\", ui-monospace, monospace"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "2rem"
  xl: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.accent-strong}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0.55rem 1rem"
  button-primary-disabled:
    backgroundColor: "{colors.accent-strong}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0.55rem 1rem"
  input-field:
    backgroundColor: "{colors.surface-inset}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.65rem 0.8rem"
  card-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "1.25rem"
---

# Design System: OpenArtifacts

## 1. Overview

**Creative North Star: "The Review Console"**

OpenArtifacts is a developer-facing review surface: the artifact is the work, the UI is the frame. Visual language follows Linear's tight hierarchy and restrained color — fast to parse, never competing with markdown, diagrams, or HTML prototypes. Dark canvas with cool ambient washes signals "tooling" without neon or glass theatrics.

The home page (`/`) may introduce the product in slightly larger type; artifact pages (`/a/[id]`) stay utilitarian. Both share one token set; emphasis shifts, not aesthetics.

**Key Characteristics:**

- Dark, cool-neutral canvas with a single blue accent used sparingly
- IBM Plex Sans for UI chrome; Plex Mono for code and CLI snippets
- Flat surfaces separated by 1px borders and subtle `color-mix` tints — not drop shadows
- 8–12px corner radii; nothing pill-shaped except tags if added later
- Uppercase eyebrows only where they label artifact kind or product name — never on every section

## 2. Colors

A cool dark console palette: near-black base, slate borders, soft blue accent for links and primary actions.

### Primary

- **Signal Blue** (`#6ea8ff`): Links, eyebrows, focus affordances. Used on ≤10% of any screen.
- **Action Blue** (`#3d6fbf`): Primary button fill and border. Slightly desaturated for solid fills.

### Neutral

- **Canvas** (`#0b0d10`): Page background; radial ambient washes (`#1a2744`, `#2a1838`) sit on top at low opacity.
- **Surface** (`#14181f`): Cards, viewer chrome, feedback panels — often at 88–92% mix with transparency.
- **Inset** (`#0a0e14`): Code blocks, inputs, nested monospace areas.
- **Border** (`#2a3140`): 1px dividers on cards, viewer, list items, tables.
- **Ink** (`#e8ecf4`): Primary text on dark surfaces.
- **Ink Muted** (`#9aa6bd`): Meta lines, ledes, timestamps, empty states. Must stay readable on canvas (≥4.5:1).

### Tertiary

- **Danger Rose** (`#ff7b7b`): Form errors and destructive feedback only.

### Named Rules

**The One Accent Rule.** Blue accent appears on links, one eyebrow per view, and primary buttons — not on decorative borders, backgrounds, or section dividers.

**The No Cream Rule.** Body backgrounds stay cool and dark. Warm sand, parchment, or cream neutrals are out of scope.

## 3. Typography

**Display Font:** IBM Plex Sans (with Segoe UI, system-ui fallbacks)  
**Body Font:** IBM Plex Sans (same stack)  
**Mono Font:** IBM Plex Mono (with SF Mono, ui-monospace fallbacks)

**Character:** Technical and calm — humanist sans with enough warmth for long reading, mono for anything the CLI prints.

### Hierarchy

- **Display** (600, `clamp(2rem, 5vw, 3rem)`, 1.1): Home hero only. `text-wrap: balance` on headings.
- **Title** (600, `clamp(1.5rem, 4vw, 2.25rem)`, 1.2): Artifact filename; `word-break: break-word` for long names.
- **Body** (400, 1rem / 1.125rem lede, 1.5 line-height): Descriptions and feedback copy; cap prose near 65–75ch in markdown viewer.
- **Label** (500, 0.72–0.75rem, 0.1–0.12em tracking, uppercase): Eyebrows for product name or artifact kind — one per header block.
- **Mono** (400, ~0.9rem): CLI commands, `pre`, and inline `code`.

### Named Rules

**The Eyebrow Sparingly Rule.** At most one uppercase tracked label per major header. No section-index eyebrows (01 / ABOUT / PROCESS).

## 4. Elevation

Depth is tonal, not shadowed. Surfaces lift via `color-mix(in srgb, var(--surface) 88–92%, transparent)` over the canvas gradient. Borders (`1px solid var(--border)`) define edges; wide soft `box-shadow` is not used on cards or buttons.

### Named Rules

**The Flat Frame Rule.** Viewer and feedback panels use border + tint only. If depth is needed, increase border contrast or surface mix — never add a 16px blur shadow alongside a 1px border.

## 5. Components

### Buttons

- **Shape:** 8px radius (`rounded.sm`)
- **Primary:** `accent-strong` fill and border, white label, horizontal padding `0.55rem 1rem`
- **Disabled:** 60% opacity, `cursor: not-allowed`
- **Hover / Focus:** No bounce; prefer border or background shift only when added

### Cards / Containers

- **Corner Style:** 12px on hero command card and artifact viewer
- **Background:** Surface at 90–92% mix with transparency
- **Border:** 1px `border` token
- **Internal Padding:** 1.25rem standard; code blocks inside use inset background

### Inputs / Fields

- **Style:** Full-width, inset background, 1px border, 8px radius
- **Focus:** Border shift toward accent (to be standardized on focus-visible)
- **Placeholder:** Must meet muted ink contrast on inset background

### Feedback list items

- **Style:** Bordered rows, 10px radius, surface tint background
- **Meta:** Author strong, timestamp in muted ink at 0.85rem

### Markdown viewer

- **Tables:** Full width, collapsed borders using border token
- **Pre blocks:** Inset background, 8px radius, horizontal scroll

### Navigation

- Not present yet; when added, prefer text links in accent color without pill chrome.

## 6. Do's and Don'ts

### Do:

- **Do** keep the artifact viewer the brightest, highest-contrast region on artifact pages.
- **Do** use IBM Plex Mono for CLI examples and code fences so terminal → browser feels continuous.
- **Do** respect `prefers-reduced-motion` on any future transitions.
- **Do** use `color-scheme: light dark` at `:root` for native form controls.

### Don't:

- **Don't** use SaaS landing clichés — hero metrics, gradient text, eyebrow kickers on every section, or identical icon-card grids.
- **Don't** pair `border: 1px solid` with wide soft drop shadows on the same element.
- **Don't** exceed 12px radius on cards or panels (pills reserved for small tags/buttons).
- **Don't** add glassmorphism, neon gradients, or purple "AI tool" ambient lighting beyond the existing subtle radial washes.
- **Don't** use warm cream editorial backgrounds that fight artifact content.
