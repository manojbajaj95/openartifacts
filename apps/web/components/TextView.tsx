"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TextView({ source }: { source: string }) {
  const lines = source.split("\n");
  const lineNumbers = Array.from({ length: Math.max(1, lines.length) }, (_, index) => index + 1);

  return (
    <div className="artifact-text-view">
      <div className="artifact-code-head">
        <span className="artifact-code-filename">Plain text</span>
        <CopySourceButton source={source} />
      </div>
      <div className="artifact-code-view artifact-code-view--text">
        <div className="artifact-code-gutter" aria-hidden="true">
          {lineNumbers.map((lineNumber) => (
            <span key={`line-${lineNumber}`}>{lineNumber}</span>
          ))}
        </div>
        <pre className="artifact-text-body text-artifact">{source}</pre>
      </div>
    </div>
  );
}

function CopySourceButton({ source }: { source: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <Button type="button" variant="ghost" size="xs" onClick={copy} aria-label={copied ? "Copied" : "Copy text"}>
      {copied ? (
        <>
          <CheckIcon />
          Copied
        </>
      ) : (
        <>
          <CopyIcon />
          Copy
        </>
      )}
    </Button>
  );
}
