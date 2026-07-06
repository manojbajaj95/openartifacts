import type { Metadata } from "next";
import { SitePage } from "@/components/SitePage";
import { viewerBaseUrl } from "@/lib/serialize";

export const metadata: Metadata = {
  title: "API — OpenArtifacts",
  description: "HTTP API for uploading artifacts and collecting feedback.",
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="artifact-inset overflow-x-auto p-3.5 font-mono text-[0.8125rem] leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

function ParamTable({
  rows,
}: {
  rows: { name: string; required: boolean; description: string }[];
}) {
  return (
    <div className="surface-panel overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-border border-b">
            <th className="text-foreground px-4 py-2.5 text-left font-semibold">Parameter</th>
            <th className="text-foreground px-4 py-2.5 text-left font-semibold">Required</th>
            <th className="text-foreground px-4 py-2.5 text-left font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-border border-b last:border-b-0">
              <td className="text-foreground px-4 py-2.5 font-mono text-[0.8125rem]">{row.name}</td>
              <td className="text-muted-foreground px-4 py-2.5">{row.required ? "Yes" : "No"}</td>
              <td className="text-muted-foreground px-4 py-2.5 leading-relaxed">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ApiSection({
  title,
  endpoint,
  method,
  children,
}: {
  title: string;
  endpoint: string;
  method: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-foreground text-lg font-semibold tracking-tight">{title}</h2>
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">Endpoint</p>
        <CodeBlock>{`${method} ${endpoint}`}</CodeBlock>
      </div>
      {children}
    </section>
  );
}

export default function ApiPage() {
  const base = viewerBaseUrl();

  return (
    <SitePage>
      <article className="space-y-12">
        <header className="space-y-2">
          <h1 className="text-[1.75rem] font-semibold tracking-tight sm:text-[2rem]">API docs</h1>
          <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">
            Multipart upload and JSON responses. No authentication on the default deployment.
          </p>
        </header>

        <ApiSection title="Upload" endpoint={`${base}/api/uploads`} method="POST">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Parameters</p>
            <ParamTable
              rows={[
                {
                  name: "file",
                  required: true,
                  description:
                    "File to upload. Markdown, mermaid, HTML, images, and text render in the viewer; other types get a download link.",
                },
              ]}
            />
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Response</p>
            <CodeBlock>{`{
  "artifact": {
    "id": "abc123xyz",
    "filename": "design.md",
    "contentType": "text/markdown",
    "kind": "markdown",
    "size": 4096,
    "createdAt": "2026-07-06T21:00:00.000Z",
    "viewUrl": "${base}/a/abc123xyz"
  },
  "contentUrl": "/api/artifacts/abc123xyz/content"
}`}</CodeBlock>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Example</p>
            <CodeBlock>{`curl -F "file=@/path/to/design.md" \\
     ${base}/api/uploads`}</CodeBlock>
          </div>
        </ApiSection>

        <ApiSection
          title="Artifact metadata"
          endpoint={`${base}/api/artifacts/{id}`}
          method="GET"
        >
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Response</p>
            <CodeBlock>{`{
  "artifact": { ... },
  "contentUrl": "/api/artifacts/abc123xyz/content",
  "feedback": [ ... ]
}`}</CodeBlock>
          </div>
        </ApiSection>

        <ApiSection
          title="Artifact content"
          endpoint={`${base}/api/artifacts/{id}/content`}
          method="GET"
        >
          <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">
            Returns the raw file bytes with the stored content type, immutable caching, and an ETag.
            Add <code>?download=1</code> to force an attachment response.
          </p>
        </ApiSection>

        <ApiSection
          title="Feedback"
          endpoint={`${base}/api/artifacts/{id}/feedback`}
          method="GET | POST"
        >
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">POST body (JSON)</p>
            <ParamTable
              rows={[
                { name: "body", required: true, description: "Comment text." },
                { name: "author", required: false, description: 'Display name. Defaults to "Anonymous".' },
              ]}
            />
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Example</p>
            <CodeBlock>{`curl -X POST ${base}/api/artifacts/abc123xyz/feedback \\
     -H "Content-Type: application/json" \\
     -d '{"author":"Alex","body":"Looks good — ship it."}'`}</CodeBlock>
          </div>
        </ApiSection>
      </article>
    </SitePage>
  );
}
