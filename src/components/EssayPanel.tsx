"use client";

import { useEffect, useState } from "react";
import { Clock, Lightbulb, Loader2, NotebookPen, RefreshCw, Send, Timer } from "lucide-react";
import { postJson } from "@/lib/api";
import { readNdjson } from "@/lib/ndjson";
import { Markdown } from "./Markdown";

const THEMES = ["Any", "Motivation", "Technology and society", "Problem solving / design", "Experience", "Ethics", "Future goals"];
const TIME_LIMIT_MIN = 45;
const TARGET = { min: 350, max: 500 };
const DRAFT_KEY = "cmu-prep:essay-draft";

interface EssayPrompt {
  prompt: string;
  type: string;
  tips: string[];
}

export function EssayPanel({ programId }: { programId: string }) {
  const [theme, setTheme] = useState("Any");
  const [prompt, setPrompt] = useState<EssayPrompt | null>(null);
  const [essay, setEssay] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState<"prompt" | "feedback" | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Restore an unsent draft.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null");
      if (saved?.prompt) {
        setPrompt(saved.prompt);
        setEssay(saved.essay ?? "");
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (prompt) localStorage.setItem(DRAFT_KEY, JSON.stringify({ prompt, essay }));
    } catch {}
  }, [prompt, essay]);

  useEffect(() => {
    if (!startedAt) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [startedAt]);

  const elapsedSec = startedAt ? Math.floor((now - startedAt) / 1000) : 0;
  const remainingSec = TIME_LIMIT_MIN * 60 - elapsedSec;
  const words = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  async function newPrompt() {
    setBusy("prompt");
    setError(null);
    try {
      const res = await postJson("/api/essay", {
        action: "prompt",
        programId,
        theme: theme === "Any" ? undefined : theme,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't create a prompt. Please try again.");
      setPrompt(data);
      setEssay("");
      setFeedback("");
      setStartedAt(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  async function submit() {
    if (!prompt) return;
    setBusy("feedback");
    setError(null);
    setFeedback("");
    try {
      const res = await postJson("/api/essay", {
        action: "feedback",
        programId,
        prompt: prompt.prompt,
        essay,
        minutesUsed: startedAt ? elapsedSec / 60 : undefined,
      });
      await readNdjson(res, (e) => {
        if (e.type === "text") setFeedback((f) => f + e.text);
        if (e.type === "error") setError(e.message);
      });
      setStartedAt(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  const mm = Math.floor(Math.abs(remainingSec) / 60);
  const ss = String(Math.abs(remainingSec) % 60).padStart(2, "0");
  const wordState = words < TARGET.min ? "under" : words > TARGET.max ? "over" : "ok";

  return (
    <div className="grid gap-5">
      {!prompt ? (
        <div className="card p-6">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
            <NotebookPen size={22} />
          </span>
          <h2 className="mt-3 text-xl font-bold">Practise the essay</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            The SE Aptitude Test ends with one essay. Get a practice question, write for up to {TIME_LIMIT_MIN} minutes
            (about {TARGET.min}–{TARGET.max} words), then get a score and tips.
          </p>
          <div className="mt-5 text-sm font-semibold">What kind of question?</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button key={t} onClick={() => setTheme(t)} className={`chip ${t === theme ? "chip-active" : ""}`}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={newPrompt} disabled={busy !== null} className="btn-primary mt-6 w-full sm:w-auto">
            {busy === "prompt" ? <Loader2 size={17} className="animate-spin" /> : <Lightbulb size={17} />}
            {busy === "prompt" ? "Thinking of a question…" : "Give me a question"}
          </button>
        </div>
      ) : (
        <>
          <div className="card border-2 border-primary p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">{prompt.type}</span>
              <button
                onClick={newPrompt}
                disabled={busy !== null}
                className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-text"
              >
                {busy === "prompt" ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} New question
              </button>
            </div>
            <p className="mt-3 text-lg font-semibold leading-relaxed">{prompt.prompt}</p>
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer font-semibold text-primary">Planning hints</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                {prompt.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </details>
          </div>

          <div className="card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-2 px-4 py-2.5 text-sm">
              <span
                className={`inline-flex items-center gap-1.5 font-semibold ${
                  !startedAt ? "text-muted" : remainingSec < 0 ? "text-bad" : remainingSec < 300 ? "text-warn" : ""
                }`}
              >
                {startedAt ? <Timer size={16} /> : <Clock size={16} />}
                {!startedAt
                  ? `${TIME_LIMIT_MIN}:00 — starts when you type`
                  : remainingSec < 0
                    ? `Time's up (+${mm}:${ss})`
                    : `${mm}:${ss} left`}
              </span>
              <span
                className={`font-semibold ${
                  wordState === "ok" ? "text-good" : wordState === "over" ? "text-warn" : "text-muted"
                }`}
              >
                {words} / {TARGET.min}–{TARGET.max} words
              </span>
            </div>
            <textarea
              value={essay}
              onChange={(e) => {
                if (!startedAt) setStartedAt(Date.now());
                setEssay(e.target.value);
              }}
              rows={14}
              placeholder="Start with a sentence that answers the question directly…"
              className="block w-full resize-y bg-surface p-4 text-[15px] leading-relaxed outline-none"
            />
            <div className="h-1 bg-surface-2">
              <div
                className={`h-full transition-all ${wordState === "over" ? "bg-warn" : "bg-primary"}`}
                style={{ width: `${Math.min(100, (words / TARGET.min) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-muted">Your draft is saved in this browser.</span>
            <button onClick={submit} disabled={busy !== null || words < 30} className="btn-primary">
              {busy === "feedback" ? <Loader2 size={17} className="animate-spin" /> : <Send size={16} />}
              {busy === "feedback" ? "Reading your essay…" : words < 30 ? "Write at least 30 words" : "Get feedback"}
            </button>
          </div>
        </>
      )}

      {error && <div className="rounded-xl bg-bad-soft px-4 py-3 text-sm text-bad">{error}</div>}

      {feedback && (
        <div className="card p-5 text-[15px]">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Feedback</div>
          <Markdown>{feedback}</Markdown>
        </div>
      )}
    </div>
  );
}
