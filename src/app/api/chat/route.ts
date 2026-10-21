import type { ModelMessage } from "ai";
import { z } from "zod";
import { ndjsonStream, streamAnswer, userKeyFrom } from "@/lib/llm";
import { getProgram } from "@/lib/programs";
import { tutorSystemPrompt } from "@/lib/prompts";
import { formatContext, retrieve, toSourceRefs } from "@/lib/rag/retrieve";

export const runtime = "nodejs";

const Body = z.object({
  programId: z.string(),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(8000) }))
    .min(1)
    .max(40),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
  const program = getProgram(parsed.data.programId);
  if (!program || program.status !== "active") {
    return Response.json({ error: "Unknown or inactive program" }, { status: 404 });
  }

  const history = parsed.data.messages;
  const last = history[history.length - 1];
  if (last.role !== "user") return Response.json({ error: "Last message must be from the user" }, { status: 400 });

  return ndjsonStream(async (send) => {
    // Include the previous user turn so follow-ups like "why?" still retrieve the right topic.
    const prevUser = history.slice(0, -1).findLast((m) => m.role === "user");
    const query = prevUser ? `${prevUser.content}\n${last.content}` : last.content;
    const chunks = await retrieve(query, { subjects: program.subjects, k: 6 });
    send({ type: "sources", sources: toSourceRefs(chunks) });

    // Only the newest turn carries retrieved context; earlier turns stay plain text.
    const messages: ModelMessage[] = [
      ...history.slice(0, -1),
      { role: "user", content: `<sources>\n${formatContext(chunks)}\n</sources>\n\nQuestion: ${last.content}` },
    ];

    await streamAnswer({
      system: tutorSystemPrompt(program),
      messages,
      userKey: userKeyFrom(req),
      onText: (text) => send({ type: "text", text }),
    });
  });
}
