import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

export function BlogContent({ markdown }: { markdown: string }) {
  const html = marked.parse(markdown, { async: false }) as string;
  return (
    <article
      className="prose prose-slate max-w-none dark:prose-invert
        prose-headings:font-extrabold
        prose-h2:mt-8 prose-h2:text-xl
        prose-h3:mt-6 prose-h3:text-lg
        prose-a:text-juhyu prose-a:font-semibold dark:prose-a:text-juhyu-light
        prose-table:text-sm prose-th:bg-slate-100 dark:prose-th:bg-[#2C2C2E]
        prose-blockquote:border-l-juhyu prose-blockquote:text-slate-500
        prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 dark:prose-code:bg-[#2C2C2E]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
