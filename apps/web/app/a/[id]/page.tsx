import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { effectiveArtifactKind } from "@openartifacts/shared";
import { getArtifact, listFeedback } from "@/lib/db";
import { toArtifact, toFeedback } from "@/lib/serialize";
import { viewerBaseUrl } from "@/lib/serialize";
import { ArtifactPageClient } from "@/components/ArtifactPageClient";

export const runtime = "nodejs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const row = await getArtifact(id);
  if (!row) {
    return {
      title: "Artifact not found · OpenArtifacts",
    };
  }

  const artifact = toArtifact(row);
  const kind = effectiveArtifactKind(artifact);
  const base = viewerBaseUrl();
  const description = `${kind} · ${formatBytes(artifact.size)} · ${new Date(artifact.createdAt).toLocaleDateString()}`;
  const imageUrl = `${base}/api/artifacts/${id}/content`;

  return {
    title: `${artifact.filename} · OpenArtifacts`,
    description,
    openGraph: {
      title: artifact.filename,
      description,
      url: artifact.viewUrl,
      images: kind === "image" ? [{ url: imageUrl }] : undefined,
    },
  };
}

export default async function ArtifactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getArtifact(id);
  if (!row) notFound();

  const artifact = toArtifact(row);
  const feedback = (await listFeedback(id)).map(toFeedback);
  const contentPath = `/api/artifacts/${id}/content`;

  return (
    <ArtifactPageClient
      artifact={artifact}
      initialFeedback={feedback}
      contentPath={contentPath}
    />
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
