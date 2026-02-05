import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  minify: true,
  platform: "browser",
  report: {
    brotli: true
  }
});
