import fs from "node:fs/promises";
import path from "node:path";
import type { SubjectId } from "@/lib/programs";
import { embed } from "./embed";
import type { RetrievedChunk, SourceRef, VectorIndex } from "./types";

const INDEX_PATH = path.join(process.cwd(), "data", "index.json");

let indexPromise: Promise<VectorIndex> | null = null;

function loadIndex() {
  indexPromise ??= fs
    .readFile(INDEX_PATH, "utf8")
    .then((raw) => JSON.parse(raw) as VectorIndex)
    .catch((err) => {
      indexPromise = null;
      throw new Error(`Vector index not found at data/index.json — run \`pnpm ingest\` first. (${err})`);
    });
  return indexPromise;
}

const STOPWORDS = new Set(
  "a an the of to in on for and or is are what how why which do does i my me can you with about from be it this that".split(" "),
);

function terms(s: string) {
  return s
    .toLowerCase()
    .split(/[^a-z0-9×²³⁻¹]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/**
 * Hybrid search: cosine similarity on local embeddings, plus a small keyword
 * bonus so exact terms ("port 443", "Cramer") still win when the embedding
 * model is fuzzy about them.
 */
export async function retrieve(
  query: string,
  opts: { subjects: SubjectId[]; k?: number },
): Promise<RetrievedChunk[]> {
  const index = await loadIndex();
  const [q] = await embed([query]);
  const qTerms = terms(query);
  const allowed = new Set(opts.subjects);

  const scored: RetrievedChunk[] = [];
  for (const { embedding, ...chunk } of index.chunks) {
    if (!allowed.has(chunk.subject)) continue;
    let dot = 0;
    for (let i = 0; i < q.length; i++) dot += q[i] * embedding[i];
    const text = chunk.text.toLowerCase();
    const hits = qTerms.filter((t) => text.includes(t)).length;
    const keyword = qTerms.length ? hits / qTerms.length : 0;
    scored.push({ ...chunk, score: 0.8 * dot + 0.2 * keyword });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, opts.k ?? 6);
}

/** Render chunks as numbered sources for the prompt, matching toSourceRefs numbering. */
export function formatContext(chunks: RetrievedChunk[]): string {
  return chunks
    .map(
      (c, i) =>
        `<source n="${i + 1}" title="${c.title}" section="${c.heading}" kind="${c.source}">\n${c.text}\n</source>`,
    )
    .join("\n\n");
}

export function toSourceRefs(chunks: RetrievedChunk[]): SourceRef[] {
  return chunks.map((c, i) => ({
    n: i + 1,
    title: c.title,
    heading: c.heading,
    docPath: c.docPath,
    source: c.source,
  }));
}
