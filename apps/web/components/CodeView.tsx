"use client";

import { languageFromFilename } from "@openartifacts/shared";
import { MessageResponse } from "@/components/ai-elements/message";

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
  );
}
