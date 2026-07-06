import { SiteHeader } from "@/components/SiteHeader";

export function SitePage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <SiteHeader />
      <main className={className ?? "mx-auto max-w-3xl px-5 py-12 pb-20"}>{children}</main>
    </>
  );
}
