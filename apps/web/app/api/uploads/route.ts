import { createHash } from "node:crypto";
import { nanoid } from "nanoid";
import { kindFromContentType, kindFromFilename, isPdfBytes, refineKindFromText, resolveContentType } from "@openartifacts/shared";
import { insertArtifact } from "@/lib/db";
import { artifactKey, putObject } from "@/lib/s3";
import { toArtifact } from "@/lib/serialize";

export const runtime = "nodejs";

const DEFAULT_MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function maxUploadBytes(): number {
  const configured = Number(process.env.OA_MAX_UPLOAD_BYTES);
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_MAX_UPLOAD_BYTES;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "file is required" }, { status: 400 });
    }
    const maxBytes = maxUploadBytes();
    if (file.size > maxBytes) {
      return Response.json(
        { error: `file is too large; max upload size is ${maxBytes} bytes` },
        { status: 413 },
      );
    }

    const id = nanoid(10);
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name || "upload";
    const contentType = resolveContentType(filename, file.type);
    const filenameKind = kindFromFilename(filename);
    const contentKind = kindFromContentType(contentType);
    let kind = filenameKind === "binary" ? contentKind : filenameKind;
    if (kind === "binary" && isPdfBytes(buffer)) {
      kind = "pdf";
    }
    if (kind !== "binary" && kind !== "image" && kind !== "pdf") {
      const preview = buffer.toString("utf8", 0, Math.min(buffer.length, 65536));
      kind = refineKindFromText(kind, filename, preview);
    }
    const sha256 = createHash("sha256").update(buffer).digest("hex");
    const key = artifactKey(id);

    await putObject(key, buffer, contentType);

    const createdAt = new Date().toISOString();
    await insertArtifact({
      id,
      filename,
      contentType,
      kind,
      size: buffer.length,
      sha256,
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
        sha256,
        s3Key: key,
        createdAt,
      }),
      contentUrl: `/api/artifacts/${id}/content`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const cause =
      error instanceof Error && error.cause instanceof Error ? error.cause.message : undefined;
    console.error("upload failed", error);
    return Response.json({ error: message, cause }, { status: 500 });
  }
}
