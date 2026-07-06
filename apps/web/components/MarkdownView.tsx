"use client";

import { MessageResponse } from "@/components/ai-elements/message";

export function MarkdownView({ source }: { source: string }) {
  return (
    <article className="artifact-markdown">
      <MessageResponse parseIncompleteMarkdown={false}>{source}</MessageResponse>
    </article>
  );
}
