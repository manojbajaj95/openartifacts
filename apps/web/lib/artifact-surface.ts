import type { ThemePreference } from "@/lib/theme";
import { resolveTheme } from "@/lib/theme";

export const MIN_FRAME_HEIGHT = 24;
export const MAX_FRAME_HEIGHT = 4000;

export function clampFrameHeight(reported: unknown): number {
  const height = Number(reported);
  if (!Number.isFinite(height)) return 520;
  return Math.min(MAX_FRAME_HEIGHT, Math.max(MIN_FRAME_HEIGHT, Math.ceil(height)));
}

/** Resize bridge adapted from sideshow/surfacePage.ts (flip-guard + font-load settle). */
export const RESIZE_BRIDGE_SCRIPT = `(function(){
var TYPE='openartifacts:resize';
window.sendPrompt=function(t){parent.postMessage({type:'openartifacts:send-prompt',text:String(t)},'*');};
window.openLink=function(u){parent.postMessage({type:'openartifacts:open-link',url:String(u)},'*');};
window.copyToClipboard=function(t){parent.postMessage({type:'openartifacts:copy',text:String(t)},'*');};
document.addEventListener('click',function(e){
  var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;
  if(a&&/^https?:/.test(a.href)){e.preventDefault();window.openLink(a.href);}
});
var __lastH=0,__prevH=0,__lastT=0,__seenH=0,__trailTimer=0,__trailH=0,__FLIP_MS=250,__TRAIL_MS=350;
function __now(){return typeof performance!=='undefined'&&performance.now?performance.now():Date.now();}
function __measureHeight(){return document.body?document.body.scrollHeight:document.documentElement.scrollHeight;}
function __postHeight(h,t){__prevH=__lastH;__lastH=h;__lastT=t;parent.postMessage({type:TYPE,height:h},'*');}
function __clearTrailing(){if(__trailTimer&&typeof clearTimeout!=='undefined')clearTimeout(__trailTimer);__trailTimer=0;__trailH=0;}
function __flushTrailing(){__trailTimer=0;var measured=__measureHeight();if(measured>0)__seenH=measured;var target=Math.max(__trailH||0,measured||0,__lastH||0);__trailH=0;if(target<=0||target===__lastH)return;__postHeight(target,__now());}
function __scheduleTrailing(h,reset){__trailH=Math.max(__trailH||0,h||0,__lastH||0);if(__trailTimer){if(!reset)return;clearTimeout(__trailTimer);}__trailTimer=setTimeout(__flushTrailing,__TRAIL_MS);}
function __report(){var h=__measureHeight();if(h<=0)return;var changed=h!==__seenH;__seenH=h;if(h===__lastH)return;var t=__now();if(h===__prevH&&(__trailTimer||t-__lastT<__FLIP_MS)){__scheduleTrailing(h,true);return;}__clearTrailing();__postHeight(h,t);}
if(document.readyState==='complete')__report();else window.addEventListener('load',function(){requestAnimationFrame(__report);});
setTimeout(__report,60);setTimeout(__report,350);setTimeout(__report,1500);setTimeout(__report,3000);
if(document.fonts&&document.fonts.ready&&document.fonts.ready.then){document.fonts.ready.then(function(){__report();});}
if(window.ResizeObserver){var ro=new ResizeObserver(__report);ro.observe(document.documentElement);if(document.body)ro.observe(document.body);}
})();`;

/** Widget-style tokens for uploaded HTML prototypes (sideshow html kit subset). */
export const HTML_SURFACE_THEME_CSS = `
:root {
  color-scheme: light dark;
  --font-sans: var(--font-sans, "IBM Plex Sans", "Segoe UI", system-ui, sans-serif);
  --font-mono: var(--font-mono, "IBM Plex Mono", ui-monospace, monospace);
  --color-background-primary: var(--oa-bg, #fafbfc);
  --color-background-secondary: var(--oa-surface, #f4f6f9);
  --color-text-primary: var(--oa-ink, #1a1f2b);
  --color-text-secondary: var(--oa-muted, #5a6478);
  --color-text-tertiary: var(--oa-faint, #8a93a8);
  --color-border-secondary: var(--oa-border, #d8dee8);
  --color-border-info: var(--oa-accent, #3d6fbf);
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
}
html { box-sizing: border-box; }
*, *::before, *::after { box-sizing: inherit; }
body {
  margin: 0;
  padding: 16px;
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  font: 16px/1.6 var(--font-sans);
}
button {
  font: 500 14px/1.4 var(--font-sans);
  color: var(--color-text-primary);
  background: none;
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--border-radius-md);
  padding: 6px 14px;
  cursor: pointer;
}
button:hover { background: var(--color-background-secondary); }
input:not([type=checkbox]):not([type=radio]):not([type=range]), select, textarea {
  font: 14px/1.4 var(--font-sans);
  color: var(--color-text-primary);
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--border-radius-md);
  padding: 6px 10px;
  outline: none;
}
input:focus, select:focus, textarea:focus { border-color: var(--color-border-info); }
a { color: var(--color-border-info); }
img, video { max-width: 100%; height: auto; }
`;

function readToken(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function getResolvedColorMode(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function getResolvedColorModeFromPreference(preference: ThemePreference): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return resolveTheme(preference);
}

/** Mermaid theme config derived from design tokens (sideshow mermaidThemeVars pattern). */
export function getMermaidThemeConfig(mode: "light" | "dark") {
  const text = readToken("--foreground") || (mode === "dark" ? "oklch(0.93 0.018 250)" : "oklch(0.2 0.018 250)");
  const muted = readToken("--muted-foreground") || text;
  const border = readToken("--border");
  const panel = readToken("--card");
  const surface = readToken("--background");
  const bg = readToken("--background");
  const accent = readToken("--link");
  const accentBg = readToken("--muted");

  return {
    darkMode: mode === "dark",
    themeVariables: {
      darkMode: mode === "dark",
      fontFamily: "var(--font-sans)",
      fontSize: "14px",
      background: surface,
      primaryColor: panel,
      primaryBorderColor: border,
      primaryTextColor: text,
      secondaryColor: surface,
      tertiaryColor: bg,
      mainBkg: panel,
      nodeBorder: border,
      lineColor: muted,
      arrowheadColor: muted,
      textColor: text,
      nodeTextColor: text,
      titleColor: text,
      classText: text,
      secondaryTextColor: text,
      tertiaryTextColor: text,
      clusterBkg: bg,
      clusterBorder: border,
      edgeLabelBackground: bg,
      actorBkg: panel,
      actorBorder: border,
      actorTextColor: text,
      actorLineColor: muted,
      signalColor: muted,
      signalTextColor: text,
      labelBoxBkgColor: surface,
      labelBoxBorderColor: border,
      labelTextColor: text,
      loopTextColor: text,
      noteBkgColor: accentBg,
      noteBorderColor: border,
      noteTextColor: text,
      sequenceNumberColor: surface,
    },
    themeCSS: `
      .node rect, .node polygon, rect.actor, .labelBox { rx: 8px; ry: 8px; }
      .node rect, rect.actor { stroke-width: 1px; }
      .edgePath .path, .flowchart-link, .actor-line,
      .messageLine0, .messageLine1 { stroke-width: 1px; }
      .node.accent > rect, .node.accent > polygon { fill: ${accentBg}; stroke: ${accent}; }
      .node.accent .nodeLabel, .node.accent span, .node.accent text { fill: ${accent}; color: ${accent}; }
    `,
  };
}

function themeVarBlock(mode: "light" | "dark"): string {
  const bg = readToken("--background");
  const surface = readToken("--card");
  const ink = readToken("--foreground");
  const muted = readToken("--muted-foreground");
  const faint = readToken("--muted-foreground");
  const border = readToken("--border");
  const accent = readToken("--link");

  return `:root{
  color-scheme:${mode};
  --oa-bg:${bg};
  --oa-surface:${surface};
  --oa-ink:${ink};
  --oa-muted:${muted};
  --oa-faint:${faint};
  --oa-border:${border};
  --oa-accent:${accent};
}`;
}

export function wrapHtmlDocument(source: string, mode: "light" | "dark"): string {
  const injection = `<style>${themeVarBlock(mode)}${HTML_SURFACE_THEME_CSS}</style>`;
  const script = `<script>${RESIZE_BRIDGE_SCRIPT}</script>`;

  const hasHtml = /<html[\s>]/i.test(source);
  const hasHead = /<head[\s>]/i.test(source);
  const hasBody = /<body[\s>]/i.test(source);

  if (hasHtml && hasHead) {
    return source.replace(/<head([^>]*)>/i, `<head$1>${injection}`).replace(/<\/body>/i, `${script}</body>`);
  }

  if (hasBody) {
    return source.replace(/<body([^>]*)>/i, `<body$1>${injection}`).replace(/<\/body>/i, `${script}</body>`);
  }

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${injection}</head><body>${source}${script}</body></html>`;
}
