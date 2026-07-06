import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export default function ArtifactNotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-5 py-16">
      <div className="flex flex-1 items-center justify-center">
        <section className="surface-panel max-w-md p-6 text-center">
          <p className="text-muted-foreground mb-2 font-mono text-xs">404</p>
          <h1 className="text-xl font-semibold">Artifact not found</h1>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            This link may be mistyped, expired from storage, or never uploaded.
          </p>
          <Link
            href="/"
            className="bg-primary text-primary-foreground hover:bg-primary/80 focus-visible:ring-ring/40 mt-5 inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            Upload an artifact
          </Link>
        </section>
      </div>
      <SiteFooter className="mt-20" />
    </main>
  );
}
