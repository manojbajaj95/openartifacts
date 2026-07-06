import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-border bg-background sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-11 max-w-4xl items-center justify-between px-5">
        <Link
          href="/"
          className="text-foreground hover:text-[var(--link)] text-sm font-medium transition-colors duration-150"
        >
          OpenArtifacts
        </Link>
        <span className="text-muted-foreground hidden text-xs sm:inline">
          Share files · collect feedback
        </span>
      </div>
    </header>
  );
}
