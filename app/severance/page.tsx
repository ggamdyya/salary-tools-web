import type { Metadata } from "next";
import { SeveranceCalculator } from "./SeveranceCalculator";
import { AdUnit } from "@/components/AdSense";
import { AD_SLOTS } from "@/lib/ads";
import { getCalc } from "@/lib/calculatorsMeta";

const meta = getCalc("severance")!;

export const metadata: Metadata = {
  title: "퇴직금 계산기 - 예상 퇴직금",
  description:
    "입사일과 퇴사일, 최근 3개월 평균 월급으로 법정 퇴직금을 계산합니다. 1년 이상 근무 시 발생. 평균임금 × 30일 × (재직일수/365).",
  keywords: meta.keywords,
  alternates: { canonical: "/severance" },
};

export default function Page() {
  return (
    <>
      <SeveranceCalculator />
      <div className="mx-auto max-w-xl px-5">
        <AdUnit slot={AD_SLOTS.calcBottom} />
      </div>
      <section className="mx-auto max-w-xl px-5 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        <h2 className="mb-2 text-base font-extrabold text-slate-900 dark:text-white">
          퇴직금 계산식
        </h2>
        <p className="rounded-xl bg-slate-100 px-4 py-3 font-mono text-sm dark:bg-[#2C2C2E]">
          1일 평균임금 × 30일 × (재직일수 ÷ 365)
        </p>
        <p className="mt-3">계속근로기간 1년 이상, 주 15시간 이상 근로자에게 발생합니다.</p>
      </section>
    </>
  );
}
