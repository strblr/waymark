import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  outDir: "./esm",
  report: {
    brotli: true
  }
});
