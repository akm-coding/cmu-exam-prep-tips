"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { KeyRound, Settings, X } from "lucide-react";
import { getUserKey, setUserKey } from "@/lib/api";

export function KeySettings() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(Boolean(getUserKey()));
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function save(next: string) {
    setUserKey(next);
    setSaved(Boolean(next));
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => {
          setValue(getUserKey());
          setOpen(true);
        }}
        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-surface-2 hover:text-text"
        aria-label="Settings"
      >
        <Settings size={17} />
        <span className="hidden sm:inline">{saved ? "Using your key" : "Settings"}</span>
      </button>

      {open &&
        // Portal to <body>: the header's backdrop-blur would otherwise trap this fixed overlay.
        createPortal(
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          <div className="card w-full max-w-md p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <KeyRound size={20} />
                </span>
                <h2 id="settings-title" className="text-lg font-bold">
                  Your own AI key
                </h2>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-muted hover:bg-surface-2" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              <strong className="text-text">Optional.</strong> The app shares one free key with every student, so it can
              hit a daily limit. If you see a “limit reached” message, get your own free key at{" "}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="font-semibold text-primary underline">
                aistudio.google.com
              </a>{" "}
              and paste it here. It stays in this browser only.
            </p>
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Paste your Gemini API key"
              className="mt-4 w-full rounded-xl border border-border bg-surface-2 px-3.5 py-3 text-sm outline-none focus:border-primary"
              autoFocus
            />
            <div className="mt-5 flex justify-end gap-2">
              {saved && (
                <button onClick={() => save("")} className="btn-secondary hover:border-bad hover:text-bad">
                  Remove key
                </button>
              )}
              <button onClick={() => save(value.trim())} className="btn-primary py-2.5">
                Save
              </button>
            </div>
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}
