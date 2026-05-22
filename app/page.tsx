import Link from "next/link";
import { CALCULATORS } from "@/lib/calculatorsMeta";
import { BLOG_POSTS } from "@/lib/blog";

export default function HomePage() {
  const latestPosts = BLOG_POSTS.slice(0, 3);
  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <section className="mb-8 text-center">
        <div className="mb-3 inline-block rounded-full bg-juhyu/10 px-4 py-1.5 text-sm font-semibold text-juhyu dark:bg-juhyu/20 dark:text-juhyu-light">
          2026년 최신 기준 반영
        </div>
        <h1 className="text-3xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-4xl">
          급여 계산, <span className="text-juhyu dark:text-juhyu-light">3초</span>면 끝
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          주휴수당부터 실수령액·퇴직금까지. 회원가입 없이 무료로.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {CALCULATORS.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className="group rounded-3xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:bg-[#2C2C2E]"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-[#3A3A3C]">
              {c.emoji}
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{c.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {c.desc}
            </p>
            <span
              className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${
                c.accent === "juhyu" ? "text-juhyu dark:text-juhyu-light" : "text-saboheom"
              }`}
            >
              계산하기
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-10 rounded-3xl bg-white p-6 text-sm leading-relaxed text-slate-600 shadow-sm dark:bg-[#2C2C2E] dark:text-slate-300">
        <h2 className="mb-2 text-base font-extrabold text-slate-900 dark:text-white">
          왜 이 계산기인가요?
        </h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>2026년 최저시급(10,030원)·4대보험 요율 반영</li>
          <li>직원 실수령액과 사업주 총 인건비를 동시에 확인</li>
          <li>설치·로그인 없이 모바일에서 바로 사용</li>
        </ul>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">최신 가이드</h2>
          <Link href="/blog" className="text-sm font-semibold text-juhyu dark:text-juhyu-light">
            전체 보기 →
          </Link>
        </div>
        <div className="space-y-3">
          {latestPosts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="block rounded-2xl bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5 dark:bg-[#2C2C2E]"
            >
              <h3 className="font-bold text-slate-900 dark:text-white">{p.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                {p.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
