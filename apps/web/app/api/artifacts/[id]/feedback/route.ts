import { getArtifact, insertFeedback, listFeedback } from "@/lib/db";
import { toFeedback } from "@/lib/serialize";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!(await getArtifact(id))) {
    return Response.json({ error: "not found" }, { status: 404 });
  }
  return Response.json({ feedback: (await listFeedback(id)).map(toFeedback) });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!(await getArtifact(id))) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  const body = (await request.json()) as { author?: string; body?: string };
  const text = body.body?.trim();
  if (!text) {
    return Response.json({ error: "body is required" }, { status: 400 });
  }

  const row = await insertFeedback({
    artifactId: id,
    author: body.author?.trim() || "Anonymous",
    body: text,
    createdAt: new Date().toISOString(),
  });

  return Response.json({ feedback: toFeedback(row) }, { status: 201 });
}
