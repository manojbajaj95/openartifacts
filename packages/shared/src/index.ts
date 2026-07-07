export const DEFAULT_SERVER_URL = "https://oartifacts.vercel.app";
export const DEFAULT_VIEWER_URL = "https://oartifacts.vercel.app";

export type ArtifactKind =
  | "markdown"
  | "mermaid"
  | "html"
  | "image"
  | "pdf"
  | "code"
  | "text"
  | "diff"
  | "terminal"
  | "json"
  | "trace"
  | "binary";

export interface Artifact {
  id: string;
  filename: string;
  contentType: string;
  kind: ArtifactKind;
  size: number;
  createdAt: string;
  viewUrl: string;
}

export interface Feedback {
  id: number;
  artifactId: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface UploadResponse {
  artifact: Artifact;
  contentUrl: string;
}

export interface ArtifactDetailResponse {
  artifact: Artifact;
  contentUrl: string;
  feedback: Feedback[];
}

export {
  contentTypeFromFilename,
  effectiveArtifactKind,
  hasAnsiSequences,
  isPdfBytes,
  kindFromContentType,
  kindFromFilename,
  languageFromFilename,
  refineKindFromText,
  resolveContentType,
} from "./mime.js";
