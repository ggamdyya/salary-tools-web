"use client";

import { useState } from "react";
import { calculateHolidayPay, HolidayPayResult } from "@/lib/calculators/holidayPay";
import { MINIMUM_WAGE_2026 } from "@/lib/constants/laborConstants";
import { won, parseNumber, formatInput, comma } from "@/lib/format";
import { NumberField } from "@/components/NumberField";
import {
  Card,
  CalcHeader,
  ResultRow,
  Divider,
  HighlightBox,
  Disclaimer,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui";

export function JuhuCalculator() {
  const [wage, setWage] = useState(comma(MINIMUM_WAGE_2026));
  const [hours, setHours] = useState("40");
  const [result, setResult] = useState<HolidayPayResult | null>(null);

  function onCalculate() {
    setResult(calculateHolidayPay(parseNumber(hours), parseNumber(wage)));
  }

  function onReset() {
    setWage(comma(MINIMUM_WAGE_2026));
    setHours("40");
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-8">
      <CalcHeader title="주휴수당 계산기" subtitle="2026년 최저시급 10,030원 기준" />

      <Card>
        <NumberField
          label="시급 (원)"
          value={wage}
          onChange={(raw) => setWage(formatInput(raw))}
          suffix="원"
          placeholder="10,030"
        />
        <button
          type="button"
          onClick={() => setWage(comma(MINIMUM_WAGE_2026))}
          className="mb-3 text-sm font-semibold text-juhyu hover:underline dark:text-juhyu-light"
        >
          최저시급 적용
        </button>

        <NumberField
          label="주 근무시간"
          value={hours}
          onChange={(raw) => setHours(raw.replace(/[^0-9.]/g, ""))}
          suffix="시간"
          placeholder="40"
          hint="💡 주 15시간 이상 근무 시 주휴수당 발생"
        />

        <div className="mt-2 flex gap-2.5">
          <SecondaryButton onClick={onReset}>초기화</SecondaryButton>
          <PrimaryButton onClick={onCalculate} accent="juhyu">
            계산하기
          </PrimaryButton>
        </div>
      </Card>

      {result && (
        <Card className="mt-4">
          {result.isEligible ? (
            <>
              <div className="mb-1 text-lg font-extrabold text-emerald-600">✅ 주휴수당 발생</div>
              <Divider />
              <ResultRow label="주간 주휴수당" value={won(result.weeklyHolidayPay)} large />
              <p className="pb-1.5 text-xs text-slate-400">{result.calculationFormula}</p>
              <ResultRow
                label="월간 주휴수당 (4.345주)"
                value={won(result.monthlyHolidayPay)}
                large
              />
              <Divider />
              <ResultRow label="월간 기본급" value={won(result.monthlyBasicPay)} />
              <HighlightBox label="월간 총 급여" value={won(result.monthlyTotalPay)} tone="primary" />
            </>
          ) : (
            <>
              <div className="mb-1 text-lg font-extrabold text-amber-600">⚠️ 주휴수당 미발생</div>
              <Divider />
              <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-300">
                {result.ineligibleReason}
              </p>
              {result.monthlyBasicPay > 0 && (
                <div className="mt-3">
                  <ResultRow label="월간 기본급(추정)" value={won(result.monthlyBasicPay)} />
                </div>
              )}
            </>
          )}
        </Card>
      )}

      <Disclaimer>
        ℹ️ 본 계산 결과는 참고용이며, 정확한 급여는 근로계약서 및 노무사 확인을 권장합니다.
      </Disclaimer>
    </div>
  );
}
