"use client";

import type { Artifact, ArtifactKind } from "@openartifacts/shared";
import { kindFromFilename } from "@openartifacts/shared";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownView } from "./MarkdownView";
import { MermaidView } from "./MermaidView";

function effectiveKind(artifact: Artifact): ArtifactKind {
  if (artifact.kind !== "binary") return artifact.kind;
  const fromName = kindFromFilename(artifact.filename);
  return fromName === "binary" ? artifact.kind : fromName;
}

export function ArtifactRenderer({
  artifact,
  contentPath,
}: {
  artifact: Artifact;
  contentPath: string;
}) {
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const kind = effectiveKind(artifact);

  useEffect(() => {
    if (kind === "image") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(contentPath);
        if (!res.ok) throw new Error(`Failed to load content (${res.status})`);
        setText(await res.text());
      } catch (err) {
        if (!cancelled) setError(String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [kind, contentPath]);

  if (kind === "image") {
    return (
      <img
        src={contentPath}
        alt={artifact.filename}
        className="artifact-image"
      />
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (text === null) {
    return (
      <div className="space-y-2.5" aria-busy="true" aria-label="Loading artifact">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-11/12" />
        <Skeleton className="mt-4 h-28 w-full rounded-md" />
      </div>
    );
  }

  switch (kind) {
    case "markdown":
      return <MarkdownView source={text} />;
    case "mermaid":
      return <MermaidView source={text} />;
    case "html":
      return (
        <iframe
          title={artifact.filename}
          sandbox="allow-scripts"
          srcDoc={text}
          className="artifact-html-frame"
        />
      );
    case "text":
      return (
        <pre className="artifact-inset text-artifact p-4">{text}</pre>
      );
    default:
      return (
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">Binary file — download to view.</p>
          <a
            href={contentPath}
            download={artifact.filename}
            className="text-[var(--link)] text-sm underline-offset-4 hover:underline"
          >
            Download {artifact.filename}
          </a>
        </div>
      );
  }
}
