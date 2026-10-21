import Link from "next/link";
import { PROGRAMS } from "@/lib/programs";

const KEY_DATES = [
  { label: "Round 1 applications", value: "Nov 30, 2026 – Jan 13, 2027" },
  { label: "Round 1 written exam", value: "Feb 8, 2027 (online)" },
  { label: "Round 2 applications", value: "Mar 16 – 22, 2027" },
  { label: "Round 2 written exam", value: "Apr 5, 2027 (online)" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <section className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Prepare for CMU international admission
        </h1>
        <p className="mt-3 text-muted">
          Ask questions about requirements and dates, practise exam-style questions, and get feedback on
          timed essays. Answers are grounded in the official 2027 admission documents and study notes for
          each exam topic.
        </p>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-4">
        {KEY_DATES.map((d) => (
          <div key={d.label} className="rounded-xl border border-border bg-surface p-3">
            <div className="text-xs text-muted">{d.label}</div>
            <div className="mt-1 text-sm font-medium">{d.value}</div>
          </div>
        ))}
      </section>

      <h2 className="mt-10 text-lg font-semibold">Choose your program</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PROGRAMS.map((p) => {
          const card = (
            <div
              className={`h-full rounded-xl border p-4 transition ${
                p.status === "active"
                  ? "border-accent bg-surface hover:shadow-md"
                  : "border-border bg-surface-2 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">
                  {p.code}
                </span>
                <span className="text-xs text-muted">{p.status === "active" ? "Ready" : "Coming soon"}</span>
              </div>
              <div className="mt-2 font-medium">{p.name}</div>
              <div className="text-xs text-muted">{p.faculty}</div>
              <div className="mt-3 text-xs text-muted">
                Exams: {p.regularTrackExams.map((e) => e.replace(/ \(.*\)$/, "")).join(" · ")}
              </div>
            </div>
          );
          return p.status === "active" ? (
            <Link key={p.id} href={`/p/${p.id}`}>
              {card}
            </Link>
          ) : (
            <div key={p.id} aria-disabled>
              {card}
            </div>
          );
        })}
      </div>
    </main>
  );
}
