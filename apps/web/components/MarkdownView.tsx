"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MermaidView } from "./MermaidView";

function CodeBlock({ className, children }: { className?: string; children?: React.ReactNode }) {
  const lang = className?.replace("language-", "") ?? "";
  const text = String(children ?? "").replace(/\n$/, "");
  if (lang === "mermaid") {
    return <MermaidView source={text} />;
  }
  return (
    <pre>
      <code className={className}>{children}</code>
    </pre>
  );
}

export function MarkdownView({ source }: { source: string }) {
  return (
    <article className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { inline, className, children } = props as {
              inline?: boolean;
              className?: string;
              children?: React.ReactNode;
            };
            if (inline) {
              return <code>{children}</code>;
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </article>
  );
}
