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
  ".json",
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

export function kindFromContentType(contentType: string): ArtifactKind {
  const ct = contentType.split(";")[0].trim().toLowerCase();
  if (ct.startsWith("image/")) return "image";
  if (ct === "text/html") return "html";
  if (ct === "text/markdown") return "markdown";
  if (ct === "text/vnd.mermaid") return "mermaid";
  if (
    ct === "application/json" ||
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
  if (CODE_EXTENSIONS.has(ext)) return "code";
  return kindFromContentType(contentTypeFromFilename(filename));
}

/** Stored kind with filename fallback for legacy uploads misclassified as binary. */
export function effectiveArtifactKind(artifact: { kind: ArtifactKind; filename: string }): ArtifactKind {
  if (artifact.kind !== "binary") return artifact.kind;
  const fromName = kindFromFilename(artifact.filename);
  return fromName === "binary" ? artifact.kind : fromName;
}
