import type { Metadata } from "next";
import Link from "next/link";
import { SitePage } from "@/components/SitePage";

export const metadata: Metadata = {
  title: "About — OpenArtifacts",
  description: "Share artifacts and collect feedback — markdown, diagrams, HTML, and more.",
};

const WHY = [
  {
    title: "Built for work-in-progress",
    body: "Specs, diagrams, and prototypes change fast. OpenArtifacts is a lightweight review surface — not a doc platform, not a design tool.",
  },
  {
    title: "Terminal to browser, one product",
    body: "The CLI prints the same link the web app opens. Upload from your shell; reviewers open it in a tab. Same voice, same density.",
  },
  {
    title: "Self-host when you need to",
    body: "Deploy the Next.js app on Vercel or Docker. Point storage at any S3-compatible bucket — Supabase, MinIO, or AWS.",
  },
] as const;

export default function AboutPage() {
  return (
    <SitePage>
      <article className="space-y-12">
        <header className="space-y-2">
          <h1 className="text-[1.75rem] font-semibold tracking-tight text-balance sm:text-[2rem]">
            OpenArtifacts
          </h1>
          <p className="text-muted-foreground text-[1.0625rem] leading-relaxed">
            Artifact hosting &amp; feedback
          </p>
        </header>

        <div className="text-muted-foreground max-w-[40rem] space-y-4 text-[0.9375rem] leading-relaxed text-pretty">
          <p>
            Upload a file — markdown, mermaid, HTML, an image, or plain text — and get a shareable
            link. Reviewers open it in the browser; the artifact renders cleanly and they can leave
            comments on the page.
          </p>
          <p>
            No account required for uploads or feedback. Use the web UI, the{" "}
            <code className="text-foreground/90 rounded-sm border border-border bg-input px-1.5 py-0.5 font-mono text-[0.8125rem]">
              openartifacts
            </code>{" "}
            CLI, or the HTTP API.
          </p>
        </div>

        <section className="space-y-6" aria-labelledby="why-heading">
          <div className="space-y-2">
            <h2
              id="why-heading"
              className="text-foreground text-lg font-semibold tracking-tight"
            >
              Why OpenArtifacts
            </h2>
            <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">
              Most review stacks are heavy. This one stays out of the way.
            </p>
          </div>

          <ul className="space-y-5">
            {WHY.map((item) => (
              <li key={item.title} className="space-y-1">
                <h3 className="text-foreground text-[0.9375rem] font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-[0.9375rem] leading-relaxed text-pretty">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-sm">
          <Link href="/api" className="text-[var(--link)] hover:underline">
            API documentation
          </Link>
          <span className="text-muted-foreground mx-2" aria-hidden>
            ·
          </span>
          <a
            href="https://github.com/manojbajaj95/openartifacts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--link)] hover:underline"
          >
            Source on GitHub
          </a>
        </p>
      </article>
    </SitePage>
  );
}
