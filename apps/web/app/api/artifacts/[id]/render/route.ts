import { effectiveArtifactKind, type ArtifactKind } from "@openartifacts/shared";
import { getArtifact } from "@/lib/db";
import { renderMarkdown, renderDiff, renderTerminal } from "@/lib/rich-render";
import { getObject } from "@/lib/s3";
import { renderSandboxedDocument, richSurfaceCsp } from "@/lib/surface-page";

export const runtime = "nodejs";

const RENDER_KINDS = new Set(["markdown", "diff", "terminal"]);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const row = await getArtifact(id);
  if (!row) {
    return new Response("Not found", { status: 404 });
  }

  const kind = effectiveArtifactKind({
    kind: row.kind as ArtifactKind,
    filename: row.filename,
  });
  if (!RENDER_KINDS.has(kind)) {
    return new Response("Unsupported render kind", { status: 400 });
  }

  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") === "light" ? "light" : "dark";
  const origin = url.origin;

  try {
    const { body } = await getObject(row.s3Key);
    const text = body.toString("utf-8");

    let rendered;
    switch (kind) {
      case "markdown":
        rendered = await renderMarkdown(text, { mode });
        break;
      case "diff":
        rendered = await renderDiff(text, { mode });
        break;
      case "terminal":
        rendered = renderTerminal(text, { title: row.filename });
        break;
      default:
        return new Response("Unsupported render kind", { status: 400 });
    }

    const html = renderSandboxedDocument({
      body: rendered.body,
      css: rendered.css,
      origin,
      mode,
    });

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Security-Policy": richSurfaceCsp(origin),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("artifact render failed", id, error);
    return new Response(message, { status: 500 });
  }
}
