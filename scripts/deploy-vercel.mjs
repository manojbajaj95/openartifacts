import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env");
const webDir = join(root, "apps/web");

function loadEnv(path) {
  const vars = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const key = trimmed.slice(0, i);
    let val = trimmed.slice(i + 1);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    vars[key] = val;
  }
  return vars;
}

function poolerUrl(direct) {
  const url = new URL(direct.replace(/^postgres:/, "postgresql:"));
  const ref = url.hostname.match(/^db\.(.+)\.supabase\.co$/)?.[1];
  if (!ref || url.port === "6543") return direct;

  const region = process.env.SUPABASE_REGION ?? "us-west-1";
  const password = encodeURIComponent(decodeURIComponent(url.password));
  const user = `postgres.${ref}`;
  return `postgresql://${user}:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
}

const env = loadEnv(envPath);
const keys = [
  "OA_VIEWER_URL",
  "OA_S3_ENDPOINT",
  "OA_S3_REGION",
  "OA_S3_BUCKET",
  "OA_S3_ACCESS_KEY",
  "OA_S3_SECRET_KEY",
];

const vercelEnv = {
  DATABASE_URL: poolerUrl(env.DATABASE_URL),
  ...Object.fromEntries(keys.map((k) => [k, env[k]])),
};

for (const [key, value] of Object.entries(vercelEnv)) {
  if (!value) {
    console.error(`Missing ${key} in .env`);
    process.exit(1);
  }
}

console.log("Linking Vercel project...");
execFileSync("vercel", ["link", "--yes", "--project", "openartifacts"], {
  cwd: webDir,
  stdio: "inherit",
});

for (const target of ["production", "preview", "development"]) {
  for (const [key, value] of Object.entries(vercelEnv)) {
    console.log(`Setting ${key} (${target})...`);
    execFileSync("vercel", ["env", "add", key, target, "--force", "--sensitive"], {
      cwd: webDir,
      input: value,
      stdio: ["pipe", "inherit", "inherit"],
    });
  }
}

console.log("Deploying to production...");
execFileSync("vercel", ["deploy", "--prod", "--yes"], {
  cwd: webDir,
  stdio: "inherit",
});
