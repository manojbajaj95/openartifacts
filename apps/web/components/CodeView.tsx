"use client";

import { languageFromFilename } from "@openartifacts/shared";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { MessageResponse } from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";

function fenceFor(source: string): string {
  const longest = Math.max(...(source.match(/`+/g) ?? [""]).map((ticks) => ticks.length));
  return "`".repeat(Math.max(4, longest + 1));
}

export function CodeView({
  filename,
  source,
}: {
  filename: string;
  source: string;
}) {
  const language = languageFromFilename(filename) ?? "text";
  const fence = fenceFor(source);
  const lineCount = Math.max(1, source.split("\n").length);
  const lineNumbers = Array.from({ length: lineCount }, (_, index) => index + 1);

  return (
    <div className="artifact-code-shell">
      <div className="artifact-code-head">
        <span className="artifact-code-filename" title={filename}>
          {filename}
        </span>
        {language !== "text" ? <span className="artifact-code-lang">{language}</span> : null}
        <CopySourceButton source={source} />
      </div>
      <div className="artifact-code-view">
        <div className="artifact-code-gutter" aria-hidden="true">
          {lineNumbers.map((lineNumber) => (
            <span key={`line-${lineNumber}`}>{lineNumber}</span>
          ))}
        </div>
        <div className="artifact-code-body">
          <MessageResponse parseIncompleteMarkdown={false}>
            {`${fence}${language}\n${source}\n${fence}`}
          </MessageResponse>
        </div>
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
    <Button type="button" variant="ghost" size="xs" onClick={copy} aria-label={copied ? "Copied" : "Copy code"}>
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
