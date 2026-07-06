import { CopyCommand } from "@/components/CopyCommand";
import { SiteFooter } from "@/components/SiteFooter";
import { UploadArtifact } from "@/components/UploadArtifact";

const COMMAND = "npx openartifacts@latest upload ./design.md";

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
      </main>

      <SiteFooter className="border-border sticky bottom-0 shrink-0 border-t bg-background px-5 py-4 text-center" />
    </div>
  );
}
