"use client";

import { clampFrameHeight, wrapHtmlDocument } from "@/lib/artifact-surface";
import { useResolvedThemeMode } from "@/lib/use-resolved-theme-mode";
import { useEffect, useMemo, useRef, useState } from "react";

export function HtmlView({
  filename,
  source,
}: {
  filename: string;
  source: string;
}) {
  const mode = useResolvedThemeMode();
  const [height, setHeight] = useState(520);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const srcDoc = useMemo(() => wrapHtmlDocument(source, mode), [source, mode]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== iframeRef.current?.contentWindow) return;

      if (event.data?.type === "openartifacts:resize") {
        setHeight(clampFrameHeight(event.data.height));
        return;
      }

      if (event.data?.type === "openartifacts:open-link" && typeof event.data.url === "string") {
        const url = event.data.url;
        if (/^https?:/i.test(url)) {
          window.open(url, "_blank", "noopener,noreferrer");
        }
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title={filename}
      sandbox="allow-scripts"
      srcDoc={srcDoc}
      className="artifact-html-frame"
      style={{ height }}
    />
  );
}
