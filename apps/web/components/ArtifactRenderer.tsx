"use client";

import type { Artifact, ArtifactKind } from "@openartifacts/shared";
import { kindFromFilename } from "@openartifacts/shared";
import { useEffect, useState } from "react";
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
        style={{ maxWidth: "100%", height: "auto", display: "block", margin: "0 auto" }}
      />
    );
  }

  if (error) {
    return <p style={{ color: "var(--danger)" }}>{error}</p>;
  }

  if (text === null) {
    return <p style={{ color: "var(--muted)" }}>Loading...</p>;
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
          style={{ width: "100%", minHeight: "480px", border: "0", borderRadius: "8px", background: "white" }}
        />
      );
    case "text":
      return <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{text}</pre>;
    default:
      return (
        <div>
          <p style={{ color: "var(--muted)" }}>Binary file — download to view.</p>
          <a href={contentPath} download={artifact.filename}>
            Download {artifact.filename}
          </a>
        </div>
      );
  }
}
