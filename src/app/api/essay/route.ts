import { z } from "zod";
import { errorMessage, generateStructured, ndjsonStream, streamAnswer, userKeyFrom } from "@/lib/llm";
import { getProgram } from "@/lib/programs";
import { essayFeedbackSystem, essayPromptSystem } from "@/lib/prompts";
import { formatContext, retrieve } from "@/lib/rag/retrieve";

export const runtime = "nodejs";

const Body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("prompt"), programId: z.string(), theme: z.string().max(100).optional() }),
  z.object({
    action: z.literal("feedback"),
    programId: z.string(),
    prompt: z.string().max(2000),
    essay: z.string().min(50, "Write at least a few sentences first.").max(12000),
    minutesUsed: z.number().min(0).max(600).optional(),
  }),
]);

const EssayPrompt = z.object({
  prompt: z.string().describe("The essay question, 1-3 sentences"),
  type: z.string().describe("Prompt type, e.g. Motivation, Technology and society, Design"),
  tips: z.array(z.string()).describe("2-3 short planning hints"),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }
  const program = getProgram(parsed.data.programId);
  if (!program?.hasEssay) return Response.json({ error: "This program has no essay practice" }, { status: 404 });

  const userKey = userKeyFrom(req);
  const guide = await retrieve("essay prompt types structure rubric grading", { subjects: ["se-essay"], k: 8 });

  if (parsed.data.action === "prompt") {
    try {
      const theme = parsed.data.theme;
      const prompt = await generateStructured({
        system: essayPromptSystem(),
        prompt: `<sources>\n${formatContext(guide)}\n</sources>\n\nWrite one new essay prompt${theme ? ` of the type "${theme}"` : " of a randomly chosen type"}. Seed for variety: ${Math.floor(Math.random() * 1e6)}.`,
        schema: EssayPrompt,
        userKey,
      });
      return Response.json(prompt);
    } catch (err) {
      return Response.json({ error: errorMessage(err) }, { status: 500 });
    }
  }

  const { prompt, essay, minutesUsed } = parsed.data;
  const words = essay.trim().split(/\s+/).length;
  return ndjsonStream(async (send) => {
    await streamAnswer({
      system: essayFeedbackSystem(),
      messages: [
        {
          role: "user",
          content: `<sources>\n${formatContext(guide)}\n</sources>\n\n<prompt>${prompt}</prompt>\n\n<essay words="${words}"${minutesUsed != null ? ` minutes_used="${Math.round(minutesUsed)}"` : ""}>\n${essay}\n</essay>\n\nGive feedback on this practice essay.`,
        },
      ],
      userKey,
      onText: (text) => send({ type: "text", text }),
    });
  });
}
