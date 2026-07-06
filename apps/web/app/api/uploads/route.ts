import { nanoid } from "nanoid";
import { kindFromContentType, resolveContentType } from "@openartifacts/shared";
import { insertArtifact } from "@/lib/db";
import { artifactKey, putObject } from "@/lib/s3";
import { toArtifact } from "@/lib/serialize";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "file is required" }, { status: 400 });
    }

    const id = nanoid(10);
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name || "upload";
    const contentType = resolveContentType(filename, file.type);
    const kind = kindFromContentType(contentType);
    const key = artifactKey(id);

    await putObject(key, buffer, contentType);

    const createdAt = new Date().toISOString();
    await insertArtifact({
      id,
      filename,
      contentType,
      kind,
      size: buffer.length,
      s3Key: key,
      createdAt,
    });

    return Response.json({
      artifact: toArtifact({
        id,
        filename,
        contentType,
        kind,
        size: buffer.length,
        s3Key: key,
        createdAt,
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const cause =
      error instanceof Error && error.cause instanceof Error ? error.cause.message : undefined;
    console.error("upload failed", error);
    return Response.json({ error: message, cause }, { status: 500 });
  }
}
