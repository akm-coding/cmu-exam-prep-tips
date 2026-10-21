import { notFound } from "next/navigation";
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
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="text-xs font-semibold text-accent">{program.code}</div>
      <h1 className="text-2xl font-semibold tracking-tight">{program.name}</h1>
      <p className="text-sm text-muted">{program.faculty}</p>
      <ProgramTabs program={program} />
    </main>
  );
}
