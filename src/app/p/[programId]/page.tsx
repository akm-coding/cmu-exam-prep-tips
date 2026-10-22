import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getProgram, PROGRAMS } from "@/lib/programs";
import { ProgramTabs } from "./ProgramTabs";

export function generateStaticParams() {
  return PROGRAMS.filter((p) => p.status === "active").map((p) => ({ programId: p.id }));
}

export default async function ProgramPage({ params }: { params: Promise<{ programId: string }> }) {
  const { programId } = await params;
  const program = getProgram(programId);
  if (!program || program.status !== "active") notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 pt-6">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
        <ChevronLeft size={16} /> All programs
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{program.name}</h1>
      <ProgramTabs program={program} />
    </main>
  );
}
