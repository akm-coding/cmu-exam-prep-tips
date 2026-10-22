"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

// SE written exams (online). After the last one passes, the card hides itself.
const EXAMS = [
  { label: "Round 1 exam", date: "2027-02-08", applyBy: "Apply Nov 30, 2026 – Jan 13, 2027" },
  { label: "Round 2 exam", date: "2027-04-05", applyBy: "Apply Mar 16 – 22, 2027" },
];

const DAY = 86_400_000;

export function Countdown({ compact = false }: { compact?: boolean }) {
  // Rendered on the client only, so the day count is today's, not the build date's.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
  }, []);
  if (now === null) return <div className={compact ? "h-[76px]" : "h-[96px]"} />;

  const next = EXAMS.find((e) => new Date(`${e.date}T09:00:00+07:00`).getTime() > now);
  if (!next) return null;
  const days = Math.ceil((new Date(`${next.date}T09:00:00+07:00`).getTime() - now) / DAY);
  const pretty = new Date(`${next.date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={`card flex items-center gap-4 ${compact ? "p-4" : "p-5"}`}>
      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
        <CalendarDays size={22} />
      </div>
      <div className="min-w-0">
        <div className="text-sm text-muted">{next.label} · {pretty}</div>
        <div className="text-2xl font-bold tracking-tight">
          {days} {days === 1 ? "day" : "days"} to go
        </div>
        {!compact && <div className="text-sm text-muted">{next.applyBy}</div>}
      </div>
    </div>
  );
}
