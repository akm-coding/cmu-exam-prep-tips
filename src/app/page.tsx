import Link from "next/link";
import { ArrowRight, MessageCircleQuestion, NotebookPen, Target } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { PROGRAMS } from "@/lib/programs";

const STEPS = [
  {
    icon: MessageCircleQuestion,
    title: "Ask anything",
    body: "Requirements, dates, or “I don't understand inverse trig” — get a clear answer with sources.",
  },
  {
    icon: Target,
    title: "Practise by topic",
    body: "Exam-style questions, one at a time, with a step-by-step explanation for every answer.",
  },
  {
    icon: NotebookPen,
    title: "Write a timed essay",
    body: "Get a practice prompt, write under a 45-minute timer, and get a score with tips.",
  },
];

export default function Home() {
  const active = PROGRAMS.filter((p) => p.status === "active");
  const upcoming = PROGRAMS.filter((p) => p.status !== "active");

  return (
    <main className="mx-auto max-w-5xl px-4">
      <section className="grid items-center gap-8 py-12 md:grid-cols-[1.3fr_1fr] md:py-16">
        <div>
          <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            Free · 2027 intake
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Get ready for your CMU entrance exams
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            Study help for Chiang Mai University international programs, built from the official 2027 admission
            documents.
          </p>
          <Link href="/p/se" className="btn-primary mt-7 px-6 py-3.5 text-base">
            Start studying Software Engineering <ArrowRight size={18} />
          </Link>
        </div>
        <Countdown />
      </section>

      <section className="pb-12">
        <h2 className="text-xl font-bold">How it works</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <s.icon size={20} />
                </span>
                <span className="text-sm font-semibold text-muted">Step {i + 1}</span>
              </div>
              <h3 className="mt-4 font-bold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-6">
        <h2 className="text-xl font-bold">Choose your program</h2>
        <div className="mt-4 grid gap-4">
          {active.map((p) => (
            <Link
              key={p.id}
              href={`/p/${p.id}`}
              className="card group flex flex-col gap-4 p-5 transition hover:border-primary sm:flex-row sm:items-center"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-lg font-bold text-on-primary">
                {p.code}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-bold">{p.name}</div>
                <div className="text-sm text-muted">{p.faculty}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.tags.map((e) => (
                    <span key={e} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                Open <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-sm font-semibold text-muted">More majors coming soon</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {upcoming.map((p) => (
            <span key={p.id} className="rounded-full border border-dashed border-border px-3 py-1.5 text-sm text-muted">
              {p.name}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
