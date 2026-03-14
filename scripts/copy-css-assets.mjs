import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const distDir = path.join(repoRoot, "dist");

await mkdir(distDir, { recursive: true });
await copyFile(
  path.join(repoRoot, "src", "theme.css"),
  path.join(distDir, "theme.css"),
);

await copyFile(
  path.join(distDir, "index.d.mts"),
  path.join(distDir, "index.d.ts"),
);

await copyFile(
  path.join(distDir, "index.d.mts.map"),
  path.join(distDir, "index.d.ts.map"),
);
