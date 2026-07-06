"use client";

import type { Artifact, Feedback } from "@openartifacts/shared";
import { CheckIcon, Link2Icon } from "lucide-react";
import { useState } from "react";
import { ArtifactRenderer } from "./ArtifactRenderer";
import { SiteHeader } from "./SiteHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export function ArtifactPageClient({
  artifact,
  initialFeedback,
  contentPath,
}: {
  artifact: Artifact;
  initialFeedback: Feedback[];
  contentPath: string;
}) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  async function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/artifacts/${artifact.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, body }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = (await res.json()) as { feedback: Feedback };
      setFeedback((prev) => [...prev, data.feedback]);
      setBody("");
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-8 pb-16">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-[0.6875rem] tracking-normal">
                {artifact.kind}
              </Badge>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight break-words sm:text-[1.75rem]">
              {artifact.filename}
            </h1>
            <p className="text-muted-foreground text-sm">
              {formatBytes(artifact.size)}
              <span aria-hidden className="mx-2 opacity-40">
                ·
              </span>
              <time dateTime={artifact.createdAt}>
                {new Date(artifact.createdAt).toLocaleString()}
              </time>
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyLink}
            className="shrink-0"
          >
            {linkCopied ? (
              <>
                <CheckIcon />
                Copied
              </>
            ) : (
              <>
                <Link2Icon />
                Copy link
              </>
            )}
          </Button>
        </header>

        <div className="artifact-frame artifact-frame--hero mb-10">
          <ArtifactRenderer artifact={artifact} contentPath={contentPath} />
        </div>

        <Separator className="mb-8 opacity-60" />

        <section aria-labelledby="feedback-heading">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 id="feedback-heading" className="text-sm font-medium">
              Feedback
            </h2>
            {feedback.length > 0 ? (
              <span className="text-muted-foreground text-xs tabular-nums">
                {feedback.length} comment{feedback.length === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>

          <form onSubmit={submitFeedback} className="mb-8 grid max-w-xl gap-3">
            <Input
              placeholder="Your name (optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              autoComplete="name"
            />
            <Textarea
              required
              placeholder="Leave a comment on this artifact…"
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <Button type="submit" disabled={submitting || !body.trim()} className="w-fit">
              {submitting ? "Sending…" : "Post feedback"}
            </Button>
          </form>

          {feedback.length === 0 ? (
            <p className="text-muted-foreground feedback-empty text-sm">
              No comments yet — be the first to leave feedback on this artifact.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {feedback.map((item) => (
                <li key={item.id} className="feedback-item">
                  <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-sm font-medium">{item.author || "Anonymous"}</span>
                    <time
                      className="text-muted-foreground text-xs tabular-nums"
                      dateTime={item.createdAt}
                    >
                      {new Date(item.createdAt).toLocaleString()}
                    </time>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{item.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
