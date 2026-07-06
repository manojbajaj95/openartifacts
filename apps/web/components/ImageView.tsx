"use client";

import type { Artifact } from "@openartifacts/shared";
import { DownloadIcon, FileIcon } from "lucide-react";
import { useRef, useState } from "react";

export function ImageView({
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
          <p>It may have been evicted or the link is invalid. Download the raw file to inspect locally.</p>
        </div>
        <a className="artifact-download-button" href={`${contentPath}?download=1`} download={artifact.filename}>
          <DownloadIcon />
          Download
        </a>
      </div>
    );
  }

  return (
    <figure className="artifact-image-stage">
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
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      </button>
      <figcaption className="artifact-image-caption">
        <a href={contentPath} target="_blank" rel="noopener noreferrer" className="text-[var(--link)] hover:underline">
          {artifact.filename}
        </a>
      </figcaption>
      <dialog ref={dialogRef} className="artifact-image-dialog">
        <form method="dialog">
          <button type="submit" aria-label="Close image preview">
            Close
          </button>
        </form>
        <img src={contentPath} alt={artifact.filename} />
      </dialog>
    </figure>
  );
}
