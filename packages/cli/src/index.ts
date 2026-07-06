import { Command } from "commander";
import { DEFAULT_SERVER_URL, DEFAULT_VIEWER_URL } from "@openartifacts/shared";
import { type ClientConfig, configPath, loadConfig, saveConfig } from "./config.js";
import { uploadFile } from "./upload.js";

const program = new Command();

program
  .name("openartifacts")
  .description("Upload and share artifacts — markdown, images, HTML, mermaid, and more")
  .version("0.1.1");

program
  .command("upload")
  .description("Upload a file and get a shareable link")
  .argument("<file>", "Path to the file to upload")
  .option("-s, --server <url>", "API server URL (overrides config)")
  .action(async (file: string, opts: { server?: string }) => {
    const result = await uploadFile(file, opts.server);
    const { artifact } = result;
    process.stdout.write(`Uploaded ${artifact.filename}\n`);
    process.stdout.write(`kind: ${artifact.kind}\n`);
    process.stdout.write(`size: ${formatBytes(artifact.size)}\n\n`);
    process.stdout.write(`Share link:\n${artifact.viewUrl}\n`);
  });

program
  .command("config")
  .description("Show or update CLI configuration")
  .option("--server <url>", "Default API server URL")
  .option("--viewer <url>", "Default viewer URL (used in printed links)")
  .action(async (opts: { server?: string; viewer?: string }) => {
    const current = await loadConfig();
    if (!opts.server && !opts.viewer) {
      process.stdout.write(`config: ${configPath()}\n`);
      process.stdout.write(`server: ${current.serverUrl}\n`);
      process.stdout.write(`viewer: ${current.viewerUrl}\n`);
      return;
    }
    const next: ClientConfig = {
      serverUrl: opts.server ?? current.serverUrl,
      viewerUrl: opts.viewer ?? current.viewerUrl,
      selfHosted: true,
    };
    await saveConfig(next);
    process.stdout.write(`Saved config to ${configPath()}\n`);
  });

program
  .command("init")
  .description("Write default config for self-hosting")
  .option("--server <url>", "API server URL", DEFAULT_SERVER_URL)
  .option("--viewer <url>", "Viewer URL", DEFAULT_VIEWER_URL)
  .action(async (opts: { server: string; viewer: string }) => {
    await saveConfig({ serverUrl: opts.server, viewerUrl: opts.viewer, selfHosted: true });
    process.stdout.write(`Created ${configPath()}\n`);
  });

program.parse();

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
