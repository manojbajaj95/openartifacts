import { SiteFooter } from "@/components/SiteFooter";

export function SitePage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={className ?? "mx-auto max-w-3xl px-5 py-12 pb-20"}>
      {children}
      <SiteFooter className="mt-20" />
    </main>
  );
}
