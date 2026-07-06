export const DEFAULT_SERVER_URL = "https://openartifacts.dev";
export const DEFAULT_VIEWER_URL = "https://openartifacts.dev";

export type ArtifactKind = "markdown" | "mermaid" | "html" | "image" | "text" | "binary";

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
}

export interface ArtifactDetailResponse {
  artifact: Artifact;
  contentUrl: string;
  feedback: Feedback[];
}

export { contentTypeFromFilename, kindFromContentType } from "./mime.js";
