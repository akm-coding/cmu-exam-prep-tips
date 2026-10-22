"use client";

import { useEffect, useState } from "react";
import { House, MessageCircleQuestion, NotebookPen, Target, type LucideIcon } from "lucide-react";
import { ChatPanel } from "@/components/ChatPanel";
import { EssayPanel } from "@/components/EssayPanel";
import { Overview } from "@/components/Overview";
import { PracticePanel } from "@/components/PracticePanel";
import type { Program } from "@/lib/programs";

export type Tab = "plan" | "ask" | "practice" | "essay";

const TAB_META: Record<Tab, { label: string; icon: LucideIcon }> = {
  plan: { label: "Plan", icon: House },
  ask: { label: "Ask", icon: MessageCircleQuestion },
  practice: { label: "Practice", icon: Target },
  essay: { label: "Essay", icon: NotebookPen },
};

export function ProgramTabs({ program }: { program: Program }) {
  const tabs: Tab[] = ["plan", "ask", "practice", ...(program.hasEssay ? (["essay"] as const) : [])];
  const [tab, setTab] = useState<Tab>("plan");

  // Keep the tab in the URL hash so refresh and the back button work.
  useEffect(() => {
    const sync = () => {
      const fromHash = window.location.hash.slice(1) as Tab;
      if (tabs.includes(fromHash)) setTab(fromHash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function go(next: Tab) {
    setTab(next);
    history.replaceState(null, "", `#${next}`);
    window.scrollTo({ top: 0 });
  }

  return (
    <>
      <nav className="sticky top-14 z-10 -mx-4 mt-4 bg-bg/95 px-4 py-3 backdrop-blur">
        <div
          className="grid gap-1 rounded-2xl border border-border bg-surface p-1 shadow-card"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
        >
          {tabs.map((t) => {
            const { label, icon: Icon } = TAB_META[t];
            const active = t === tab;
            return (
              <button
                key={t}
                onClick={() => go(t)}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-xs font-semibold transition sm:flex-row sm:justify-center sm:gap-2 sm:text-sm ${
                  active ? "bg-primary text-on-primary" : "text-muted hover:bg-surface-2 hover:text-text"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="pb-8 pt-3">
        {/* Panels stay mounted so switching tabs never loses a chat, quiz or essay draft. */}
        <div hidden={tab !== "plan"}>
          <Overview program={program} onGo={go} active={tab === "plan"} />
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
