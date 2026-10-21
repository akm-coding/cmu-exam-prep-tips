"use client";

import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

// Turn "[2]" citations into links we can style; leave real [text](url) links alone.
const withCitations = (md: string) => md.replace(/\[(\d{1,2})\](?!\()/g, "[$1](#src-$1)");

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
