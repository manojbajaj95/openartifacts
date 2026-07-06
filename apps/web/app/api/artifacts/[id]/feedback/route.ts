import { getArtifact, insertFeedback, listFeedback } from "@/lib/db";
import { toFeedback } from "@/lib/serialize";

export const runtime = "nodejs";

const MAX_AUTHOR_LENGTH = 80;
const MAX_BODY_LENGTH = 4000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const feedbackBuckets = new Map<string, { count: number; resetAt: number }>();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!(await getArtifact(id))) {
    return Response.json({ error: "not found" }, { status: 404 });
  }
  return Response.json({ feedback: (await listFeedback(id)).map(toFeedback) });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!(await getArtifact(id))) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  const rateLimit = checkRateLimit(request, id);
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "too many feedback posts; try again in a minute" },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)) },
      },
    );
  }

  const payload = await request.json().catch(() => null) as { author?: unknown; body?: unknown } | null;
  if (!payload || typeof payload.body !== "string") {
    return Response.json({ error: "body is required" }, { status: 400 });
  }

  const author = typeof payload.author === "string" ? payload.author.trim() : "";
  const text = payload.body.trim();
  if (!text) {
    return Response.json({ error: "body is required" }, { status: 400 });
  }
  if (author.length > MAX_AUTHOR_LENGTH) {
    return Response.json({ error: `author must be ${MAX_AUTHOR_LENGTH} characters or less` }, { status: 400 });
  }
  if (text.length > MAX_BODY_LENGTH) {
    return Response.json({ error: `body must be ${MAX_BODY_LENGTH} characters or less` }, { status: 400 });
  }

  const row = await insertFeedback({
    artifactId: id,
    author: author || "Anonymous",
    body: text,
    createdAt: new Date().toISOString(),
  });

  return Response.json({ feedback: toFeedback(row) }, { status: 201 });
}

function checkRateLimit(request: Request, artifactId: string): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const key = `${clientIp(request)}:${artifactId}`;
  const now = Date.now();
  const current = feedbackBuckets.get(key);

  if (!current || current.resetAt <= now) {
    feedbackBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfterMs: current.resetAt - now };
  }

  current.count += 1;
  return { allowed: true };
}

function clientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}
