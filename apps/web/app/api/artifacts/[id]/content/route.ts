import { createHash } from "node:crypto";
import { resolveContentType } from "@openartifacts/shared";
import { getArtifact } from "@/lib/db";
import { getObject } from "@/lib/s3";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const row = await getArtifact(id);
  if (!row) {
    return new Response("Not found", { status: 404 });
  }

  const { body } = await getObject(row.s3Key);
  const contentType = resolveContentType(row.filename, row.contentType);
  const sha256 = row.sha256 ?? createHash("sha256").update(body).digest("hex");
  const headers = new Headers({
    "Content-Type": contentType,
    "Content-Length": String(body.length),
    ETag: `"sha256-${sha256}"`,
    "Cache-Control": "public, max-age=31536000, immutable",
  });

  const url = new URL(request.url);
  if (url.searchParams.get("download") === "1") {
    headers.set("Content-Disposition", `attachment; filename="${safeFilename(row.filename)}"`);
  }

  return new Response(new Uint8Array(body), {
    headers,
  });
}

function safeFilename(filename: string): string {
  return filename.replace(/["\\\r\n]/g, "_");
}
