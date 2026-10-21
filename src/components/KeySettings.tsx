"use client";

import { useEffect, useState } from "react";
import { getUserKey, setUserKey } from "@/lib/api";

export function KeySettings() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(Boolean(getUserKey()));
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setValue(getUserKey());
          setOpen((o) => !o);
        }}
        className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted hover:text-text"
      >
        {saved ? "Own key ✓" : "Settings"}
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-border bg-surface p-4 text-sm shadow-lg">
          <div className="font-medium">Use your own Gemini key (optional)</div>
          <p className="mt-1 text-xs text-muted">
            The app uses a shared free key with a daily limit. If it runs out, get your own free key at
            aistudio.google.com and paste it here. It is saved only in this browser.
          </p>
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste Gemini API key"
            className="mt-3 w-full rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm outline-none focus:border-accent"
          />
          <div className="mt-3 flex justify-end gap-2">
            {saved && (
              <button
                onClick={() => {
                  setUserKey("");
                  setSaved(false);
                  setValue("");
                  setOpen(false);
                }}
                className="rounded-lg px-3 py-1.5 text-xs text-muted hover:text-bad"
              >
                Remove
              </button>
            )}
            <button
              onClick={() => {
                setUserKey(value.trim());
                setSaved(Boolean(value.trim()));
                setOpen(false);
              }}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-text"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
