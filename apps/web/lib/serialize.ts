import type { Artifact, Feedback } from "@openartifacts/shared";
import type { ArtifactKind } from "@openartifacts/shared";
import type { ArtifactRow, FeedbackRow } from "./db/schema";

export function viewerBaseUrl(): string {
  return (process.env.OA_VIEWER_URL ?? process.env.NEXT_PUBLIC_VIEWER_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function toArtifact(row: ArtifactRow): Artifact {
  const base = viewerBaseUrl();
  return {
    id: row.id,
    filename: row.filename,
    contentType: row.contentType,
    kind: row.kind as ArtifactKind,
    size: row.size,
    createdAt: row.createdAt,
    viewUrl: `${base}/a/${row.id}`,
  };
}

export function toFeedback(row: FeedbackRow): Feedback {
  return {
    id: row.id,
    artifactId: row.artifactId,
    author: row.author,
    body: row.body,
    createdAt: row.createdAt,
  };
}
