import Link from "next/link";
import { CopyCommand } from "@/components/CopyCommand";
import { SiteHeader } from "@/components/SiteHeader";
import { UploadArtifact } from "@/components/UploadArtifact";

const COMMAND = "npx openartifacts@latest upload ./design.md";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-2xl flex-col px-5 py-16 sm:py-24">
        <section className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-[2rem] leading-[1.12] font-semibold tracking-[-0.02em] text-balance sm:text-[2.25rem]">
              Share artifacts. Get feedback.
            </h1>
            <p className="text-muted-foreground text-[1rem] leading-relaxed text-pretty">
              Markdown, mermaid, HTML, images, and text — one link, rendered in the browser.
            </p>
          </div>

          <UploadArtifact />

          <div className="space-y-3">
            <p className="text-muted-foreground text-center text-sm">or from the terminal</p>
            <CopyCommand command={COMMAND} />
          </div>
        </section>

        <footer className="text-muted-foreground mt-20 text-xs">
          <Link href="/about" className="text-[var(--link)] hover:underline">
            About
          </Link>
          <span className="mx-2 opacity-40" aria-hidden>
            ·
          </span>
          <Link href="/api" className="text-[var(--link)] hover:underline">
            API
          </Link>
          <span className="mx-2 opacity-40" aria-hidden>
            ·
          </span>
          <a
            href="https://github.com/manojbajaj95/openartifacts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--link)] hover:underline"
          >
            GitHub
          </a>
        </footer>
      </main>
    </>
  );
}
