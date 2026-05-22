"use client";

import { useState } from "react";
import { calculateSeverance, SeveranceResult } from "@/lib/calculators/severance";
import { won, parseNumber, formatInput } from "@/lib/format";
import { NumberField } from "@/components/NumberField";
import {
  Card,
  CalcHeader,
  Label,
  ResultRow,
  Divider,
  HighlightBox,
  Disclaimer,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function SeveranceCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(todayIso());
  const [monthlySalary, setMonthlySalary] = useState("3,000,000");
  const [result, setResult] = useState<SeveranceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onCalculate() {
    if (!startDate) {
      setError("입사일을 입력해주세요.");
      setResult(null);
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate || todayIso());
    if (end <= start) {
      setError("퇴사일은 입사일보다 뒤여야 합니다.");
      setResult(null);
      return;
    }
    setError(null);
    const salary = parseNumber(monthlySalary);
    // 최근 3개월 동일 급여로 가정
    setResult(calculateSeverance(start, end, salary > 0 ? [salary, salary, salary] : []));
  }

  function onReset() {
    setStartDate("");
    setEndDate(todayIso());
    setMonthlySalary("3,000,000");
    setResult(null);
    setError(null);
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-8">
      <CalcHeader title="퇴직금 계산기" subtitle="법정 퇴직금 예상액 (1년 이상 근무 시)" />

      <Card>
        <div className="mb-4">
          <Label>입사일</Label>
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border-[1.5px] border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none focus:border-juhyu dark:border-[#3A3A3C] dark:bg-[#2C2C2E] dark:text-white"
          />
        </div>
        <div className="mb-4">
          <Label>퇴사일 (기준일)</Label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl border-[1.5px] border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none focus:border-juhyu dark:border-[#3A3A3C] dark:bg-[#2C2C2E] dark:text-white"
          />
        </div>
        <NumberField
          label="최근 3개월 평균 월급 (세전, 원)"
          value={monthlySalary}
          onChange={(raw) => setMonthlySalary(formatInput(raw))}
          suffix="원"
          hint="평균임금 산정 기준 (상여·수당 포함 권장)"
        />

        {error && <p className="mb-2 text-sm font-semibold text-red-600">{error}</p>}

        <div className="mt-2 flex gap-2.5">
          <SecondaryButton onClick={onReset}>초기화</SecondaryButton>
          <PrimaryButton onClick={onCalculate} accent="juhyu">
            계산하기
          </PrimaryButton>
        </div>
      </Card>

      {result && (
        <Card className="mt-4">
          {result.isEligible && result.severanceAmount > 0 ? (
            <>
              <div className="mb-1 text-lg font-extrabold text-emerald-600">✅ 퇴직금 발생</div>
              <Divider />
              <ResultRow label="총 재직일수" value={`${result.totalDays.toLocaleString("ko-KR")}일`} />
              <ResultRow label="재직 기간" value={`약 ${result.yearsOfService.toFixed(2)}년`} />
              <ResultRow label="1일 평균임금" value={won(result.dailyAverageWage)} />
              <Divider />
              <HighlightBox label="예상 퇴직금" value={won(result.severanceAmount)} tone="primary" />
            </>
          ) : (
            <>
              <div className="mb-1 text-lg font-extrabold text-amber-600">⚠️ 안내</div>
              <Divider />
              <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-300">
                {result.ineligibleReason}
              </p>
              <div className="mt-2">
                <ResultRow
                  label="총 재직일수"
                  value={`${result.totalDays.toLocaleString("ko-KR")}일`}
                />
              </div>
            </>
          )}
        </Card>
      )}

      <Disclaimer>
        ℹ️ 평균임금은 퇴직 전 3개월 임금총액 ÷ 총일수로 산정되며, 본 계산은 입력한 월급 기준
        추정치입니다. 정확한 금액은 노무사 확인을 권장합니다.
      </Disclaimer>
    </div>
  );
}
