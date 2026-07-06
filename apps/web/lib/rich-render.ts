import MarkdownIt from "markdown-it";
import { AnsiUp } from "ansi_up";
import {
  type FileDiffMetadata,
  getFiletypeFromFileName,
  parsePatchFiles,
  processFile,
  preloadHighlighter,
  type SupportedLanguages,
} from "@pierre/diffs";
import { preloadFileDiff } from "@pierre/diffs/ssr";
import { createHighlighter, type Highlighter } from "shiki";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { type RenderMode, themeById } from "@/lib/artifact-theme";

export type RenderedSurface = { body: string; css: string };
export type RenderOpts = { theme?: string; mode?: RenderMode };

const SHIKI_DARK_RULE =
  ".shiki, .shiki span { color: var(--shiki-dark) !important; background-color: var(--shiki-dark-bg) !important; }";

function shikiSchemeCss(mode?: RenderMode): string {
  if (mode === "dark") return SHIKI_DARK_RULE;
  if (mode === "light") return "";
  return `@media (prefers-color-scheme: dark){${SHIKI_DARK_RULE}}`;
}

const ALL_THEMES = ["github-light", "github-dark"];

let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ALL_THEMES,
      langs: [],
      engine: createJavaScriptRegexEngine({ forgiving: true }),
    });
  }
  return highlighterPromise;
}

async function loadLangs(hl: Highlighter, langs: string[]): Promise<void> {
  await Promise.allSettled(langs.map(async (l) => hl.loadLanguage(l as never)));
}

function highlight(
  hl: Highlighter,
  code: string,
  lang: string,
  pair: { light: string; dark: string },
): string | null {
  if (!lang) return null;
  try {
    return hl.codeToHtml(code, { lang, themes: pair });
  } catch {
    return null;
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function shikiPair(theme?: string): { light: string; dark: string } {
  const t = themeById(theme);
  return { light: t.shiki.light, dark: t.shiki.dark };
}

const MD_CSS = `
body {
  margin: 0;
  padding: 4px 16px 14px;
  background: transparent;
  color: var(--text);
  font: 14px/1.6 var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
  overflow-wrap: anywhere;
}
h1, h2, h3, h4 { line-height: 1.3; margin: 1.2em 0 0.5em; font-weight: 600; }
h1 { font-size: 1.5em; }
h2 { font-size: 1.25em; }
h3 { font-size: 1.1em; }
body > :first-child { margin-top: 0.4em; }
p, ul, ol, blockquote, table { margin: 0.5em 0; }
ul, ol { padding-left: 1.5em; }
li { margin: 0.2em 0; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
code {
  font: 0.875em ui-monospace, monospace;
  background: var(--hover);
  padding: 0.12em 0.35em;
  border-radius: 4px;
}
pre {
  background: var(--panel);
  border: 0.5px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  overflow: auto;
}
pre code { background: none; padding: 0; font-size: 12.5px; }
blockquote {
  margin-left: 0;
  padding-left: 12px;
  border-left: 2px solid var(--border-2);
  color: var(--muted);
}
table { border-collapse: collapse; font-size: 13px; }
th, td { border: 0.5px solid var(--border); padding: 4px 8px; text-align: left; }
th { background: var(--hover); }
img { max-width: 100%; height: auto; border-radius: 6px; }
hr { border: none; border-top: 0.5px solid var(--border); margin: 1em 0; }
`;

function fenceLangs(src: string): string[] {
  const langs = new Set<string>();
  const re = /^[ \t]*(?:```|~~~)[ \t]*([\w+#.-]+)/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) langs.add(m[1].toLowerCase());
  return [...langs];
}

export async function renderMarkdown(
  markdown: string,
  opts: RenderOpts = {},
): Promise<RenderedSurface> {
  const pair = shikiPair(opts.theme);
  const hl = await getHighlighter();
  await loadLangs(hl, fenceLangs(markdown));

  const md = new MarkdownIt({
    html: false,
    linkify: true,
    highlight: (code, lang) => highlight(hl, code, lang, pair) ?? "",
  });
  const renderLinkOpen =
    md.renderer.rules.link_open ??
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    tokens[idx].attrSet("target", "_blank");
    tokens[idx].attrSet("rel", "noopener noreferrer");
    return renderLinkOpen(tokens, idx, options, env, self);
  };

  return { body: md.render(markdown), css: MD_CSS + shikiSchemeCss(opts.mode) };
}

const TERM_CSS = `
body { margin: 0; background: var(--term-bg); }
.term-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 12px; background: var(--term-bar);
  border-bottom: 0.5px solid #000;
}
.term-dots { display: inline-flex; gap: 6px; }
.term-dots span { width: 11px; height: 11px; border-radius: 50%; background: #555; }
.term-dots span:nth-child(1) { background: #ff5f56; }
.term-dots span:nth-child(2) { background: #ffbd2e; }
.term-dots span:nth-child(3) { background: #27c93f; }
.term-title { font-size: 11.5px; color: var(--term-title); font-family: ui-monospace, monospace; }
.term-body {
  margin: 0; padding: 12px 14px; overflow-x: auto; white-space: pre;
  color: var(--term-fg);
  font: 12.5px/1.5 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  tab-size: 8;
}
`;

function resolveCarriageReturns(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => {
      const lastCr = line.lastIndexOf("\r");
      return lastCr === -1 ? line : line.slice(lastCr + 1);
    })
    .join("\n");
}

export function renderTerminal(
  text: string,
  opts: { title?: string; cols?: number } = {},
): RenderedSurface {
  const au = new AnsiUp();
  au.use_classes = false;
  const ansi = au.ansi_to_html(resolveCarriageReturns(text));
  const title = escapeHtml(opts.title ?? "terminal");
  const width = opts.cols ? ` style="width:${Number(opts.cols)}ch"` : "";
  const body =
    `<div class="term-bar"><span class="term-dots" aria-hidden="true">` +
    `<span></span><span></span><span></span></span>` +
    `<span class="term-title">${title}</span></div>` +
    `<pre class="term-body"${width}>${ansi}</pre>`;
  return { body, css: TERM_CSS };
}

const DIFF_CSS = `
body { margin: 0; padding: 0; background: transparent; font-size: 12.5px; }
diffs-container { display: block; }
diffs-container + diffs-container { border-top: 0.5px solid var(--border); }
`;

const BASE_LANGS = ["text", "json", "javascript", "typescript", "tsx", "jsx"];

function buildFileDiffs(patch: string): { diffs: FileDiffMetadata[]; langs: string[] } {
  const langs = new Set<string>(BASE_LANGS);
  const diffs: FileDiffMetadata[] = [];
  for (const parsed of parsePatchFiles(patch)) {
    for (const fd of parsed.files) {
      diffs.push(fd);
      if (fd.name) langs.add(getFiletypeFromFileName(fd.name));
    }
  }
  if (diffs.length === 0) {
    const fd = processFile(patch);
    if (fd) diffs.push(fd);
  }
  return { diffs, langs: [...langs] };
}

export async function renderDiff(patch: string, opts: RenderOpts = {}): Promise<RenderedSurface> {
  const t = themeById(opts.theme);
  const shiki = { dark: t.shiki.dark, light: t.shiki.light };
  const { diffs, langs } = buildFileDiffs(patch);
  if (diffs.length === 0) throw new Error("No diff content.");
  await preloadHighlighter({
    themes: [shiki.dark, shiki.light],
    langs: langs as SupportedLanguages[],
    preferredHighlighter: "shiki-js",
  });
  const themeType = opts.mode ?? ("system" as const);
  const options = {
    diffStyle: "unified" as const,
    theme: { dark: shiki.dark, light: shiki.light },
    themeType,
    preferredHighlighter: "shiki-js" as const,
  };
  const rendered = await Promise.all(
    diffs.map((fileDiff) => preloadFileDiff({ fileDiff, options })),
  );
  const body = rendered
    .map(
      (r) =>
        `<diffs-container><template shadowrootmode="open">${r.prerenderedHTML}</template></diffs-container>`,
    )
    .join("");
  return { body, css: DIFF_CSS };
}
