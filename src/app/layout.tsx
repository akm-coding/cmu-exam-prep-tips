import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { KeySettings } from "@/components/KeySettings";
import "katex/dist/katex.min.css";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CMU Prep — study for CMU international admission",
  description:
    "Free study help for Chiang Mai University international programs: ask questions, practise exam topics and write timed essays.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} min-h-dvh antialiased`}>
        <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
              <span className="grid size-8 place-items-center rounded-lg bg-primary text-on-primary">
                <GraduationCap size={18} />
              </span>
              CMU Prep
            </Link>
            <KeySettings />
          </div>
        </header>
        {children}
        <footer className="mx-auto max-w-5xl px-4 pb-10 pt-6 text-center text-xs leading-relaxed text-muted">
          Free, unofficial study tool — not affiliated with Chiang Mai University.
          <br />
          Always confirm admission details at{" "}
          <a href="https://admission.reg.cmu.ac.th/ipas/" className="underline" target="_blank" rel="noreferrer">
            admission.reg.cmu.ac.th/ipas
          </a>
          .
        </footer>
      </body>
    </html>
  );
}
