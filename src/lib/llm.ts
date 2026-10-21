import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogle } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { APICallError, generateText, Output, streamText, type LanguageModel, type ModelMessage } from "ai";
import type { z } from "zod";

// Provider-agnostic model layer. Pick a provider with LLM_PROVIDER in .env.local:
//   google    (default) Gemini Flash, free tier — GOOGLE_GENERATIVE_AI_API_KEY
//   groq      open models, free tier            — GROQ_API_KEY
//   ollama    local models, fully free          — no key (OLLAMA_BASE_URL optional)
//   anthropic Claude, paid                      — ANTHROPIC_API_KEY
// LLM_MODELS (comma-separated) overrides the model list; later ones are backups
// used when the first is overloaded or rate limited.

type ProviderId = "google" | "groq" | "ollama" | "anthropic";

const DEFAULT_MODELS: Record<ProviderId, string[]> = {
  google: ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.5-flash-lite"],
  groq: ["openai/gpt-oss-120b", "llama-3.3-70b-versatile"],
  ollama: ["qwen3:8b"],
  anthropic: ["claude-opus-5-5"],
};

function providerId(): ProviderId {
  const p = (process.env.LLM_PROVIDER ?? "google").toLowerCase();
  if (p in DEFAULT_MODELS) return p as ProviderId;
  throw new Error(`Unknown LLM_PROVIDER "${p}". Use one of: ${Object.keys(DEFAULT_MODELS).join(", ")}.`);
}

/**
 * Models to try, in order. `userKey` lets a student use their own free Gemini
 * key so the app's shared free-tier quota isn't the bottleneck.
 */
export function getModels(userKey?: string): LanguageModel[] {
  const id = providerId();
  const ids = process.env.LLM_MODELS?.split(",").map((s) => s.trim()).filter(Boolean) ?? DEFAULT_MODELS[id];
  switch (id) {
    case "google": {
      const google = createGoogle(userKey ? { apiKey: userKey } : {});
      return ids.map((m) => google(m));
    }
    case "groq": {
      const groq = createGroq();
      return ids.map((m) => groq(m));
    }
    case "ollama": {
      const ollama = createOpenAICompatible({
        name: "ollama",
        baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
      });
      return ids.map((m) => ollama(m));
    }
    case "anthropic": {
      const anthropic = createAnthropic();
      return ids.map((m) => anthropic(m));
    }
  }
}

export function supportsUserKey() {
  return providerId() === "google";
}

/** Overloaded / rate-limited / model gone — worth moving on to the next model. */
function shouldTryNextModel(err: unknown): boolean {
  if (APICallError.isInstance(err)) {
    return err.isRetryable || err.statusCode === 404 || err.statusCode === 429;
  }
  // The SDK wraps errors that survived its own retries.
  const cause = (err as { lastError?: unknown; cause?: unknown })?.lastError ?? (err as { cause?: unknown })?.cause;
  return cause ? shouldTryNextModel(cause) : false;
}

/** Generate a JSON object that matches `schema`, trying backup models if needed. */
export async function generateStructured<T>(opts: {
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  userKey?: string;
}): Promise<T> {
  const models = getModels(opts.userKey);
  let lastErr: unknown;
  for (const model of models) {
    try {
      const result = await generateText({
        model,
        system: opts.system,
        prompt: opts.prompt,
        output: Output.object({ schema: opts.schema }),
        maxRetries: 2,
      });
      return result.output;
    } catch (err) {
      lastErr = err;
      if (!shouldTryNextModel(err)) throw err;
    }
  }
  throw lastErr;
}

/** Stream a text answer, moving to a backup model if one fails before any text arrives. */
export async function streamAnswer(opts: {
  system: string;
  messages: ModelMessage[];
  userKey?: string;
  onText: (text: string) => void;
}) {
  const models = getModels(opts.userKey);
  let lastErr: unknown;
  for (const model of models) {
    let started = false;
    let failed: unknown = null;
    const result = streamText({ model, system: opts.system, messages: opts.messages, maxRetries: 2 });
    for await (const part of result.fullStream) {
      if (part.type === "text-delta") {
        started = true;
        opts.onText(part.text);
      } else if (part.type === "error") {
        failed = part.error;
        break;
      }
    }
    if (!failed) return;
    if (started || !shouldTryNextModel(failed)) throw failed;
    lastErr = failed;
  }
  throw lastErr;
}

export type StreamEvent =
  | { type: "sources"; sources: unknown }
  | { type: "text"; text: string }
  | { type: "error"; message: string }
  | { type: "done" };

/** Newline-delimited JSON stream: one StreamEvent per line. */
export function ndjsonStream(run: (send: (e: StreamEvent) => void) => Promise<void>) {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: StreamEvent) => controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"));
      try {
        await run(send);
        send({ type: "done" });
      } catch (err) {
        send({ type: "error", message: errorMessage(err) });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(body, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-cache" },
  });
}

export function errorMessage(err: unknown): string {
  const apiErr = APICallError.isInstance(err)
    ? err
    : APICallError.isInstance((err as { lastError?: unknown })?.lastError)
      ? ((err as { lastError: APICallError }).lastError)
      : null;
  if (apiErr) {
    if (apiErr.statusCode === 401 || apiErr.statusCode === 403) {
      return "The model API key is missing or invalid. Check .env.local (or the key you entered) and try again.";
    }
    if (apiErr.statusCode === 429) {
      return "The free-tier limit was reached. Wait a minute and try again, or add your own free Gemini key in Settings.";
    }
    if (apiErr.statusCode === 503 || apiErr.statusCode === 500) {
      return "The model is overloaded right now (this happens on free tiers). Please try again in a minute.";
    }
    return `Model API error ${apiErr.statusCode ?? ""}: ${apiErr.message}`;
  }
  if (err instanceof Error) return err.message;
  return String(err);
}

/** Reads the optional per-student Gemini key sent by the browser. */
export function userKeyFrom(req: Request): string | undefined {
  const key = req.headers.get("x-user-api-key")?.trim();
  return key && supportsUserKey() ? key : undefined;
}
