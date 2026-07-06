import { notFound } from "next/navigation";
import { getArtifact, listFeedback } from "@/lib/db";
import { toArtifact, toFeedback } from "@/lib/serialize";
import { ArtifactPageClient } from "@/components/ArtifactPageClient";

export const runtime = "nodejs";

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
