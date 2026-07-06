"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyCommand({
  command,
  label = "Quick start",
}: {
  command: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="command-block overflow-hidden">
      <div className="border-border flex items-center justify-between gap-3 border-b px-3.5 py-2">
        <span className="text-muted-foreground text-[0.6875rem] font-medium tracking-[0.1em] uppercase">
          {label}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy command"}
        >
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
      </div>
      <div className="p-3.5">
        <pre className="artifact-inset overflow-x-auto p-3.5 font-mono text-[0.8125rem] leading-relaxed">
        <code>{command}</code>
      </pre>
      </div>
    </div>
  );
}
