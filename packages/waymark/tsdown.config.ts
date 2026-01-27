import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  report: {
    brotli: true
  }
});
