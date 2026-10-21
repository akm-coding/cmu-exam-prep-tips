import type { SubjectId } from "@/lib/programs";

export interface Chunk {
  id: string;
  docPath: string;
  title: string;
  heading: string;
  subject: SubjectId;
  source: "official" | "study-notes";
  sourceDoc?: string;
  text: string;
}

export interface IndexedChunk extends Chunk {
  embedding: number[];
}

export interface VectorIndex {
  model: string;
  dim: number;
  builtAt: string;
  chunks: IndexedChunk[];
}

export interface RetrievedChunk extends Chunk {
  score: number;
}

/** What the client sees for a citation. */
export interface SourceRef {
  n: number;
  title: string;
  heading: string;
  docPath: string;
  source: Chunk["source"];
}
