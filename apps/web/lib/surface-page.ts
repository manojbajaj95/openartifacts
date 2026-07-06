import { RESIZE_BRIDGE_SCRIPT } from "@/lib/artifact-surface";
import {
  CONSOLE_THEME,
  type RenderMode,
  sandboxThemeCss,
  type Theme,
  themeById,
} from "@/lib/artifact-theme";

function buildRichCsp(origin: string): string {
  return [
    `default-src 'none'`,
    `script-src 'unsafe-inline'`,
    `style-src 'unsafe-inline'`,
    `img-src https: data: blob: ${origin}`,
    `font-src data:`,
  ].join("; ");
}

export function renderSandboxedDocument(doc: {
  body: string;
  css: string;
  origin: string;
  theme?: Theme | string;
  mode?: RenderMode;
}): string {
  const theme =
    typeof doc.theme === "string" || doc.theme == null ? themeById(doc.theme) : doc.theme;
  const csp = buildRichCsp(doc.origin);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<base href="${doc.origin}/">
<style>${sandboxThemeCss(theme, doc.mode, doc.css)}</style>
</head>
<body>
${doc.body}
<script>${RESIZE_BRIDGE_SCRIPT}</script>
</body>
</html>`;
}

export function richSurfaceCsp(origin: string): string {
  return buildRichCsp(origin);
}

export { CONSOLE_THEME };
