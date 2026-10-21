import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { KeySettings } from "@/components/KeySettings";
import "katex/dist/katex.min.css";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CMU Prep — study for CMU international admission",
  description:
    "Ask questions about CMU international admission and practise for the Mathematics, Software Engineering Aptitude and essay exams.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh`}>
        <header className="border-b border-border bg-surface">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-semibold tracking-tight">
              CMU <span className="text-accent">Prep</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-muted sm:inline">2027 intake · unofficial study tool</span>
              <KeySettings />
            </div>
          </div>
        </header>
        {children}
        <footer className="mx-auto max-w-5xl px-4 py-8 text-xs text-muted">
          Not affiliated with Chiang Mai University. Admission facts come from the official 2027 IPAS
          announcement — always confirm at admission.reg.cmu.ac.th/ipas.
        </footer>
      </body>
    </html>
  );
}
