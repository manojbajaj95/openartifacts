import { CopyCommand } from "@/components/CopyCommand";
import { SiteHeader } from "@/components/SiteHeader";

const COMMAND = "npx openartifacts@latest upload ./design.md";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 py-12 pb-20">
        <section className="space-y-8">
          <div className="space-y-4">
            <p className="text-[var(--link)] text-[0.6875rem] font-medium tracking-[0.1em] uppercase">
              OpenArtifacts
            </p>
            <h1 className="text-[2rem] leading-[1.12] font-semibold tracking-[-0.02em] text-balance sm:text-[2.5rem]">
              Share artifacts. Get feedback.
            </h1>
            <p className="text-muted-foreground max-w-[38rem] text-[1.0625rem] leading-relaxed text-pretty">
              Upload markdown, images, HTML, mermaid diagrams, and more. One CLI command, one
              link.
            </p>
          </div>

          <CopyCommand command={COMMAND} />

          <div className="space-y-3 border-border/60 border-t pt-6">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Supports{" "}
              <span className="text-foreground/90 font-mono text-[0.8125rem]">.md</span>,{" "}
              <span className="text-foreground/90 font-mono text-[0.8125rem]">.mmd</span>,{" "}
              <span className="text-foreground/90 font-mono text-[0.8125rem]">.html</span>, images,
              and plain text.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Self-host the Next.js app or point the CLI at the default server. Storage is
              S3-compatible — Supabase, MinIO, or AWS.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
