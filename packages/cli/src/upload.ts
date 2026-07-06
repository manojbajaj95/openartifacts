import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";
import type { UploadResponse } from "@openartifacts/shared";
import { contentTypeFromFilename } from "@openartifacts/shared";
import { loadConfig } from "./config.js";

export async function uploadFile(filePath: string, serverUrl?: string): Promise<UploadResponse> {
  const config = await loadConfig();
  const base = (serverUrl ?? config.serverUrl).replace(/\/$/, "");
  const viewerBase = config.viewerUrl.replace(/\/$/, "");
  const info = await stat(filePath);
  if (!info.isFile()) {
    throw new Error(`Not a file: ${filePath}`);
  }

  const data = await readFile(filePath);
  const filename = basename(filePath);
  const contentType = contentTypeFromFilename(filename);

  const form = new FormData();
  form.append("file", new Blob([data], { type: contentType }), filename);

  const res = await fetch(`${base}/api/uploads`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }

  const result = (await res.json()) as UploadResponse;
  return {
    ...result,
    artifact: {
      ...result.artifact,
      viewUrl: `${viewerBase}/a/${result.artifact.id}`,
    },
    contentUrl: result.contentUrl.startsWith("http")
      ? result.contentUrl
      : `${base}${result.contentUrl}`,
  };
}
