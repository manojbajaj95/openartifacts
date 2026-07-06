"use client";

import { parseTrace, type TraceStep } from "@/lib/trace-parse";
import { useMemo, useState } from "react";

function TraceRow({ step }: { step: TraceStep }) {
  const [open, setOpen] = useState(false);
  const hasDetail = !!step.detail;

  return (
    <li className={`trace-step${open ? " open" : ""}`}>
      <div
        className={`trace-row${hasDetail ? " clickable" : ""}`}
        role={hasDetail ? "button" : undefined}
        tabIndex={hasDetail ? 0 : undefined}
        onClick={() => hasDetail && setOpen(!open)}
        onKeyDown={(event) => {
          if (!hasDetail) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(!open);
          }
        }}
      >
        {step.kind ? <span className="trace-kind">{step.kind}</span> : null}
        <span className="trace-label">{step.label}</span>
        {step.ts ? <span className="trace-ts">{step.ts}</span> : null}
      </div>
      {hasDetail && open ? <pre className="trace-detail">{step.detail}</pre> : null}
    </li>
  );
}

export function TraceView({ source, title }: { source: string; title?: string }) {
  const steps = useMemo(() => parseTrace(source), [source]);

  if (steps.length === 0) {
    return (
      <div className="artifact-empty-state">
        <p>No trace steps found. Expected JSON array or JSONL with a <code>label</code> field.</p>
      </div>
    );
  }

  return (
    <div className="trace-surface">
      <div className="trace-head">
        <span className="trace-title">{title ?? "Agent trace"}</span>
        <span className="trace-count">{steps.length} step{steps.length === 1 ? "" : "s"}</span>
      </div>
      <ol className="trace-steps">
        {steps.map((step, index) => (
          <TraceRow key={`${step.label}-${index}`} step={step} />
        ))}
      </ol>
    </div>
  );
}
