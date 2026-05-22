import Link from "next/link";
import { CALCULATORS, SITE_NAME } from "@/lib/calculatorsMeta";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white px-5 py-10 dark:border-[#2C2C2E] dark:bg-[#1C1C1E]">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CALCULATORS.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="text-sm text-slate-600 hover:text-juhyu dark:text-slate-300"
            >
              {c.emoji} {c.short}
            </Link>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-slate-400">
          본 사이트의 모든 계산 결과는 2026년 기준 추정치이며 참고용입니다. 정확한 급여·세금은
          근로계약서, 노무사, 세무사 및 4대 사회보험·국세청 확인을 권장합니다.
        </p>
        <p className="mt-3 text-xs text-slate-400">
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
