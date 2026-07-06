export type TraceStep = {
  label: string;
  kind?: string;
  detail?: string;
  ts?: string;
};

/** Parse JSON array, single object, or JSONL into trace steps. */
export function parseTrace(text: string): TraceStep[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const toStep = (value: unknown): TraceStep | null => {
    if (typeof value === "string") return { label: value };
    if (value && typeof value === "object" && typeof (value as { label?: unknown }).label === "string") {
      const row = value as Record<string, unknown>;
      return {
        label: String(row.label),
        ...(typeof row.kind === "string" && { kind: row.kind }),
        ...(typeof row.detail === "string" && { detail: row.detail }),
        ...(typeof row.ts === "string" && { ts: row.ts }),
      };
    }
    return null;
  };

  try {
    const parsed = JSON.parse(trimmed);
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    return arr.map(toStep).filter((step): step is TraceStep => step !== null);
  } catch {
    return trimmed
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return toStep(JSON.parse(line));
        } catch {
          return { label: line };
        }
      })
      .filter((step): step is TraceStep => step !== null);
  }
}
