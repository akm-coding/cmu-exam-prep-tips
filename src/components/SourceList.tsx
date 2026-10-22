import { BookOpen } from "lucide-react";
import type { SourceRef } from "@/lib/rag/types";

export function SourceList({ sources }: { sources: SourceRef[] }) {
  if (!sources.length) return null;
  return (
    <details className="group mt-3 text-xs text-muted">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 font-medium hover:text-text">
        <BookOpen size={13} />
        Based on {sources.length} sources
      </summary>
      <ol className="mt-2 grid gap-1.5">
        {sources.map((s) => (
          <li key={s.n} className="flex items-start gap-2">
            <span className="cite shrink-0">{s.n}</span>
            <span className="leading-relaxed">
              {s.title} › {s.heading}
              {s.source === "official" && (
                <span className="ml-1.5 rounded-full bg-good-soft px-1.5 py-0.5 font-semibold text-good">official</span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </details>
  );
}
