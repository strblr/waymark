import { file, write } from "bun";

const readmePath = new URL("../../../README.md", import.meta.url);
const readmeContent = await file(readmePath).text();

const lines = readmeContent.split("\n");

let tocStart = -1;
let tocEnd = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].match(/^#+\sTable of contents/)) {
    tocStart = i;
  }
  if (tocStart !== -1 && tocEnd === -1 && lines[i].trim() === "---") {
    tocEnd = i;
    break;
  }
}

let processedLines: string[];
if (tocStart !== -1 && tocEnd !== -1) {
  processedLines = [...lines.slice(0, tocStart), ...lines.slice(tocEnd + 1)];
} else {
  processedLines = lines;
}

const processedContent = processedLines
  .map(line => (line.match(/^#+\s/) ? `#${line}` : line))
  .join("\n");

const outputPath = new URL("../docs/pages/readme.mdx", import.meta.url);
await write(outputPath, processedContent);

console.log("✓ Copied README.md to readme.mdx (without table of contents)");
