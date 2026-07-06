"use client";

import type { Artifact, Feedback } from "@openartifacts/shared";
import { effectiveArtifactKind } from "@openartifacts/shared";
import {
  CheckIcon,
  CodeIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  MoreHorizontalIcon,
  Share2Icon,
} from "lucide-react";
import { useState } from "react";
import { ArtifactRenderer } from "./ArtifactRenderer";
import { SiteFooter } from "@/components/SiteFooter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TEXT_KINDS = new Set([
  "markdown",
  "mermaid",
  "html",
  "code",
  "text",
  "json",
  "trace",
  "diff",
  "terminal",
]);

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
  const [posted, setPosted] = useState(false);

  const kind = effectiveArtifactKind(artifact);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(artifactUrl());
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  async function shareArtifact() {
    const url = artifactUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title: artifact.filename, url });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    await copyLink();
  }

  async function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setPosted(false);
    try {
      const res = await fetch(`/api/artifacts/${artifact.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, body }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? `Failed to post feedback (${res.status})`);
      }
      const data = (await res.json()) as { feedback: Feedback };
      setFeedback((prev) => [...prev, data.feedback]);
      setBody("");
      setPosted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  function artifactUrl() {
    return `${window.location.origin}/a/${artifact.id}`;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <ArtifactToolbar
        artifact={artifact}
        contentPath={contentPath}
        kind={kind}
        copied={linkCopied}
        onCopy={copyLink}
        onShare={shareArtifact}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-5">
        <div className={`artifact-frame artifact-frame--${kind} artifact-frame--hero`}>
          <ArtifactRenderer artifact={artifact} contentPath={contentPath} />
        </div>

        <section
          aria-labelledby="feedback-heading"
          className="mx-auto mt-10 w-full max-w-4xl border-t border-border pt-8"
        >
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
            <div className="grid gap-1.5">
              <label htmlFor="feedback-author" className="sr-only">
                Your name (optional)
              </label>
              <Input
                id="feedback-author"
                placeholder="Your name (optional)"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                autoComplete="name"
                maxLength={80}
              />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="feedback-body" className="sr-only">
                Comment
              </label>
              <Textarea
                id="feedback-body"
                required
                placeholder="Leave a comment on this artifact…"
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={4000}
              />
            </div>
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={submitting || !body.trim()} className="w-fit">
                {submitting ? "Sending…" : "Post feedback"}
              </Button>
              {posted ? (
                <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                  <CheckIcon className="size-3.5" aria-hidden />
                  Posted
                </span>
              ) : null}
            </div>
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

      <SiteFooter className="border-border sticky bottom-0 shrink-0 border-t bg-background px-5 py-4 text-center" />
    </div>
  );
}

function ArtifactToolbar({
  artifact,
  contentPath,
  kind,
  copied,
  onCopy,
  onShare,
}: {
  artifact: Artifact;
  contentPath: string;
  kind: string;
  copied: boolean;
  onCopy: () => void;
  onShare: () => void;
}) {
  const rawPath = `${contentPath}?download=1`;

  return (
    <header className="artifact-toolbar shrink-0">
      <div className="artifact-toolbar__inner">
        <div className="artifact-toolbar__title">
          <span className="truncate font-medium text-foreground" title={artifact.filename}>
            {artifact.filename}
          </span>
          <span aria-hidden className="artifact-toolbar__dot">
            ·
          </span>
          <span className="artifact-kind-badge">{kind}</span>
          <span className="text-muted-foreground hidden sm:inline tabular-nums">
            {formatBytes(artifact.size)}
          </span>
          <time
            className="text-muted-foreground hidden md:inline tabular-nums"
            dateTime={artifact.createdAt}
            suppressHydrationWarning
          >
            {formatRelativeTime(artifact.createdAt)}
          </time>
        </div>
        <div className="artifact-toolbar__actions">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={onCopy}
            aria-label={copied ? "Link copied" : "Copy artifact link"}
          >
            {copied ? <CheckIcon aria-hidden /> : <CopyIcon aria-hidden />}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={onShare}
            aria-label="Share artifact"
          >
            <Share2Icon aria-hidden />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button type="button" variant="outline" size="icon-sm" aria-label="More artifact actions" />
              }
            >
              <MoreHorizontalIcon aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              <DropdownMenuItem render={<a href={rawPath} download={artifact.filename} />}>
                <DownloadIcon />
                Download raw
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<a href={contentPath} target="_blank" rel="noopener noreferrer" />}
              >
                <ExternalLinkIcon />
                Open raw
              </DropdownMenuItem>
              {TEXT_KINDS.has(kind) ? (
                <DropdownMenuItem
                  render={<a href={contentPath} target="_blank" rel="noopener noreferrer" />}
                >
                  <CodeIcon />
                  View source
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function formatRelativeTime(value: string): string {
  const diff = Date.now() - new Date(value).getTime();
  const abs = Math.abs(diff);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  if (abs < minute) return "just now";
  if (abs < hour) return rtf.format(Math.round(-diff / minute), "minute");
  if (abs < day) return rtf.format(Math.round(-diff / hour), "hour");
  return rtf.format(Math.round(-diff / day), "day");
}
