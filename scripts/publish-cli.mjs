import { execFileSync } from "node:child_process";
import { readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const cliDir = new URL("../packages/cli/", import.meta.url).pathname;

execFileSync("npm", ["pack", "--pack-destination", cliDir], {
  cwd: cliDir,
  stdio: "inherit",
});

const tarball = readdirSync(cliDir).find((f) => f.endsWith(".tgz"));
if (!tarball) {
  throw new Error("npm pack did not produce a tarball");
}

const tarballPath = join(cliDir, tarball);
const publishArgs = ["publish", tarballPath, "--access", "public", "--provenance=false"];
const otp = process.env.NPM_OTP ?? process.env.NPM_CONFIG_OTP;
if (otp) publishArgs.push("--otp", otp);

try {
  execFileSync("npm", publishArgs, { stdio: "inherit" });
} catch (err) {
  console.error("\nIf npm asks for 2FA, rerun with: NPM_OTP=<code> npm run publish:cli\n");
  throw err;
} finally {
  unlinkSync(tarballPath);
}
