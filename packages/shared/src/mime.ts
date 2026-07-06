import type { ArtifactKind } from "./index.js";

const EXT_OVERRIDES: Record<string, string> = {
  ".md": "text/markdown",
  ".markdown": "text/markdown",
  ".mmd": "text/vnd.mermaid",
  ".mermaid": "text/vnd.mermaid",
  ".htm": "text/html",
  ".svg": "image/svg+xml",
};

export function contentTypeFromFilename(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  return EXT_OVERRIDES[ext] ?? "application/octet-stream";
}

export function kindFromContentType(contentType: string): ArtifactKind {
  const ct = contentType.split(";")[0].trim().toLowerCase();
  if (ct.startsWith("image/")) return "image";
  if (ct === "text/html") return "html";
  if (ct === "text/markdown") return "markdown";
  if (ct === "text/vnd.mermaid") return "mermaid";
  if (ct.startsWith("text/")) return "text";
  return "binary";
}
