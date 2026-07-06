import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  platform: "node",
  clean: true,
  dts: false,
  splitting: false,
  sourcemap: true,
  banner: {
    js: "",
  },
  noExternal: ["@openartifacts/shared"],
});
