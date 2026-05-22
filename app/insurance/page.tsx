import type { Metadata } from "next";
import { InsuranceCalculator } from "./InsuranceCalculator";
import { AdUnit } from "@/components/AdSense";
import { AD_SLOTS } from "@/lib/ads";
import { getCalc } from "@/lib/calculatorsMeta";

const meta = getCalc("insurance")!;

export const metadata: Metadata = {
  title: "4대보험 계산기 - 실수령액 / 총 인건비",
  description:
    "월급·연봉에서 국민연금·건강보험·고용보험·산재보험과 소득세를 차감한 실수령액을 계산합니다. 사업주 총 인건비까지 동시 확인. 2026년 요율 기준.",
  keywords: meta.keywords,
  alternates: { canonical: "/insurance" },
};

export default function Page() {
  return (
    <>
      <InsuranceCalculator />
      <div className="mx-auto max-w-xl px-5">
        <AdUnit slot={AD_SLOTS.calcBottom} />
      </div>
      <section className="mx-auto max-w-xl px-5 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        <h2 className="mb-2 text-base font-extrabold text-slate-900 dark:text-white">
          2026년 4대보험 요율
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>국민연금: 직원·사업주 각 4.5% (월 보수 상한 590만원)</li>
          <li>건강보험: 직원·사업주 각 3.545%</li>
          <li>장기요양: 건강보험료의 12.95%</li>
          <li>고용보험: 직원 0.9% / 사업주 1.15%~1.75% (규모별)</li>
          <li>산재보험: 사업주 단독 부담, 업종별 상이</li>
        </ul>
      </section>
    </>
  );
}
