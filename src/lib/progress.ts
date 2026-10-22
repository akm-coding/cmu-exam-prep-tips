// Practice progress, kept in this browser only. Keyed by `${trackId}:${topic}`.

export type Progress = Record<string, { correct: number; total: number }>;

const KEY = "cmu-prep:progress";

export function loadProgress(): Progress {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function recordAnswer(trackId: string, topic: string, correct: boolean): Progress {
  const progress = loadProgress();
  const key = `${trackId}:${topic}`;
  const prev = progress[key] ?? { correct: 0, total: 0 };
  progress[key] = { correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 };
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable (private mode) — progress just won't persist.
  }
  return progress;
}

export function trackTotals(progress: Progress, trackId: string) {
  let correct = 0;
  let total = 0;
  let topics = 0;
  for (const [key, v] of Object.entries(progress)) {
    if (!key.startsWith(`${trackId}:`)) continue;
    correct += v.correct;
    total += v.total;
    topics += 1;
  }
  return { correct, total, topics };
}
