import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "Charging Cable, c. 2020\u20132035. Length: 1 m. Ritual tether used to bind a phone to a wall overnight, so that it might wake with enough power to be carried away again.";

// Guard: sealed gate is 1-200 UTF-8 characters, not only whitespace.
if (LINE.length < 1 || LINE.length > 200) {
  console.error(`entry must be 1-200 characters, got ${LINE.length}`);
  process.exit(1);
}
// Guard: one clean line — no control characters, no leading/trailing
// whitespace, no embedded newline.
if (/[\u0000-\u001f\u007f]/.test(LINE) || LINE !== LINE.trim() || LINE.includes("\n")) {
  console.error("entry must be a single clean line with no control characters or surrounding whitespace");
  process.exit(1);
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = `${outDir}/entry.txt`;
writeFileSync(outPath, LINE + "\n", "utf8");
// Read-back check: the file on disk must match the line exactly.
const onDisk = readFileSync(outPath, "utf8");
if (onDisk !== LINE + "\n") {
  console.error("read-back mismatch: entry.txt does not match the line");
  process.exit(1);
}
console.log(`wrote ${LINE.length} chars to ${outPath}`);
