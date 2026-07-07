"use client";

import type { Artifact } from "@openartifacts/shared";
import { effectiveArtifactKind } from "@openartifacts/shared";
import dynamic from "next/dynamic";
import { DownloadIcon, FileIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CodeView } from "./CodeView";
import { HtmlView } from "./HtmlView";
import { ImageView } from "./ImageView";
import { JsonView } from "./JsonView";
import { MarkdownView } from "./MarkdownView";
import { SandboxedRenderView } from "./SandboxedRenderView";
import { TextView } from "./TextView";
import { TraceView } from "./TraceView";

const MermaidView = dynamic(
  () => import("./MermaidView").then((module) => module.MermaidView),
  {
    ssr: false,
    loading: () => (
      <div
        className="artifact-skeleton artifact-skeleton--diagram"
        role="status"
        aria-label="Loading diagram"
      />
    ),
  },
);

const PdfView = dynamic(
  () => import("./PdfView").then((module) => module.PdfView),
  {
    ssr: false,
    loading: () => (
      <div
        className="artifact-skeleton artifact-skeleton--pdf"
        role="status"
        aria-label="Loading PDF"
      />
    ),
  },
);

const SERVER_RENDER_KINDS = new Set(["markdown", "diff", "terminal"]);

export function ArtifactRenderer({
  artifact,
  contentPath,
}: {
  artifact: Artifact;
  contentPath: string;
}) {
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const kind = effectiveArtifactKind(artifact);

  useEffect(() => {
    setText(null);
    setError(null);
    if (kind === "image" || kind === "pdf" || kind === "binary" || SERVER_RENDER_KINDS.has(kind)) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(contentPath);
        if (!res.ok) throw new Error(`Failed to load content (${res.status})`);
        const loadedText = await res.text();
        if (!cancelled) setText(loadedText);
      } catch (err) {
        if (!cancelled) setError(String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [kind, contentPath]);

  if (kind === "image") {
    return <ImageView artifact={artifact} contentPath={contentPath} />;
  }

  if (kind === "pdf") {
    return <PdfView artifact={artifact} contentPath={contentPath} />;
  }

  if (kind === "binary") {
    return <BinaryView artifact={artifact} contentPath={contentPath} />;
  }

  if (kind === "markdown") {
    return <MarkdownView artifactId={artifact.id} title={artifact.filename} />;
  }

  if (kind === "diff" || kind === "terminal") {
    return <SandboxedRenderView artifactId={artifact.id} title={artifact.filename} />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (text === null) {
    return <ArtifactSkeleton kind={kind} />;
  }

  switch (kind) {
    case "mermaid":
      return <MermaidView source={text} />;
    case "html":
      return <HtmlView filename={artifact.filename} source={text} />;
    case "code":
      return <CodeView filename={artifact.filename} source={text} />;
    case "text":
      return <TextView filename={artifact.filename} source={text} />;
    case "json":
      return <JsonView source={text} />;
    case "trace":
      return <TraceView source={text} title={artifact.filename} />;
    default:
      return <TextView filename={artifact.filename} source={text} />;
  }
}

function ArtifactSkeleton({ kind }: { kind: string }) {
  if (kind === "mermaid") {
    return (
      <div
        className="artifact-skeleton artifact-skeleton--diagram"
        role="status"
        aria-busy="true"
        aria-label="Loading diagram"
      />
    );
  }

  if (kind === "html") {
    return (
      <div
        className="artifact-skeleton artifact-skeleton--frame"
        role="status"
        aria-busy="true"
        aria-label="Loading HTML preview"
      />
    );
  }

  if (kind === "pdf") {
    return (
      <div
        className="artifact-skeleton artifact-skeleton--pdf"
        role="status"
        aria-busy="true"
        aria-label="Loading PDF"
      />
    );
  }

  if (kind === "markdown" || kind === "diff" || kind === "terminal") {
    return (
      <div
        className="artifact-skeleton artifact-skeleton--frame"
        role="status"
        aria-busy="true"
        aria-label="Loading preview"
      />
    );
  }

  const lines = kind === "code" || kind === "text" || kind === "json" || kind === "trace" ? 10 : 6;
  const skeletonLines = Array.from({ length: lines }, (_, index) => ({
    id: `skeleton-line-${index + 1}`,
    width: `${92 - ((index * 13) % 36)}%`,
  }));

  return (
    <div className="artifact-skeleton-lines" role="status" aria-busy="true" aria-label="Loading artifact">
      {skeletonLines.map((line) => (
        <span key={line.id} style={{ width: line.width }} />
      ))}
    </div>
  );
}

function BinaryView({
  artifact,
  contentPath,
}: {
  artifact: Artifact;
  contentPath: string;
}) {
  return (
    <div className="artifact-empty-state">
      <FileIcon aria-hidden="true" />
      <div>
        <h2>{artifact.filename}</h2>
        <p>
          {artifact.contentType || "application/octet-stream"} · {formatBytes(artifact.size)}
        </p>
      </div>
      <a className="artifact-download-button" href={`${contentPath}?download=1`} download={artifact.filename}>
        <DownloadIcon />
        Download
      </a>
    </div>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
