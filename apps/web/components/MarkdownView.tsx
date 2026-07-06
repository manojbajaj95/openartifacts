"use client";

import { SandboxedRenderView } from "@/components/SandboxedRenderView";

export function MarkdownView({
  artifactId,
  title,
}: {
  artifactId: string;
  title: string;
}) {
  return <SandboxedRenderView artifactId={artifactId} title={title} />;
}
