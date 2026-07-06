import { getArtifact, listFeedback } from "@/lib/db";
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

  const feedback = (await listFeedback(id)).map(toFeedback);

  return Response.json({
    artifact: toArtifact(row),
    contentUrl: `/api/artifacts/${id}/content`,
    feedback,
  });
}
