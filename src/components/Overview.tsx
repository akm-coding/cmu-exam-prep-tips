"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Clock, MessageCircleQuestion, NotebookPen, Target } from "lucide-react";
import type { Tab } from "@/app/p/[programId]/ProgramTabs";
import type { Program } from "@/lib/programs";
import { loadProgress, trackTotals, type Progress } from "@/lib/progress";
import { Countdown } from "./Countdown";

export function Overview({ program, onGo, active }: { program: Program; onGo: (t: Tab) => void; active: boolean }) {
  const [progress, setProgress] = useState<Progress>({});
  // Refresh whenever the Plan tab is shown, so new practice results appear.
  useEffect(() => {
    if (active) setProgress(loadProgress());
  }, [active]);

  return (
    <div className="grid gap-5">
      <Countdown compact />

      <section className="card p-5">
        <h2 className="text-lg font-bold">What would you like to do?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Action icon={MessageCircleQuestion} title="Ask a question" body="About rules or any topic" onClick={() => onGo("ask")} />
          <Action icon={Target} title="Practise" body="Questions by topic" onClick={() => onGo("practice")} />
          {program.hasEssay && (
            <Action icon={NotebookPen} title="Write an essay" body="45-minute timed practice" onClick={() => onGo("essay")} />
          )}
        </div>
      </section>

      {program.practice.length > 0 && (
        <section className="card p-5">
          <h2 className="text-lg font-bold">Your practice</h2>
          <div className="mt-4 grid gap-3">
            {program.practice.map((t) => {
              const { correct, total, topics } = trackTotals(progress, t.id);
              const pct = total ? Math.round((correct / total) * 100) : 0;
              return (
                <div key={t.id}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-semibold">{t.label}</span>
                    <span className="text-muted">
                      {total ? `${pct}% correct · ${topics}/${t.topics.length} topics tried` : "Not started"}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(topics / t.topics.length) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {program.examDay.length > 0 && (
        <section className="card p-5">
          <h2 className="text-lg font-bold">Exam day</h2>
          <p className="text-sm text-muted">Online, from home. Regular Track.</p>
          <ol className="mt-4 grid gap-4">
            {program.examDay.map((slot) => (
              <li key={slot.title} className="flex gap-3">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                  <Clock size={16} />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted">{slot.time}</div>
                  <div className="font-semibold">{slot.title}</div>
                  <ul className="mt-1 grid gap-1 text-sm leading-relaxed text-muted">
                    {slot.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {program.keyFacts.length > 0 && (
        <section className="card p-5">
          <h2 className="text-lg font-bold">Good to know</h2>
          <ul className="mt-3 grid gap-3">
            {program.keyFacts.map((f) => (
              <li key={f} className="flex gap-2.5 text-sm leading-relaxed">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-good" />
                {f}
              </li>
            ))}
          </ul>
          <button onClick={() => onGo("ask")} className="mt-4 text-sm font-semibold text-primary">
            Have another question? Ask →
          </button>
        </section>
      )}
    </div>
  );
}

function Action({
  icon: Icon,
  title,
  body,
  onClick,
}: {
  icon: typeof Target;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 rounded-xl border border-border p-3.5 text-left transition hover:border-primary hover:bg-primary-soft"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary group-hover:bg-surface">
        <Icon size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block text-xs text-muted">{body}</span>
      </span>
      <ArrowRight size={16} className="text-muted group-hover:text-primary" />
    </button>
  );
}
