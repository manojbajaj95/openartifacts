import Link from "next/link";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { cn } from "@/lib/utils";

export const GITHUB_URL = "https://github.com/manojbajaj95/openartifacts";

const linkClass =
  "text-[var(--link)] transition-colors duration-150 hover:underline";

export function SiteFooter({
  className,
  showTheme = true,
}: {
  className?: string;
  showTheme?: boolean;
}) {
  return (
    <footer
      className={cn(
        "text-muted-foreground flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs",
        className,
      )}
    >
      <Link href="/" className={linkClass}>
        OpenArtifacts
      </Link>
      <span className="opacity-40" aria-hidden>
        ·
      </span>
      <Link href="/about" className={linkClass}>
        About
      </Link>
      <span className="opacity-40" aria-hidden>
        ·
      </span>
      <Link href="/api" className={linkClass}>
        API
      </Link>
      <span className="opacity-40" aria-hidden>
        ·
      </span>
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
        GitHub
      </a>
      {showTheme ? (
        <>
          <span className="opacity-40" aria-hidden>
            ·
          </span>
          <ThemeSwitcher />
        </>
      ) : null}
    </footer>
  );
}
