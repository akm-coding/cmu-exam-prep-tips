# CMU Prep

A mini RAG study app for students applying to Chiang Mai University's international programs (2027 intake). It starts with **Software Engineering (SE)** and is set up so you can add more majors.

- **Ask**: a chat tutor grounded in the official CMU admission documents and study notes, with numbered citations.
- **Practice**: exam-style multiple-choice questions per topic (Mathematics, Computer basics, Logical thinking, English EPT), with worked explanations and per-topic progress saved in the browser.
- **Essay**: timed (45 min) practice prompts for Part 2 of the SE Aptitude Test, with rubric-based feedback.

## Setup

```bash
pnpm install
cp .env.example .env.local   # then paste a free Gemini key from aistudio.google.com/apikey
pnpm ingest                  # builds data/index.json (first run downloads a ~23 MB embedding model)
pnpm dev
```

Open http://localhost:3000.

## How the RAG works

```
content/**/*.md ──pnpm ingest──▶ chunk by "##" section ──▶ local embeddings (all-MiniLM-L6-v2) ──▶ data/index.json
                                                                                                     │
question ──▶ embed ──▶ cosine + keyword score, filtered to the program's subjects ──▶ top-k chunks ──┘
                                                         │
                                                         ▼
                                  LLM (Gemini Flash by default) answers / writes quiz / grades essay
```

- Embeddings run locally via `@huggingface/transformers`, so only the chat model needs an API key.
- The index is a JSON file (~450 KB, ~110 chunks). That's fine at this size; move to a vector DB (pgvector, LanceDB) only if the corpus gets into the thousands of chunks.
- Every chunk carries `source: official | study-notes`. The tutor is told to rely only on `official` chunks for dates, scores and rules, and to say it doesn't know otherwise.
- Quiz and essay-prompt generation use structured outputs (Zod schema), so the UI always gets valid JSON.

## Choosing a model provider

The model layer uses the Vercel AI SDK, so you switch provider with `LLM_PROVIDER` in `.env.local`; no code changes needed.

| `LLM_PROVIDER` | Cost | Key | Default models |
|---|---|---|---|
| `google` (default) | free tier | `GOOGLE_GENERATIVE_AI_API_KEY` | gemini-3.8-flash → 3.7-flash → 3.5-flash-lite |
| `groq` | free tier | `GROQ_API_KEY` | openai/gpt-oss-120b → llama-3.3-70b-versatile |
| `ollama` | free, runs locally | none | qwen3:8b |
| `anthropic` | paid | `ANTHROPIC_API_KEY` | claude-opus-5-5 |

`LLM_MODELS=a,b,c` overrides the list. When a model is overloaded (503) or rate limited (429), the app retries and then moves to the next one.

Free tiers have one daily quota per key, shared by every student using the app. With the `google` provider, students can paste their own free Gemini key under **Settings** (top right). It's stored only in their browser and is sent with their requests instead of the shared key.

## Project layout

```
content/
  admission/            official IPAS 2027 rules, timeline, fees (all programs)
  programs/se.md        SE requirements + study plan
  subjects/
    mathematics/        shared by SE, MMIT, ACC, ECON, engineering…
    english-placement/  CMU EPT (all programs)
    se-aptitude/        computer basics, hardware/software, logical thinking
    se-essay/           essay guide + practice rubric
scripts/ingest.ts       builds data/index.json
src/lib/programs.ts     program registry: subjects, practice tracks, topics
src/lib/rag/            chunking, embeddings, retrieval
src/lib/llm.ts          provider-agnostic model layer (Vercel AI SDK), retries + backup models
src/lib/prompts.ts      system prompts
src/app/api/            chat (streaming), quiz (structured), essay (prompt + streaming feedback)
```

## Adding a new major

1. Add notes for any subject the major needs that doesn't exist yet, e.g. `content/subjects/mmit-aptitude/*.md`. Each file needs frontmatter:
   ```yaml
   ---
   title: MIS basics
   subject: mmit-aptitude
   source: study-notes   # or "official" for facts copied from CMU documents
   ---
   ```
2. Add the subject id to `SubjectId` in `src/lib/programs.ts`.
3. Replace the program's `comingSoon(...)` entry with a full entry: `status: "active"`, the `subjects` it may retrieve from, and its `practice` tracks. Reuse `mathTrack` and `eptTrack` where the exams are shared.
4. Run `pnpm ingest` again.

The 2027 Annex 3 gives the exams per major. For example, MMIT takes Mathematics plus an aptitude test (logical thinking 10, MIS 15, computer networks 15, schedule management 20 short answers), so it can reuse the Mathematics notes and most of the networks note.

## Notes

- CMU doesn't publish past papers or the essay rubric. Practice questions and the rubric are realistic study aids, not official material.
- Admission facts are from the CMU IPAS 2027 announcement (Oct 6, 2026), Annex 3, the exam information sheet and the CAMT SE brochure. Students should confirm details at https://admission.reg.cmu.ac.th/ipas/.
