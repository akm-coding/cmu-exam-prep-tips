"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Brain,
  Calculator,
  Check,
  Cpu,
  Languages,
  Loader2,
  RotateCcw,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";
import type { QuizResponse } from "@/app/api/quiz/route";
import { postJson } from "@/lib/api";
import type { PracticeTrack } from "@/lib/programs";
import { loadProgress, recordAnswer, type Progress } from "@/lib/progress";
import { Markdown } from "./Markdown";
import { SourceList } from "./SourceList";

type Difficulty = "easy" | "medium" | "hard";
type Stage = "setup" | "loading" | "quiz" | "done";

const TRACK_ICONS: Record<string, LucideIcon> = {
  mathematics: Calculator,
  "computer-basics": Cpu,
  "logical-thinking": Brain,
  english: Languages,
};

export function PracticePanel({ programId, tracks }: { programId: string; tracks: PracticeTrack[] }) {
  const [trackId, setTrackId] = useState(tracks[0].id);
  const track = tracks.find((t) => t.id === trackId) ?? tracks[0];
  const [topic, setTopic] = useState(track.topics[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [count, setCount] = useState(5);

  const [stage, setStage] = useState<Stage>("setup");
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
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

  async function start() {
    setStage("loading");
    setError(null);
    setAnswers({});
    setCurrent(0);
    try {
      const res = await postJson("/api/quiz", { programId, trackId, topic, count, difficulty });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't create questions. Please try again.");
      if (!data.questions?.length) throw new Error("No questions came back. Please try again.");
      setQuiz(data);
      setStage("quiz");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStage("setup");
    }
  }

  function answer(optionIndex: number) {
    if (!quiz || answers[current] !== undefined) return;
    setAnswers((a) => ({ ...a, [current]: optionIndex }));
    setProgress(recordAnswer(trackId, topic, optionIndex === quiz.questions[current].answerIndex));
  }

  if (stage === "loading") {
    return (
      <div className="card grid place-items-center gap-3 px-6 py-16 text-center">
        <Loader2 size={32} className="animate-spin text-primary" />
        <div className="font-semibold">
          Writing {count} questions on {topic}…
        </div>
        <div className="text-sm text-muted">This usually takes 15–30 seconds.</div>
      </div>
    );
  }

  if (stage === "quiz" && quiz) {
    const q = quiz.questions[current];
    const picked = answers[current];
    const done = picked !== undefined;
    const isLast = current === quiz.questions.length - 1;
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold">
            Question {current + 1} <span className="text-muted">of {quiz.questions.length}</span>
          </span>
          <button onClick={() => setStage("setup")} className="inline-flex items-center gap-1 text-muted hover:text-text">
            <X size={15} /> Quit
          </button>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((current + (done ? 1 : 0)) / quiz.questions.length) * 100}%` }}
          />
        </div>

        <div className="card p-5 sm:p-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">{topic}</div>
          <div className="mt-2 text-lg font-semibold leading-relaxed">
            <Markdown>{q.question}</Markdown>
          </div>

          <div className="mt-5 grid gap-2.5">
            {q.options.map((opt, oi) => {
              const isAnswer = oi === q.answerIndex;
              const state = !done ? "idle" : isAnswer ? "right" : oi === picked ? "wrong" : "dim";
              return (
                <button
                  key={oi}
                  onClick={() => answer(oi)}
                  disabled={done}
                  className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-[15px] transition ${
                    state === "idle"
                      ? "border-border hover:border-primary hover:bg-primary-soft"
                      : state === "right"
                        ? "border-good bg-good-soft"
                        : state === "wrong"
                          ? "border-bad bg-bad-soft"
                          : "border-border opacity-55"
                  }`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold ${
                      state === "right"
                        ? "bg-good text-white"
                        : state === "wrong"
                          ? "bg-bad text-white"
                          : "bg-surface-2 text-muted"
                    }`}
                  >
                    {state === "right" ? <Check size={15} /> : state === "wrong" ? <X size={15} /> : "ABCD"[oi]}
                  </span>
                  <span className="prose-inline min-w-0 flex-1">
                    <Markdown>{opt}</Markdown>
                  </span>
                </button>
              );
            })}
          </div>

          {done && (
            <div className={`mt-5 rounded-xl p-4 ${picked === q.answerIndex ? "bg-good-soft" : "bg-warn-soft"}`}>
              <div className={`font-bold ${picked === q.answerIndex ? "text-good" : "text-warn"}`}>
                {picked === q.answerIndex ? "Correct! 🎉" : `Not quite — the answer is ${"ABCD"[q.answerIndex]}`}
              </div>
              <div className="mt-1 text-[15px]">
                <Markdown>{q.explanation}</Markdown>
              </div>
            </div>
          )}
        </div>

        {done && (
          <button
            onClick={() => (isLast ? setStage("done") : setCurrent((c) => c + 1))}
            className="btn-primary w-full sm:ml-auto sm:w-auto"
          >
            {isLast ? "See my score" : "Next question"} <ArrowRight size={17} />
          </button>
        )}
      </div>
    );
  }

  if (stage === "done" && quiz) {
    const total = quiz.questions.length;
    const correct = quiz.questions.filter((q, i) => answers[i] === q.answerIndex).length;
    const pct = Math.round((correct / total) * 100);
    const message =
      pct === 100
        ? "Perfect score!"
        : pct >= 80
          ? "Great work!"
          : pct >= 50
            ? "Good effort — keep going!"
            : "Keep practising — you'll get there.";
    return (
      <div className="grid gap-4">
        <div className="card p-6 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Trophy size={26} />
          </span>
          <div className="mt-3 text-4xl font-bold">
            {correct}/{total}
          </div>
          <div className="mt-1 font-semibold">{message}</div>
          <div className="text-sm text-muted">{topic}</div>
          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <button onClick={start} className="btn-primary">
              <RotateCcw size={16} /> New questions, same topic
            </button>
            <button onClick={() => setStage("setup")} className="btn-secondary py-3">
              Choose another topic
            </button>
          </div>
        </div>

        <details className="card p-5">
          <summary className="cursor-pointer font-semibold">Review your answers</summary>
          <ol className="mt-4 grid gap-4">
            {quiz.questions.map((q, i) => (
              <li key={i} className="border-t border-border pt-4 text-sm first:border-0 first:pt-0">
                <div className="font-semibold">
                  <span className={answers[i] === q.answerIndex ? "text-good" : "text-bad"}>
                    {answers[i] === q.answerIndex ? "✓" : "✗"}
                  </span>{" "}
                  <span className="prose-inline">
                    <Markdown>{q.question}</Markdown>
                  </span>
                </div>
                <div className="mt-1 text-muted">
                  Answer:{" "}
                  <span className="prose-inline">
                    <Markdown>{q.options[q.answerIndex]}</Markdown>
                  </span>
                </div>
              </li>
            ))}
          </ol>
          <SourceList sources={quiz.sources} />
        </details>
      </div>
    );
  }

  // Setup
  return (
    <div className="grid gap-6">
      <section>
        <h2 className="text-lg font-bold">1. Choose a subject</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {tracks.map((t) => {
            const Icon = TRACK_ICONS[t.id] ?? Brain;
            const active = t.id === trackId;
            return (
              <button
                key={t.id}
                onClick={() => chooseTrack(t.id)}
                aria-pressed={active}
                className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-3.5 text-left transition sm:flex-row sm:gap-3 sm:p-4 ${
                  active ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-primary"
                }`}
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                    active ? "bg-primary text-on-primary" : "bg-primary-soft text-primary"
                  }`}
                >
                  <Icon size={20} />
                </span>
                <span>
                  <span className="block font-bold">{t.label}</span>
                  <span className="hidden text-xs leading-relaxed text-muted sm:block">{t.examPart}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold">2. Pick a topic</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {track.topics.map((t) => {
            const p = progress[`${trackId}:${t}`];
            return (
              <button key={t} onClick={() => setTopic(t)} className={`chip ${t === topic ? "chip-active" : ""}`}>
                {t}
                {p && (
                  <span className="ml-1.5 text-xs font-semibold text-good">
                    {Math.round((p.correct / p.total) * 100)}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold">3. Start</h2>
        <div className="card mt-3 grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Segmented
            label="Difficulty"
            value={difficulty}
            options={[
              ["easy", "Easy"],
              ["medium", "Medium"],
              ["hard", "Hard"],
            ]}
            onChange={(v) => setDifficulty(v as Difficulty)}
          />
          <Segmented
            label="Questions"
            value={String(count)}
            options={[
              ["5", "5"],
              ["10", "10"],
            ]}
            onChange={(v) => setCount(Number(v))}
          />
          <button onClick={start} className="btn-primary w-full sm:w-auto">
            Start practice <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {error && <div className="rounded-xl bg-bad-soft px-4 py-3 text-sm text-bad">{error}</div>}
    </div>
  );
}

function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-semibold">{label}</div>
      <div className="flex rounded-xl bg-surface-2 p-1">
        {options.map(([v, l]) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            aria-pressed={v === value}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              v === value ? "bg-surface text-primary shadow-card" : "text-muted hover:text-text"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
