"use client";

import type { Artifact, Feedback } from "@openartifacts/shared";
import { useState } from "react";
import { ArtifactRenderer } from "./ArtifactRenderer";

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
    <main className="artifact-page">
      <header>
        <p className="eyebrow">{artifact.kind}</p>
        <h1>{artifact.filename}</h1>
        <p className="meta">
          {formatBytes(artifact.size)} · {new Date(artifact.createdAt).toLocaleString()}
        </p>
      </header>

      <section className="viewer">
        <ArtifactRenderer artifact={artifact} contentPath={contentPath} />
      </section>

      <section className="feedback">
        <h2>Feedback</h2>
        <form onSubmit={submitFeedback}>
          <input
            placeholder="Your name (optional)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <textarea
            required
            placeholder="Leave a comment..."
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Post feedback"}
          </button>
        </form>
        <ul>
          {feedback.map((item) => (
            <li key={item.id}>
              <strong>{item.author}</strong>
              <time>{new Date(item.createdAt).toLocaleString()}</time>
              <p>{item.body}</p>
            </li>
          ))}
          {feedback.length === 0 ? <li className="empty">No feedback yet.</li> : null}
        </ul>
      </section>
    </main>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
