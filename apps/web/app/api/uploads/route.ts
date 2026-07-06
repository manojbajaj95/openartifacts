import { nanoid } from "nanoid";
import { kindFromContentType, contentTypeFromFilename } from "@openartifacts/shared";
import { insertArtifact } from "@/lib/db";
import { artifactKey, putObject } from "@/lib/s3";
import { toArtifact } from "@/lib/serialize";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "file is required" }, { status: 400 });
  }

  const id = nanoid(10);
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name || "upload";
  const contentType = file.type || contentTypeFromFilename(filename);
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
}
