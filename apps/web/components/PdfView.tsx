"use client";

import type { Artifact } from "@openartifacts/shared";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, FileIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export function PdfView({
  artifact,
  contentPath,
}: {
  artifact: Artifact;
  contentPath: string;
}) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [width, setWidth] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPageNumber(1);
    setNumPages(0);
    setFailed(false);
  }, [contentPath]);

  if (failed) {
    return (
      <div className="artifact-empty-state">
        <FileIcon aria-hidden="true" />
        <div>
          <h2>PDF unavailable</h2>
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
    <div className="artifact-pdf-stage" ref={stageRef}>
      <Document
        file={contentPath}
        onLoadSuccess={({ numPages: total }) => setNumPages(total)}
        onLoadError={() => setFailed(true)}
        loading={
          <div
            className="artifact-skeleton artifact-skeleton--pdf"
            role="status"
            aria-label="Loading PDF"
          />
        }
      >
        {width ? (
          <Page
            pageNumber={pageNumber}
            width={width}
            renderTextLayer
            renderAnnotationLayer
            loading={
              <div
                className="artifact-skeleton artifact-skeleton--pdf"
                role="status"
                aria-label="Rendering page"
              />
            }
          />
        ) : null}
      </Document>

      {numPages > 1 ? (
        <nav className="artifact-pdf-nav" aria-label="PDF pages">
          <button
            type="button"
            className="artifact-pdf-nav__button"
            onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
            disabled={pageNumber <= 1}
            aria-label="Previous page"
          >
            <ChevronLeftIcon aria-hidden />
          </button>
          <span className="artifact-pdf-nav__label tabular-nums">
            Page {pageNumber} of {numPages}
          </span>
          <button
            type="button"
            className="artifact-pdf-nav__button"
            onClick={() => setPageNumber((page) => Math.min(numPages, page + 1))}
            disabled={pageNumber >= numPages}
            aria-label="Next page"
          >
            <ChevronRightIcon aria-hidden />
          </button>
        </nav>
      ) : null}
    </div>
  );
}
