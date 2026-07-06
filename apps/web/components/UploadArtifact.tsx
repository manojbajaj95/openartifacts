"use client";

import type { UploadResponse } from "@openartifacts/shared";
import { Loader2Icon, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UploadArtifact() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      try {
        const form = new FormData();
        form.append("file", file);

        const res = await fetch("/api/uploads", { method: "POST", body: form });
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(data?.error ?? `Upload failed (${res.status})`);
        }

        const data = (await res.json()) as UploadResponse;
        router.push(`/a/${data.artifact.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setUploading(false);
      }
    },
    [router],
  );

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void upload(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) void upload(file);
  }

  return (
    <div className="space-y-3">
      <label
        htmlFor="upload-artifact-input"
        className={cn(
          "surface-panel flex cursor-pointer flex-col items-center gap-4 px-5 py-8 text-center transition-[border-color,background-color] duration-150",
          dragOver && "border-[var(--link)] bg-[color-mix(in_oklch,var(--card)_88%,var(--link)_12%)]",
          uploading && "pointer-events-none opacity-70",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <input
          id="upload-artifact-input"
          type="file"
          className="sr-only"
          accept=".md,.mmd,.mermaid,.html,.htm,.txt,image/*,text/*"
          onChange={onFileChange}
          disabled={uploading}
        />
        <span
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-primary text-primary-foreground hover:bg-primary/80 min-w-[11rem] pointer-events-none",
            uploading && "opacity-60",
          )}
          aria-hidden
        >
          {uploading ? (
            <>
              <Loader2Icon className="animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <UploadIcon />
              Upload artifact
            </>
          )}
        </span>
        <p className="text-muted-foreground max-w-[24rem] text-sm leading-relaxed">
          Drop a file here or click to browse.
        </p>
      </label>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
