"use client";

import { useEffect, useId, useRef } from "react";
import mermaid from "mermaid";

export function MermaidView({ source }: { source: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderId = useId().replace(/:/g, "");

  useEffect(() => {
    let cancelled = false;
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "strict",
    });

    (async () => {
      try {
        const { svg } = await mermaid.render(`mmd-${renderId}`, source);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        if (!cancelled && containerRef.current) {
          containerRef.current.textContent = `Mermaid error: ${String(err)}`;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source, renderId]);

  return <div ref={containerRef} className="mermaid" />;
}
