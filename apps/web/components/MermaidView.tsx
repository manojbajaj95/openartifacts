"use client";

import { MessageResponse } from "@/components/ai-elements/message";

export function MermaidView({ source }: { source: string }) {
  return (
    <div className="mermaid-view">
      <MessageResponse parseIncompleteMarkdown={false}>{`\`\`\`mermaid\n${source}\n\`\`\``}</MessageResponse>
    </div>
  );
}
