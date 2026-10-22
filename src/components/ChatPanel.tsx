"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Eye, RotateCcw, Sparkles } from "lucide-react";
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
  {
    group: "About admission",
    items: [
      "What exams do I take for SE?",
      "Do I need IELTS if I studied at an international school?",
      "How should I plan my time on exam day?",
    ],
  },
  {
    group: "Help me study",
    items: [
      "Explain one-to-one and onto functions simply",
      "How do I find arccos(−1/2)?",
      "Compiler vs interpreter — what's the difference?",
    ],
  },
];

// The tutor ends lessons with a practice question and an "Answer:" line; hide it until asked.
const ANSWER_SPLIT = /\n+\s*(?:\*\*)?Answer(?:\*\*)?\s*:\s*(?:\*\*)?/i;

export function ChatPanel({ programId }: { programId: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messages.length) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // Grow the textarea with its content, up to a limit.
  useEffect(() => {
    const el = inputRef.current;
    if (!el || !el.offsetParent) return; // hidden tab: nothing to measure
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

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

  const lastIndex = messages.length - 1;

  return (
    <div className="flex min-h-[calc(100dvh-14rem)] flex-col">
      {messages.length === 0 ? (
        <div className="flex-1">
          <div className="py-6 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
              <Sparkles size={22} />
            </span>
            <h2 className="mt-3 text-xl font-bold">What do you want to know?</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted">
              Ask about CMU admission or anything you&apos;re studying. Answers come from the official documents and
              study notes.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {SUGGESTIONS.map((g) => (
              <div key={g.group}>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{g.group}</div>
                <div className="grid gap-2">
                  {g.items.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="card px-4 py-3 text-left text-sm font-medium transition hover:border-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-5">
          <div className="flex justify-end">
            <button onClick={() => setMessages([])} disabled={busy} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-text">
              <RotateCcw size={13} /> New chat
            </button>
          </div>
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[15px] text-on-primary">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={i} className="flex gap-3">
                <span className="mt-1 hidden size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary sm:grid">
                  <Sparkles size={15} />
                </span>
                <div className="card min-w-0 flex-1 rounded-tl-md px-4 py-3 text-[15px]">
                  {m.content ? (
                    <AssistantText text={m.content} streaming={busy && i === lastIndex} />
                  ) : (
                    <Thinking />
                  )}
                  {m.sources && m.content && <SourceList sources={m.sources} />}
                </div>
              </div>
            ),
          )}
          {error && <div className="rounded-xl bg-bad-soft px-4 py-3 text-sm text-bad">{error}</div>}
          <div ref={endRef} />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="sticky bottom-3 mt-6 flex items-end gap-2 rounded-2xl border border-border bg-surface p-2 shadow-card focus-within:border-primary"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="Type your question…"
          className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] leading-6 outline-none"
        />
        <button
          disabled={busy || !input.trim()}
          aria-label="Send"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-on-primary transition hover:bg-primary-hover disabled:opacity-40"
        >
          <ArrowUp size={18} />
        </button>
      </form>
    </div>
  );
}

function AssistantText({ text, streaming }: { text: string; streaming: boolean }) {
  const [shown, setShown] = useState(false);
  const match = streaming ? null : ANSWER_SPLIT.exec(text);
  if (!match) return <Markdown>{text}</Markdown>;
  const body = text.slice(0, match.index);
  const answer = text.slice(match.index + match[0].length);
  return (
    <>
      <Markdown>{body}</Markdown>
      {shown ? (
        <div className="mt-3 rounded-xl bg-good-soft px-4 py-3">
          <div className="text-xs font-bold uppercase tracking-wide text-good">Answer</div>
          <Markdown>{answer}</Markdown>
        </div>
      ) : (
        <button onClick={() => setShown(true)} className="btn-secondary mt-3 py-2">
          <Eye size={15} /> Show answer
        </button>
      )}
    </>
  );
}

function Thinking() {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted">
      <span className="flex gap-1">
        {[0, 150, 300].map((d) => (
          <span key={d} className="size-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: `${d}ms` }} />
        ))}
      </span>
      Reading the notes…
    </span>
  );
}
