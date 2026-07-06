export default function HomePage() {
  return (
    <main className="home">
      <section className="hero">
        <p className="eyebrow">OpenArtifacts</p>
        <h1>Share artifacts. Get feedback.</h1>
        <p className="lede">
          Upload markdown, images, HTML, mermaid diagrams, and more. One CLI command, one link.
        </p>
        <div className="card">
          <code>npx openartifacts@latest upload ./design.md</code>
        </div>
        <p className="muted">
          Self-host the Next.js app or point the CLI at the default server. Storage is S3-compatible
          (Supabase, MinIO, AWS).
        </p>
      </section>
    </main>
  );
}
