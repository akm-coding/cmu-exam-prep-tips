"use client";

import { useEffect, useState } from "react";
import type { QuizResponse } from "@/app/api/quiz/route";
import { postJson } from "@/lib/api";
import type { PracticeTrack } from "@/lib/programs";
import { Markdown } from "./Markdown";
import { SourceList } from "./SourceList";

type Difficulty = "easy" | "medium" | "hard";
type Progress = Record<string, { correct: number; total: number }>;

const PROGRESS_KEY = "cmu-prep:progress";

function loadProgress(): Progress {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function PracticePanel({ programId, tracks }: { programId: string; tracks: PracticeTrack[] }) {
  const [trackId, setTrackId] = useState(tracks[0].id);
  const track = tracks.find((t) => t.id === trackId) ?? tracks[0];
  const [topic, setTopic] = useState(track.topics[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [count, setCount] = useState(5);
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  function chooseTrack(id: string) {
    const next = tracks.find((t) => t.id === id)!;
    setTrackId(id);
    setTopic(next.topics[0]);
  }

  async function generate() {
    setBusy(true);
    setError(null);
    setQuiz(null);
    setAnswers({});
    try {
      const res = await postJson("/api/quiz", { programId, trackId, topic, count, difficulty });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate questions");
      setQuiz(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  function answer(qi: number, oi: number) {
    if (!quiz || answers[qi] !== undefined) return;
    setAnswers((a) => ({ ...a, [qi]: oi }));
    const key = `${trackId}:${topic}`;
    const prev = progress[key] ?? { correct: 0, total: 0 };
    const next = {
      ...progress,
      [key]: { correct: prev.correct + (oi === quiz.questions[qi].answerIndex ? 1 : 0), total: prev.total + 1 },
    };
    setProgress(next);
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable (private mode) — progress just won't persist.
    }
  }

  const answered = Object.keys(answers).length;
  const correct = quiz ? quiz.questions.filter((q, i) => answers[i] === q.answerIndex).length : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-wrap gap-2">
          {tracks.map((t) => (
            <button
              key={t.id}
              onClick={() => chooseTrack(t.id)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                t.id === trackId ? "bg-accent text-accent-text" : "border border-border bg-surface-2"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">{track.examPart}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end">
          <label className="text-xs text-muted">
            Topic
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text"
            >
              {track.topics.map((t) => {
                const p = progress[`${trackId}:${t}`];
                return (
                  <option key={t} value={t}>
                    {t}
                    {p ? ` — ${p.correct}/${p.total} correct` : ""}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="text-xs text-muted">
            Difficulty
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="mt-1 block rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <label className="text-xs text-muted">
            Questions
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="mt-1 block rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text"
            >
              {[3, 5, 10].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <button
            onClick={generate}
            disabled={busy}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-text disabled:opacity-50"
          >
            {busy ? "Writing questions…" : quiz ? "New set" : "Start practice"}
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-bad-soft px-3 py-2 text-sm text-bad">{error}</div>}

      {quiz && (
        <>
          <div className="text-sm text-muted">
            Score: <span className="font-semibold text-text">{correct}</span> / {answered} answered (
            {quiz.questions.length} total)
          </div>
          {quiz.questions.map((q, qi) => {
            const picked = answers[qi];
            const done = picked !== undefined;
            return (
              <div key={qi} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex gap-2 text-sm font-medium">
                  <span className="text-muted">{qi + 1}.</span>
                  <Markdown>{q.question}</Markdown>
                </div>
                <div className="mt-3 grid gap-2">
                  {q.options.map((opt, oi) => {
                    const isAnswer = oi === q.answerIndex;
                    const style = !done
                      ? "border-border hover:border-accent"
                      : isAnswer
                        ? "border-good bg-good-soft"
                        : oi === picked
                          ? "border-bad bg-bad-soft"
                          : "border-border opacity-60";
                    return (
                      <button
                        key={oi}
                        onClick={() => answer(qi, oi)}
                        disabled={done}
                        className={`flex gap-2 rounded-lg border px-3 py-2 text-left text-sm ${style}`}
                      >
                        <span className="font-semibold text-muted">{"ABCD"[oi] ?? oi + 1}.</span>
                        <Markdown>{opt}</Markdown>
                      </button>
                    );
                  })}
                </div>
                {done && (
                  <div className="mt-3 rounded-lg bg-surface-2 p-3 text-sm">
                    <div className="mb-1 font-medium">
                      {picked === q.answerIndex ? "✓ Correct" : `✗ The answer is ${"ABCD"[q.answerIndex]}`}
                    </div>
                    <Markdown>{q.explanation}</Markdown>
                  </div>
                )}
              </div>
            );
          })}
          <SourceList sources={quiz.sources} />
        </>
      )}
    </div>
  );
}
