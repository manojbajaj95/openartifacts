/** Theme tokens for sandboxed rich surfaces (markdown, diff, terminal). */

export interface Accent {
  bg: string;
  text: string;
  border: string;
}

export interface Palette {
  bg: string;
  panel: string;
  surface: string;
  text: string;
  muted: string;
  faint: string;
  border: string;
  border2: string;
  hover: string;
  info: Accent;
  success: Accent;
  warning: Accent;
  danger: Accent;
}

export interface Theme {
  id: string;
  label: string;
  shiki: { light: string; dark: string };
  light: Palette;
  dark: Palette;
}

export type RenderMode = "light" | "dark";

function viewerVars(p: Palette): Record<string, string> {
  return {
    bg: p.bg,
    panel: p.panel,
    surface: p.surface,
    text: p.text,
    muted: p.muted,
    faint: p.faint,
    border: p.border,
    "border-2": p.border2,
    accent: p.info.text,
    "accent-bg": p.info.bg,
    hover: p.hover,
    danger: p.danger.text,
  };
}

function termVars(dark: Palette): Record<string, string> {
  return {
    "term-bg": dark.bg,
    "term-bar": dark.panel,
    "term-fg": dark.text,
    "term-title": dark.muted,
  };
}

const block = (vars: Record<string, string>) =>
  Object.entries(vars)
    .map(([k, v]) => `--${k}: ${v};`)
    .join("");

function schemeCss(
  light: Record<string, string>,
  dark: Record<string, string>,
  mode?: RenderMode,
): string {
  if (mode === "light") return `:root{${block(light)}}`;
  if (mode === "dark") return `:root{${block(dark)}}`;
  return `:root{${block(light)}}@media (prefers-color-scheme: dark){:root{${block(dark)}}}`;
}

export function viewerThemeCss(t: Theme, mode?: RenderMode): string {
  return `${schemeCss(viewerVars(t.light), viewerVars(t.dark), mode)}:root{${block(termVars(t.dark))}}`;
}

const colorSchemeCss = (mode?: RenderMode): string =>
  `:root{color-scheme:${mode ?? "light dark"}}`;

export function sandboxThemeCss(t: Theme, mode?: RenderMode, surfaceCss = ""): string {
  return `${viewerThemeCss(t, mode)}${surfaceCss}${colorSchemeCss(mode)}`;
}

export const CONSOLE_THEME: Theme = {
  id: "console",
  label: "Review Console",
  shiki: { light: "github-light", dark: "github-dark" },
  light: {
    bg: "#f4f6f9",
    panel: "#eaeef2",
    surface: "#fafbfc",
    text: "#1a1f2b",
    muted: "#5a6478",
    faint: "#8a93a8",
    border: "#d8dee8",
    border2: "#c4ccd8",
    hover: "#eaeef2",
    info: { bg: "#e8eef8", text: "#3d6fbf", border: "#88aef8" },
    success: { bg: "#e8f3e8", text: "#2d7a3e", border: "#97c997" },
    warning: { bg: "#faf0dd", text: "#986801", border: "#d9a441" },
    danger: { bg: "#fce8e8", text: "#c0392b", border: "#ef9a92" },
  },
  dark: {
    bg: "#12151c",
    panel: "#1a1f2b",
    surface: "#161b24",
    text: "#e8ecf4",
    muted: "#9aa3b5",
    faint: "#6b7385",
    border: "#2a3140",
    border2: "#3a4254",
    hover: "rgba(154, 163, 181, 0.12)",
    info: { bg: "rgba(61, 111, 191, 0.18)", text: "#7eb0f0", border: "#3d6fbf" },
    success: { bg: "rgba(45, 122, 62, 0.18)", text: "#6fcf8a", border: "#2d7a3e" },
    warning: { bg: "rgba(152, 104, 1, 0.18)", text: "#e0b04a", border: "#986801" },
    danger: { bg: "rgba(192, 57, 43, 0.18)", text: "#f08070", border: "#c0392b" },
  },
};

export function themeById(id?: string): Theme {
  if (!id || id === CONSOLE_THEME.id) return CONSOLE_THEME;
  return CONSOLE_THEME;
}
