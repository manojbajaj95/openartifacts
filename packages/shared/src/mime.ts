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
  const dot = filename.lastIndexOf(".");
  if (dot === -1) return "application/octet-stream";
  const ext = filename.slice(dot).toLowerCase();
  return EXT_OVERRIDES[ext] ?? "application/octet-stream";
}

/** Prefer filename when the client sends a generic type (curl, some browsers). */
export function resolveContentType(filename: string, declaredType?: string): string {
  const fromName = contentTypeFromFilename(filename);
  const declared = declaredType?.split(";")[0].trim().toLowerCase();
  if (!declared || declared === "application/octet-stream") {
    return fromName;
  }
  if (fromName !== "application/octet-stream") {
    return fromName;
  }
  return declared;
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

export function kindFromFilename(filename: string): ArtifactKind {
  return kindFromContentType(contentTypeFromFilename(filename));
}
