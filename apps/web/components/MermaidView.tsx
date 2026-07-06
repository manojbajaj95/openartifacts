"use client";

import { useEffect, useId, useRef, useState } from "react";
import { getMermaidThemeConfig } from "@/lib/artifact-surface";
import { useResolvedThemeMode } from "@/lib/use-resolved-theme-mode";

export function MermaidView({ source }: { source: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const mode = useResolvedThemeMode();
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mounted.current = true;
    setSvg(null);
    setError(null);

    (async () => {
      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;
        const theme = getMermaidThemeConfig(mode);

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          suppressErrorRendering: true,
          theme: "base",
          themeVariables: theme.themeVariables,
          themeCSS: theme.themeCSS,
        });

        await mermaid.parse(source);
        const result = await mermaid.render(`artifact-mermaid-${id}`, source);
        if (mounted.current) setSvg(result.svg);
      } catch (err) {
        if (mounted.current) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, [id, source, mode]);

  useEffect(() => {
    if (!svgRef.current) return;
    svgRef.current.innerHTML = svg ?? "";
  }, [svg]);

  if (error) {
    return (
      <div className="artifact-mermaid-error">
        <p className="text-sm font-medium text-destructive">
          Couldn&apos;t render diagram — {error}
        </p>
        <pre className="artifact-inset text-artifact p-4">{source}</pre>
      </div>
    );
  }

  return (
    <div ref={svgRef} className="mermaid-view" aria-busy={!svg}>
      {svg ? null : (
        <div
          className="artifact-skeleton artifact-skeleton--diagram"
          role="status"
          aria-label="Loading diagram"
        />
      )}
    </div>
  );
}
