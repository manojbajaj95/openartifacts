import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone is only for Docker; Vercel uses its own output format.
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),
  serverExternalPackages: ["mermaid", "shiki", "@pierre/diffs"],
};

export default nextConfig;
