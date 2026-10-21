"use client";

import { useEffect, useState } from "react";
import { postJson } from "@/lib/api";
import { readNdjson } from "@/lib/ndjson";
import { Markdown } from "./Markdown";

const THEMES = ["Any", "Motivation", "Technology and society", "Problem solving / design", "Experience", "Ethics", "Future goals"];
const TIME_LIMIT_MIN = 45;
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
      if (!res.ok) throw new Error(data.error ?? "Failed to create a prompt");
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

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm text-muted">
          Part 2 of the SE Aptitude Test is one essay. Practise under a {TIME_LIMIT_MIN}-minute timer, then get
          feedback against a practice rubric (CMU does not publish its own).
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <label className="text-xs text-muted">
            Prompt type
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="mt-1 block rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text"
            >
              {THEMES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <button
            onClick={newPrompt}
            disabled={busy !== null}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-text disabled:opacity-50"
          >
            {busy === "prompt" ? "Creating…" : prompt ? "New prompt" : "Get a prompt"}
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-bad-soft px-3 py-2 text-sm text-bad">{error}</div>}

      {prompt && (
        <div className="rounded-xl border border-accent bg-surface p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-accent">{prompt.type}</div>
          <p className="mt-1 font-medium">{prompt.prompt}</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted">
            {prompt.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          <textarea
            value={essay}
            onChange={(e) => {
              if (!startedAt) setStartedAt(Date.now());
              setEssay(e.target.value);
            }}
            rows={16}
            placeholder="Start typing — the timer starts with your first keystroke."
            className="mt-4 w-full rounded-lg border border-border bg-surface-2 p-3 text-sm leading-relaxed outline-none focus:border-accent"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-muted">
              {words} words{" "}
              {startedAt && (
                <span className={remainingSec < 0 ? "text-bad" : remainingSec < 300 ? "text-accent" : ""}>
                  · {remainingSec < 0 ? `over by ${mm}:${ss}` : `${mm}:${ss} left`}
                </span>
              )}
            </span>
            <button
              onClick={submit}
              disabled={busy !== null || words < 30}
              className="rounded-lg bg-accent px-4 py-2 font-medium text-accent-text disabled:opacity-40"
            >
              {busy === "feedback" ? "Reading your essay…" : "Get feedback"}
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <div className="rounded-xl border border-border bg-surface p-4 text-sm">
          <Markdown>{feedback}</Markdown>
        </div>
      )}
    </div>
  );
}
