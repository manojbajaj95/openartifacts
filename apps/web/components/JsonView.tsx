"use client";

import { useMemo, useState } from "react";

function JsonNode({ value, depth }: { value: unknown; depth: number }) {
  const isContainer = typeof value === "object" && value !== null;
  if (!isContainer) return <Primitive value={value} />;
  return <Container value={value as object} depth={depth} />;
}

type Entry = readonly [string, unknown];

function Container({ value, depth }: { value: object; depth: number }) {
  const [open, setOpen] = useState(depth === 0);
  const isArray = Array.isArray(value);
  const entries: Entry[] = isArray
    ? (value as unknown[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);
  const count = entries.length;
  const openCh = isArray ? "[" : "{";
  const closeCh = isArray ? "]" : "}";
  const summary = isArray
    ? `${count} item${count === 1 ? "" : "s"}`
    : `${count} key${count === 1 ? "" : "s"}`;

  if (count === 0) {
    return (
      <span className="json-empty">
        {openCh}
        {closeCh}
      </span>
    );
  }

  return (
    <>
      <button type="button" className="json-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? "\u25BE" : "\u25B8"} {openCh}
      </button>
      {open ? (
        <span className="json-children">
          {entries.map(([key, val], index) => (
            <span key={key} className="json-child">
              {!isArray ? (
                <>
                  <span className="json-key">&quot;{key}&quot;</span>
                  <span className="json-colon">: </span>
                </>
              ) : null}
              <JsonNode value={val} depth={depth + 1} />
              {index < entries.length - 1 ? <span className="json-comma">,</span> : null}
            </span>
          ))}
          <span className="json-close">{closeCh}</span>
        </span>
      ) : (
        <span className="json-summary">
          {" "}
          {summary} {closeCh}
        </span>
      )}
    </>
  );
}

function Primitive({ value }: { value: unknown }) {
  const type =
    value === null
      ? "null"
      : typeof value === "string"
        ? "string"
        : typeof value === "number"
          ? "number"
          : typeof value === "boolean"
            ? "boolean"
            : "other";

  const display =
    value === null
      ? "null"
      : typeof value === "string"
        ? `"${value}"`
        : String(value);

  return <span className={`json-value json-${type}`}>{display}</span>;
}

export function JsonView({ source }: { source: string }) {
  const data = useMemo(() => {
    try {
      return JSON.parse(source) as unknown;
    } catch {
      return null;
    }
  }, [source]);

  if (data === null) {
    return (
      <div className="artifact-empty-state">
        <p>Invalid JSON — showing raw text is not supported; fix the file or download it.</p>
      </div>
    );
  }

  return (
    <div className="json-surface">
      <JsonNode value={data} depth={0} />
    </div>
  );
}
