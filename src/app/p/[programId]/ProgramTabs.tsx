"use client";

import { useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { EssayPanel } from "@/components/EssayPanel";
import { PracticePanel } from "@/components/PracticePanel";
import type { Program } from "@/lib/programs";

type Tab = "overview" | "ask" | "practice" | "essay";

export function ProgramTabs({ program }: { program: Program }) {
  const [tab, setTab] = useState<Tab>("overview");
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "ask", label: "Ask" },
    { id: "practice", label: "Practice" },
    ...(program.hasEssay ? [{ id: "essay" as const, label: "Essay" }] : []),
  ];

  return (
    <>
      <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              tab === t.id ? "border-accent text-accent" : "border-transparent text-muted hover:text-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div className="mt-6">
        {/* Keep panels mounted so switching tabs doesn't lose a chat or a draft. */}
        <div hidden={tab !== "overview"}>
          <Overview program={program} onGo={setTab} />
        </div>
        <div hidden={tab !== "ask"}>
          <ChatPanel programId={program.id} />
        </div>
        <div hidden={tab !== "practice"}>
          <PracticePanel programId={program.id} tracks={program.practice} />
        </div>
        {program.hasEssay && (
          <div hidden={tab !== "essay"}>
            <EssayPanel programId={program.id} />
          </div>
        )}
      </div>
    </>
  );
}

function Overview({ program, onGo }: { program: Program; onGo: (t: Tab) => void }) {
  return (
    <div className="grid gap-4">
      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="font-semibold">Regular Track exams</h2>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {program.regularTrackExams.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          <span className="font-medium text-text">Special Track (no CMU exam):</span> {program.specialTrack}
        </p>
      </section>

      {program.id === "se" && (
        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="font-semibold">SE exam day at a glance</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-surface-2 p-3 text-sm">
              <div className="font-medium">09:00 – 12:00 · Subject tests</div>
              <ul className="mt-1 list-disc pl-5 text-muted">
                <li>Mathematics: logic, functions, poly/exp/log, trig & inverse trig, 2×2 matrices</li>
                <li>SE Aptitude: 20 computer basics + 10 logical thinking MCQs, then 1 essay</li>
              </ul>
            </div>
            <div className="rounded-lg bg-surface-2 p-3 text-sm">
              <div className="font-medium">13:00 – 16:00 · English Placement Test</div>
              <ul className="mt-1 list-disc pl-5 text-muted">
                <li>Listening 30 · Structure 30 · Reading 20 (2 hours)</li>
                <li>Only if you don&apos;t have IELTS 5.0 / TOEFL iBT 61 / DET 85 or equivalent</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">
            Round 1: apply Nov 30, 2026 – Jan 13, 2027 · exam Feb 8, 2027. Round 2: apply Mar 16 – 22, 2027 · exam
            Apr 5, 2027. 25 seats. Graduates of an international/English-medium school are not exempt from the English
            requirement.
          </p>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        <GoCard title="Ask" body="Questions about rules, dates, or any exam topic — answered from the sources." onClick={() => onGo("ask")} />
        <GoCard title="Practice" body="Exam-style multiple choice by topic, with worked explanations." onClick={() => onGo("practice")} />
        {program.hasEssay && (
          <GoCard title="Essay" body="Timed essay prompts with rubric-based feedback." onClick={() => onGo("essay")} />
        )}
      </section>
    </div>
  );
}

function GoCard({ title, body, onClick }: { title: string; body: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-xl border border-border bg-surface p-4 text-left hover:border-accent">
      <div className="font-medium">{title} →</div>
      <div className="mt-1 text-sm text-muted">{body}</div>
    </button>
  );
}
