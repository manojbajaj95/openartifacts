import Link from "next/link";

const GITHUB_URL = "https://github.com/manojbajaj95/openartifacts";

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <title>GitHub</title>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.18.82.63-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.51-1.04 2.18-.82 2.18-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

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
        <nav className="flex items-center gap-4 text-xs font-medium">
          <Link
            href="/about"
            className="text-muted-foreground hover:text-[var(--link)] transition-colors duration-150"
          >
            About
          </Link>
          <Link
            href="/api"
            className="text-muted-foreground hover:text-[var(--link)] transition-colors duration-150"
          >
            API
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-[var(--link)] inline-flex items-center gap-1.5 transition-colors duration-150"
          >
            <GitHubMark className="size-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
