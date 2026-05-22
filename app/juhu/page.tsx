import type { Metadata } from "next";
import { JuhuCalculator } from "./JuhuCalculator";
import { AdUnit } from "@/components/AdSense";
import { AD_SLOTS } from "@/lib/ads";
import { getCalc } from "@/lib/calculatorsMeta";

const meta = getCalc("juhu")!;

export const metadata: Metadata = {
  title: "주휴수당 계산기 - 2026 최저시급",
  description:
    "시급과 주 근무시간만 입력하면 주휴수당과 월간 총 급여를 자동 계산합니다. 주 15시간 이상 근무 시 발생. 2026년 최저시급 10,030원 반영.",
  keywords: meta.keywords,
  alternates: { canonical: "/juhu" },
};

export default function Page() {
  return (
    <>
      <JuhuCalculator />
      <div className="mx-auto max-w-xl px-5">
        <AdUnit slot={AD_SLOTS.calcBottom} />
      </div>
      <section className="mx-auto max-w-xl px-5 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        <h2 className="mb-2 text-base font-extrabold text-slate-900 dark:text-white">
          주휴수당이란?
        </h2>
        <p className="mb-3">
          근로기준법 제55조에 따라 <strong>주 15시간 이상</strong> 일한 근로자에게 주 1회 이상
          유급휴일을 보장하며, 이때 지급하는 수당이 주휴수당입니다.
        </p>
        <p className="mb-1 font-semibold text-slate-900 dark:text-white">계산식</p>
        <p className="rounded-xl bg-slate-100 px-4 py-3 font-mono text-sm dark:bg-[#2C2C2E]">
          (주 소정근로시간 ÷ 40) × 8 × 시급
        </p>
        <p className="mt-3">주 40시간을 초과해도 주휴수당은 40시간을 상한으로 계산됩니다.</p>
      </section>
    </>
  );
}
