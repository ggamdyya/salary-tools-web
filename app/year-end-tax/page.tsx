import type { Metadata } from "next";
import { YearEndCalculator } from "./YearEndCalculator";
import { AdUnit } from "@/components/AdSense";
import { AD_SLOTS } from "@/lib/ads";
import { getCalc } from "@/lib/calculatorsMeta";

const meta = getCalc("year-end-tax")!;

export const metadata: Metadata = {
  title: "연말정산 환급액 계산기",
  description:
    "연 총급여와 기납부 원천징수액으로 예상 환급금 또는 추가납부액을 미리 계산합니다. 2026년 종합소득세 기준 추정.",
  keywords: meta.keywords,
  alternates: { canonical: "/year-end-tax" },
};

export default function Page() {
  return (
    <>
      <YearEndCalculator />
      <div className="mx-auto max-w-xl px-5">
        <AdUnit slot={AD_SLOTS.calcBottom} />
      </div>
    </>
  );
}
