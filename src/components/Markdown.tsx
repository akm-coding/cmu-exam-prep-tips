"use client";

import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

// Turn "[2]" and "[1, 3]" citations into links we can style. Leave real [text](url)
// links alone, and skip $…$ math so intervals like $[1, 3]$ stay math.
const CITATION = /\[(\d{1,2}(?:\s*,\s*\d{1,2})*)\](?!\()/g;
const withCitations = (md: string) =>
  md
    .split(/(\$\$[\s\S]*?\$\$|\$[^$\n]*\$)/)
    .map((part, i) =>
      i % 2
        ? part
        : part.replace(CITATION, (_, nums: string) =>
            nums
              .split(",")
              .map((n) => `[${n.trim()}](#src-${n.trim()})`)
              .join(""),
          ),
    )
    .join("");

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-study">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          a: ({ href, children }) =>
            href?.startsWith("#src-") ? (
              <span className="cite" title={`Source ${href.slice(5)}`}>
                {children}
              </span>
            ) : (
              <a href={href} target="_blank" rel="noreferrer">
                {children}
              </a>
            ),
        }}
      >
        {withCitations(children)}
      </ReactMarkdown>
    </div>
  );
}
