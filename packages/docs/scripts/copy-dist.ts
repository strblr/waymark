import { $ } from "bun";

const sourceDir = new URL("../docs/dist", import.meta.url);
const targetDir = new URL("../../../docs", import.meta.url);

await $`rm -rf ${targetDir.pathname}`;
console.log("✓ Deleted old /docs folder");

await $`cp -r ${sourceDir.pathname} ${targetDir.pathname}`;
console.log("✓ Copied dist to /docs");

await $`touch ${targetDir.pathname}/.nojekyll`;
console.log("✓ Created .nojekyll file");

await $`rm -rf ${sourceDir.pathname}`;
console.log("✓ Deleted packages/docs/docs/dist");
