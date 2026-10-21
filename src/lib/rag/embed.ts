import path from "node:path";
import { env, pipeline, type FeatureExtractionPipeline } from "@huggingface/transformers";

// Local, free embeddings — no extra API key. The model (~23 MB) downloads
// once into .cache/models on first use.
export const EMBED_MODEL = "Xenova/all-MiniLM-L6-v2";

env.cacheDir = path.join(process.cwd(), ".cache", "models");

let extractor: Promise<FeatureExtractionPipeline> | null = null;

function getExtractor() {
  extractor ??= pipeline("feature-extraction", EMBED_MODEL, { dtype: "fp32" });
  return extractor;
}

/** Returns L2-normalised vectors, so a dot product is cosine similarity. */
export async function embed(texts: string[]): Promise<number[][]> {
  const fx = await getExtractor();
  const output = await fx(texts, { pooling: "mean", normalize: true });
  return output.tolist() as number[][];
}
