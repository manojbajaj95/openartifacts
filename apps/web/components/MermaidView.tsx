"use client";

import { useEffect, useId, useRef, useState } from "react";

export function MermaidView({ source }: { source: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
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
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "dark",
          themeVariables: {
            background: "transparent",
            primaryColor: "#14181f",
            primaryTextColor: "#e8ecf4",
            primaryBorderColor: "#2a3140",
            lineColor: "#6ea8ff",
            secondaryColor: "#0a0e14",
            tertiaryColor: "#0b0d10",
            fontFamily: "var(--font-sans)",
          },
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
  }, [id, source]);

  useEffect(() => {
    if (!svgRef.current) return;
    svgRef.current.innerHTML = svg ?? "";
  }, [svg]);

  if (error) {
    return (
      <div className="artifact-mermaid-error">
        <p className="text-sm font-medium text-destructive">Mermaid could not render this diagram.</p>
        <pre className="artifact-inset text-artifact p-4">{source}</pre>
        <p className="text-muted-foreground text-xs">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={svgRef}
      className="mermaid-view"
      aria-busy={!svg}
    >
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
