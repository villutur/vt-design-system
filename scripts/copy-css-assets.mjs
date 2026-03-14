import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
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

const serverDeclarationSource = path.join(distDir, "server.d.mts");
const serverDeclarationMapSource = path.join(distDir, "server.d.mts.map");

try {
  await copyFile(serverDeclarationSource, path.join(distDir, "server.d.ts"));
} catch {}

try {
  await copyFile(serverDeclarationMapSource, path.join(distDir, "server.d.ts.map"));
} catch {}

const indexModulePath = path.join(distDir, "index.mjs");
const indexModuleSource = await readFile(indexModulePath, "utf8");

if (!indexModuleSource.startsWith('"use client";')) {
  await writeFile(indexModulePath, `"use client";\n${indexModuleSource}`, "utf8");
}
