"use client";

import type { Artifact } from "@openartifacts/shared";
import { effectiveArtifactKind } from "@openartifacts/shared";
import { DownloadIcon, FileIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CodeView } from "./CodeView";
import { MarkdownView } from "./MarkdownView";
import { MermaidView } from "./MermaidView";

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
    if (kind === "image" || kind === "binary") return;

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

  if (kind === "binary") {
    return <BinaryView artifact={artifact} contentPath={contentPath} />;
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
    case "markdown":
      return <MarkdownView source={text} />;
    case "mermaid":
      return <MermaidView source={text} />;
    case "html":
      return <HtmlView filename={artifact.filename} source={text} />;
    case "code":
      return <CodeView filename={artifact.filename} source={text} />;
    case "text":
      return (
        <pre className="artifact-inset text-artifact p-4">{text}</pre>
      );
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

  const lines = kind === "code" || kind === "text" ? 10 : 6;
  const skeletonLines = Array.from({ length: lines }, (_, index) => ({
    id: `skeleton-line-${index + 1}`,
    width: `${92 - ((index * 13) % 36)}%`,
  }));

  return (
    <div className="artifact-skeleton-lines" role="status" aria-busy="true" aria-label="Loading artifact">
      {skeletonLines.map((line) => (
        <span
          key={line.id}
          style={{ width: line.width }}
        />
      ))}
    </div>
  );
}

function ImageView({
  artifact,
  contentPath,
}: {
  artifact: Artifact;
  contentPath: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (failed) {
    return (
      <div className="artifact-empty-state">
        <FileIcon aria-hidden="true" />
        <div>
          <h2>Image unavailable</h2>
          <p>Download the raw file to inspect it locally.</p>
        </div>
        <a className="artifact-download-button" href={`${contentPath}?download=1`} download={artifact.filename}>
          <DownloadIcon />
          Download
        </a>
      </div>
    );
  }

  return (
    <div className="artifact-image-stage">
      {!loaded ? (
        <div
          className="artifact-skeleton artifact-skeleton--image"
          role="status"
          aria-label="Loading image"
        />
      ) : null}
      <button
        type="button"
        className="artifact-image-button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`Zoom ${artifact.filename}`}
      >
        <img
          src={contentPath}
          alt={artifact.filename}
          className="artifact-image"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      </button>
      <dialog ref={dialogRef} className="artifact-image-dialog">
        <form method="dialog">
          <button type="submit" aria-label="Close image preview">
            Close
          </button>
        </form>
        <img src={contentPath} alt={artifact.filename} />
      </dialog>
    </div>
  );
}

function HtmlView({
  filename,
  source,
}: {
  filename: string;
  source: string;
}) {
  const [height, setHeight] = useState(520);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type !== "openartifacts:resize") return;
      const nextHeight = Number(event.data.height);
      if (!Number.isFinite(nextHeight)) return;
      setHeight(Math.min(1600, Math.max(360, Math.ceil(nextHeight))));
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title={filename}
      sandbox="allow-scripts"
      srcDoc={withResizeScript(source)}
      className="artifact-html-frame"
      style={{ height }}
    />
  );
}

function withResizeScript(source: string): string {
  const script = `<script>
(() => {
  const send = () => {
    const body = document.body;
    const root = document.documentElement;
    const height = Math.max(
      body ? body.scrollHeight : 0,
      root ? root.scrollHeight : 0,
      body ? body.offsetHeight : 0,
      root ? root.offsetHeight : 0
    );
    parent.postMessage({ type: "openartifacts:resize", height }, "*");
  };
  addEventListener("load", send);
  new ResizeObserver(send).observe(document.documentElement);
  setTimeout(send, 0);
})();
</script>`;

  if (source.includes("</body>")) {
    return source.replace("</body>", `${script}</body>`);
  }
  return `${source}${script}`;
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
