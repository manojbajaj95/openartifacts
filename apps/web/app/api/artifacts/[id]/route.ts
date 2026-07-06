import { getArtifact, listFeedback } from "@/lib/db";
import { presignGet } from "@/lib/s3";
import { toArtifact, toFeedback } from "@/lib/serialize";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const row = await getArtifact(id);
  if (!row) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  const contentUrl = await presignGet(row.s3Key);
  const feedback = (await listFeedback(id)).map(toFeedback);

  return Response.json({
    artifact: toArtifact(row),
    contentUrl,
    feedback,
  });
}
