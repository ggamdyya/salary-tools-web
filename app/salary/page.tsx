import type { Metadata } from "next";
import { SalaryCalculator } from "./SalaryCalculator";
import { AdUnit } from "@/components/AdSense";
import { AD_SLOTS } from "@/lib/ads";
import { getCalc } from "@/lib/calculatorsMeta";

const meta = getCalc("salary")!;

export const metadata: Metadata = {
  title: "연봉·월급 환산 계산기",
  description:
    "연봉을 월급으로, 월급을 연봉으로 즉시 환산합니다. 퇴직금 1개월분 포함 옵션 지원. 세전 기준 환산.",
  keywords: meta.keywords,
  alternates: { canonical: "/salary" },
};

export default function Page() {
  return (
    <>
      <SalaryCalculator />
      <div className="mx-auto max-w-xl px-5">
        <AdUnit slot={AD_SLOTS.calcBottom} />
      </div>
    </>
  );
}
