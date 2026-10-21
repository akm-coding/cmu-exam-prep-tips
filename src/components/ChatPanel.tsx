"use client";

import { useEffect, useRef, useState } from "react";
import { postJson } from "@/lib/api";
import { readNdjson } from "@/lib/ndjson";
import type { SourceRef } from "@/lib/rag/types";
import { Markdown } from "./Markdown";
import { SourceList } from "./SourceList";

interface Msg {
  role: "user" | "assistant";
  content: string;
  sources?: SourceRef[];
}

const SUGGESTIONS = [
  "What exams do I take for SE on the Regular Track?",
  "Do I need IELTS if I graduated from an international school?",
  "Explain one-to-one and onto functions with an example",
  "How do I find arccos(−1/2)?",
  "What's the difference between a compiler and an interpreter?",
  "How should I plan my time on exam day?",
];

export function ChatPanel({ programId }: { programId: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    setError(null);
    setInput("");
    const history: Msg[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);

    const patchLast = (fn: (m: Msg) => Msg) =>
      setMessages((prev) => [...prev.slice(0, -1), fn(prev[prev.length - 1])]);

    try {
      const res = await postJson("/api/chat", {
        programId,
        messages: history.map(({ role, content }) => ({ role, content })),
      });
      await readNdjson(res, (e) => {
        if (e.type === "sources") patchLast((m) => ({ ...m, sources: e.sources as SourceRef[] }));
        if (e.type === "text") patchLast((m) => ({ ...m, content: m.content + e.text }));
        if (e.type === "error") setError(e.message);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      // Drop an empty assistant bubble if nothing came back, so the user can retry.
      setMessages((prev) => (prev.at(-1)?.content ? prev : prev.slice(0, -1)));
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.length === 0 && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm text-muted">
            Ask about admission rules, or ask for help with any exam topic. Answers cite the official CMU
            documents and the study notes.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-left text-xs hover:border-accent"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((m, i) =>
        m.role === "user" ? (
          <div key={i} className="ml-auto max-w-[85%] rounded-2xl bg-accent px-4 py-2 text-sm text-accent-text">
            {m.content}
          </div>
        ) : (
          <div key={i} className="max-w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm">
            {m.content ? <Markdown>{m.content}</Markdown> : <span className="text-muted">Searching notes…</span>}
            {m.sources && <SourceList sources={m.sources} />}
          </div>
        ),
      )}
      {error && <div className="rounded-lg bg-bad-soft px-3 py-2 text-sm text-bad">{error}</div>}
      <div ref={endRef} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="sticky bottom-3 flex gap-2 rounded-2xl border border-border bg-surface p-2 shadow-sm"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="Ask a question…"
          className="min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
        />
        <button
          disabled={busy || !input.trim()}
          className="rounded-xl bg-accent px-4 text-sm font-medium text-accent-text disabled:opacity-40"
        >
          {busy ? "…" : "Ask"}
        </button>
      </form>
    </div>
  );
}
