import type { SourceRef } from "@/lib/rag/types";

export function SourceList({ sources }: { sources: SourceRef[] }) {
  if (!sources.length) return null;
  return (
    <details className="mt-3 text-xs text-muted">
      <summary className="cursor-pointer select-none">Sources ({sources.length})</summary>
      <ol className="mt-2 space-y-1">
        {sources.map((s) => (
          <li key={s.n} className="flex gap-2">
            <span className="cite shrink-0">{s.n}</span>
            <span>
              {s.title} › {s.heading}{" "}
              <span
                className={`ml-1 rounded px-1 ${
                  s.source === "official" ? "bg-good-soft text-good" : "bg-surface-2 text-muted"
                }`}
              >
                {s.source === "official" ? "official" : "study notes"}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </details>
  );
}
