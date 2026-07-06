import { CopyCommand } from "@/components/CopyCommand";
import { GITHUB_URL, SiteFooter } from "@/components/SiteFooter";
import { UploadArtifact } from "@/components/UploadArtifact";

const COMMAND = "npx openartifacts@latest upload ./design.md";
const AGENT_COMMAND = "npx skills add manojbajaj95/openartifacts -g -y -a universal";
const AGENT_INSTALL_URL = `${GITHUB_URL}/blob/main/INSTALL_FOR_AGENTS.md`;

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-8">
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

        <section className="border-border mt-12 space-y-4 border-t pt-8">
          <div className="space-y-1.5">
            <h2 className="text-[0.9375rem] font-semibold">Install for agents</h2>
            <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
              Give Cursor, Claude Code, or any skills-aware agent the share-for-feedback
              workflow — upload, hand back the review link, collect comments.
            </p>
          </div>
          <CopyCommand command={AGENT_COMMAND} label="Agent skill" />
          <p className="text-muted-foreground text-sm leading-relaxed">
            Or point your agent at{" "}
            <a
              href={AGENT_INSTALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--link)] transition-colors duration-150 hover:underline"
            >
              INSTALL_FOR_AGENTS.md
            </a>{" "}
            and it will set itself up.
          </p>
        </section>
      </main>

      <SiteFooter className="border-border sticky bottom-0 shrink-0 border-t bg-background px-5 py-4 text-center" />
    </div>
  );
}
