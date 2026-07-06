"use client";

import { clampFrameHeight } from "@/lib/artifact-surface";
import { useResolvedThemeMode } from "@/lib/use-resolved-theme-mode";
import { useEffect, useRef, useState } from "react";

export function SandboxedRenderView({
  artifactId,
  title,
}: {
  artifactId: string;
  title: string;
}) {
  const mode = useResolvedThemeMode();
  const [height, setHeight] = useState(520);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const src = `/api/artifacts/${artifactId}/render?mode=${mode}`;

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

      if (event.data?.type === "openartifacts:copy" && typeof event.data.text === "string") {
        void navigator.clipboard.writeText(event.data.text).catch(() => undefined);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      key={src}
      ref={iframeRef}
      title={title}
      sandbox="allow-scripts"
      src={src}
      className="artifact-rich-frame"
      style={{ height }}
    />
  );
}
