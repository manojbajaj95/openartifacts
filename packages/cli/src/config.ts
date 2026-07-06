import { readFile, writeFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { DEFAULT_SERVER_URL, DEFAULT_VIEWER_URL } from "@openartifacts/shared";

export interface ClientConfig {
  serverUrl: string;
  viewerUrl: string;
}

const CONFIG_DIR = join(homedir(), ".config", "openartifacts");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

export async function loadConfig(): Promise<ClientConfig> {
  const fromEnv: ClientConfig = {
    serverUrl: process.env.OA_SERVER_URL ?? DEFAULT_SERVER_URL,
    viewerUrl: process.env.OA_VIEWER_URL ?? DEFAULT_VIEWER_URL,
  };

  try {
    const raw = await readFile(CONFIG_PATH, "utf8");
    const file = JSON.parse(raw) as Partial<ClientConfig>;
    return {
      serverUrl: process.env.OA_SERVER_URL ?? file.serverUrl ?? fromEnv.serverUrl,
      viewerUrl: process.env.OA_VIEWER_URL ?? file.viewerUrl ?? fromEnv.viewerUrl,
    };
  } catch {
    return fromEnv;
  }
}

export async function saveConfig(config: ClientConfig): Promise<void> {
  await mkdir(CONFIG_DIR, { recursive: true });
  await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n", "utf8");
}

export function configPath(): string {
  return CONFIG_PATH;
}
