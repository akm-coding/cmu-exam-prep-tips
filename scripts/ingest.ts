// Build data/index.json from every markdown file under content/.
// Run with: pnpm ingest
import fs from "node:fs/promises";
import path from "node:path";
import { chunkMarkdown } from "../src/lib/rag/chunk";
import { EMBED_MODEL, embed } from "../src/lib/rag/embed";
import type { Chunk, VectorIndex } from "../src/lib/rag/types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const OUT = path.join(process.cwd(), "data", "index.json");
const BATCH = 16;

async function listMarkdown(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) return listMarkdown(full);
      return Promise.resolve(e.name.endsWith(".md") ? [full] : []);
    }),
  );
  return nested.flat().sort();
}

async function main() {
  const files = await listMarkdown(CONTENT_DIR);
  const chunks: Chunk[] = [];
  for (const file of files) {
    const rel = path.relative(CONTENT_DIR, file);
    const docChunks = chunkMarkdown(rel, await fs.readFile(file, "utf8"));
    for (const c of docChunks) {
      if (!c.subject) throw new Error(`${rel} is missing a \`subject\` in its frontmatter`);
    }
    chunks.push(...docChunks);
  }
  console.log(`Chunked ${files.length} docs into ${chunks.length} chunks. Embedding…`);

  const index: VectorIndex = { model: EMBED_MODEL, dim: 0, builtAt: new Date().toISOString(), chunks: [] };
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const vectors = await embed(batch.map((c) => c.text));
    batch.forEach((c, j) => {
      index.chunks.push({ ...c, embedding: vectors[j].map((v) => Math.round(v * 1e5) / 1e5) });
    });
    process.stdout.write(`  ${Math.min(i + BATCH, chunks.length)}/${chunks.length}\r`);
  }
  index.dim = index.chunks[0]?.embedding.length ?? 0;

  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(index));
  console.log(`\nWrote ${OUT} (${index.chunks.length} chunks, dim ${index.dim}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
