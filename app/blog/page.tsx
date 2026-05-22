import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "급여·노무 가이드 블로그",
  description:
    "주휴수당, 4대보험, 실수령액, 연말정산 등 알아두면 돈이 되는 급여·노무 정보를 쉽게 정리합니다.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">급여·노무 가이드</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          알아두면 돈이 되는 주휴수당·4대보험·세금 이야기
        </p>
      </header>

      <div className="space-y-4">
        {BLOG_POSTS.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="block rounded-3xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:bg-[#2C2C2E]"
          >
            <time className="text-xs text-slate-400">{p.date}</time>
            <h2 className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
              {p.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {p.description}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-juhyu dark:text-juhyu-light">
              읽기 →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
