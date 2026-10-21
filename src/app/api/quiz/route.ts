import { z } from "zod";
import { errorMessage, generateStructured, userKeyFrom } from "@/lib/llm";
import { getProgram, getTrack } from "@/lib/programs";
import { quizSystemPrompt } from "@/lib/prompts";
import { formatContext, retrieve, toSourceRefs } from "@/lib/rag/retrieve";

export const runtime = "nodejs";

const Body = z.object({
  programId: z.string(),
  trackId: z.string(),
  topic: z.string().max(200),
  count: z.number().int().min(1).max(10).default(5),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

const Quiz = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).describe("Exactly 4 options, without A/B/C/D labels"),
      answerIndex: z.number().int().describe("0-based index of the correct option"),
      explanation: z.string().describe("Step-by-step solution, 2-5 sentences"),
      sourceNumbers: z.array(z.number().int()).describe("Numbers of the <source> blocks used"),
    }),
  ),
});

export type QuizResponse = z.infer<typeof Quiz> & { sources: ReturnType<typeof toSourceRefs> };

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
  const { programId, trackId, topic, count, difficulty } = parsed.data;
  const program = getProgram(programId);
  const track = program && getTrack(program, trackId);
  if (!program || !track) return Response.json({ error: "Unknown program or track" }, { status: 404 });

  try {
    const chunks = await retrieve(`${track.label}: ${topic}`, { subjects: [track.subject], k: 5 });

    const quiz = await generateStructured({
      system: quizSystemPrompt(program),
      prompt: `<sources>\n${formatContext(chunks)}\n</sources>\n\nWrite ${count} ${difficulty} multiple-choice questions for "${track.examPart}" on the topic "${topic}". Each question has exactly 4 options. Vary the question styles.`,
      schema: Quiz,
      userKey: userKeyFrom(req),
    });

    // Drop malformed questions rather than showing a broken one.
    const questions = quiz.questions
      .filter((q) => q.options.length >= 2 && q.answerIndex >= 0 && q.answerIndex < q.options.length)
      .map((q) => ({ ...q, options: q.options.map(wrapBareLatex) }));
    return Response.json({ questions, sources: toSourceRefs(chunks) } satisfies QuizResponse);
  } catch (err) {
    return Response.json({ error: errorMessage(err) }, { status: 500 });
  }
}

/** Some models return options like "\frac{3}{5}" without $…$; wrap them so KaTeX renders them. */
function wrapBareLatex(option: string) {
  return option.includes("\\") && !option.includes("$") ? `$${option}$` : option;
}
