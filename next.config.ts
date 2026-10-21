import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native ONNX runtime used for local embeddings must not be bundled.
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node"],
  // Ship the knowledge base and prebuilt index with the server routes.
  outputFileTracingIncludes: { "/api/**": ["./data/index.json"] },
};

export default nextConfig;
