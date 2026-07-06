import { getArtifact } from "@/lib/db";
import { getObject } from "@/lib/s3";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const row = await getArtifact(id);
  if (!row) {
    return new Response("Not found", { status: 404 });
  }

  const { body, contentType } = await getObject(row.s3Key);
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=60",
    },
  });
}
