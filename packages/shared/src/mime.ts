import type { ArtifactKind } from "./index.js";

const EXT_CONTENT_TYPE: Record<string, string> = {
  ".md": "text/markdown",
  ".markdown": "text/markdown",
  ".mmd": "text/vnd.mermaid",
  ".mermaid": "text/vnd.mermaid",
  ".htm": "text/html",
  ".html": "text/html",
  ".txt": "text/plain",
  ".log": "text/plain",
  ".csv": "text/csv",
  ".patch": "text/x-diff",
  ".diff": "text/x-diff",
  ".jsonl": "application/x-ndjson",
  ".ts": "text/typescript",
  ".tsx": "text/tsx",
  ".js": "text/javascript",
  ".jsx": "text/jsx",
  ".mjs": "text/javascript",
  ".py": "text/x-python",
  ".go": "text/x-go",
  ".rs": "text/x-rust",
  ".rb": "text/x-ruby",
  ".java": "text/x-java-source",
  ".c": "text/x-c",
  ".cpp": "text/x-c++",
  ".cc": "text/x-c++",
  ".h": "text/x-c",
  ".cs": "text/x-csharp",
  ".sh": "text/x-shellscript",
  ".sql": "text/x-sql",
  ".css": "text/css",
  ".scss": "text/x-scss",
  ".json": "application/json",
  ".yaml": "text/yaml",
  ".yml": "text/yaml",
  ".toml": "text/toml",
  ".xml": "text/xml",
  ".ini": "text/plain",
  ".dockerfile": "text/x-dockerfile",
  ".env": "text/plain",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

const CODE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".py",
  ".go",
  ".rs",
  ".rb",
  ".java",
  ".c",
  ".cpp",
  ".cc",
  ".h",
  ".cs",
  ".sh",
  ".sql",
  ".css",
  ".scss",
  ".yaml",
  ".yml",
  ".toml",
  ".xml",
  ".ini",
  ".dockerfile",
  ".env",
]);

const EXT_LANGUAGE: Record<string, string> = {
  ".ts": "typescript",
  ".tsx": "tsx",
  ".js": "javascript",
  ".jsx": "jsx",
  ".mjs": "javascript",
  ".py": "python",
  ".go": "go",
  ".rs": "rust",
  ".rb": "ruby",
  ".java": "java",
  ".c": "c",
  ".cpp": "cpp",
  ".cc": "cpp",
  ".h": "c",
  ".cs": "csharp",
  ".sh": "bash",
  ".sql": "sql",
  ".css": "css",
  ".scss": "scss",
  ".json": "json",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".toml": "toml",
  ".xml": "xml",
  ".ini": "ini",
  ".dockerfile": "dockerfile",
  ".env": "dotenv",
  ".csv": "csv",
  ".log": "log",
};

const ANSI_PATTERN = /\u001b\[[0-9:;]*[ -/]*[@-~]/;

function normalizedFilename(filename: string): string {
  return filename.trim().toLowerCase();
}

function fileExtension(filename: string): string {
  const name = normalizedFilename(filename);
  if (name === "dockerfile" || name.endsWith("/dockerfile")) return ".dockerfile";
  if (name.endsWith(".env.example")) return ".env";
  const dot = name.lastIndexOf(".");
  if (dot === -1) return "";
  return name.slice(dot);
}

export function contentTypeFromFilename(filename: string): string {
  return EXT_CONTENT_TYPE[fileExtension(filename)] ?? "application/octet-stream";
}

export function languageFromFilename(filename: string): string | undefined {
  return EXT_LANGUAGE[fileExtension(filename)];
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

export function hasAnsiSequences(text: string): boolean {
  return ANSI_PATTERN.test(text);
}

/** PDF files begin with %PDF- (ISO 32000). */
export function isPdfBytes(buffer: ArrayBuffer | Uint8Array): boolean {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return bytes.length >= 5 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d;
}

export function kindFromContentType(contentType: string): ArtifactKind {
  const ct = contentType.split(";")[0].trim().toLowerCase();
  if (ct.startsWith("image/")) return "image";
  if (ct === "application/pdf") return "pdf";
  if (ct === "text/html") return "html";
  if (ct === "text/markdown") return "markdown";
  if (ct === "text/vnd.mermaid") return "mermaid";
  if (ct === "text/x-diff") return "diff";
  if (ct === "application/json") return "json";
  if (ct === "application/x-ndjson") return "trace";
  if (
    ct === "application/xml" ||
    ct.includes("javascript") ||
    ct.includes("typescript") ||
    ct.includes("x-python") ||
    ct.includes("x-go") ||
    ct.includes("x-rust") ||
    ct.includes("x-ruby") ||
    ct.includes("x-java") ||
    ct.includes("x-c") ||
    ct.includes("x-shellscript") ||
    ct.includes("x-sql") ||
    ct.includes("x-scss") ||
    ct.includes("x-dockerfile") ||
    ct === "text/css" ||
    ct === "text/xml" ||
    ct === "text/yaml" ||
    ct === "text/toml"
  ) {
    return "code";
  }
  if (ct.startsWith("text/")) return "text";
  return "binary";
}

export function kindFromFilename(filename: string): ArtifactKind {
  const ext = fileExtension(filename);
  if (ext === ".patch" || ext === ".diff") return "diff";
  if (ext === ".jsonl") return "trace";
  if (ext === ".json") return "json";
  if (CODE_EXTENSIONS.has(ext)) return "code";
  return kindFromContentType(contentTypeFromFilename(filename));
}

/** Refine kind using file contents (ANSI logs, trace-shaped JSON). */
export function refineKindFromText(
  kind: ArtifactKind,
  filename: string,
  text: string,
): ArtifactKind {
  const ext = fileExtension(filename);
  if (ext === ".jsonl") return "trace";
  if (kind === "text" && hasAnsiSequences(text)) return "terminal";
  if (kind === "json" && ext !== ".json") return kind;
  if (kind === "json" && looksLikeTraceDocument(text)) return "trace";
  return kind;
}

function looksLikeTraceDocument(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  try {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed) || parsed.length === 0) return false;
    return parsed.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof (item as { label?: unknown }).label === "string",
    );
  } catch {
    return trimmed.split("\n").some((line) => {
      const row = line.trim();
      if (!row) return false;
      try {
        const parsed = JSON.parse(row) as { label?: unknown };
        return typeof parsed.label === "string";
      } catch {
        return false;
      }
    });
  }
}

/** Stored kind with filename fallback for legacy uploads misclassified as binary or code. */
export function effectiveArtifactKind(artifact: {
  kind: ArtifactKind;
  filename: string;
  contentType?: string;
}): ArtifactKind {
  const fromName = kindFromFilename(artifact.filename);
  if (artifact.kind === "binary") {
    if (fromName !== "binary") return fromName;
    const ct = artifact.contentType?.split(";")[0].trim().toLowerCase();
    if (ct === "application/pdf") return "pdf";
    return artifact.kind;
  }
  if (fromName === "json" || fromName === "trace" || fromName === "diff" || fromName === "pdf") {
    return fromName;
  }
  return artifact.kind;
}
