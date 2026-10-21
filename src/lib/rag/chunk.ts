import matter from "gray-matter";
import type { Chunk } from "./types";

const MAX_CHARS = 1800;

/**
 * Split a markdown doc into one chunk per `##` section. Long sections are
 * split further on paragraph boundaries. Each chunk is prefixed with the doc
 * title and heading so it still makes sense when retrieved on its own.
 */
export function chunkMarkdown(docPath: string, raw: string): Chunk[] {
  const { data, content } = matter(raw);
  const title = String(data.title ?? docPath);
  const base = {
    docPath,
    title,
    subject: data.subject,
    source: data.source === "official" ? "official" : "study-notes",
    sourceDoc: data.sourceDoc,
  } as const;

  const sections: { heading: string; body: string }[] = [];
  let current = { heading: "Overview", body: "" };
  for (const line of content.split("\n")) {
    if (line.startsWith("# ")) continue; // doc title, already in `title`
    if (line.startsWith("## ")) {
      if (current.body.trim()) sections.push(current);
      current = { heading: line.slice(3).trim(), body: "" };
    } else {
      current.body += line + "\n";
    }
  }
  if (current.body.trim()) sections.push(current);

  const chunks: Chunk[] = [];
  for (const section of sections) {
    for (const [i, piece] of splitLong(section.body.trim()).entries()) {
      chunks.push({
        ...base,
        id: `${docPath}#${slug(section.heading)}${i ? `-${i}` : ""}`,
        heading: section.heading,
        text: `${title} — ${section.heading}\n\n${piece}`,
      });
    }
  }
  return chunks;
}

function splitLong(body: string): string[] {
  if (body.length <= MAX_CHARS) return [body];
  const out: string[] = [];
  let buf = "";
  for (const para of body.split(/\n{2,}/)) {
    if (buf && buf.length + para.length > MAX_CHARS) {
      out.push(buf.trim());
      buf = "";
    }
    buf += para + "\n\n";
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
