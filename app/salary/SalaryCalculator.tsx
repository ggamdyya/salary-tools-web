"use client";

import { useState } from "react";
import { annualToMonthly, monthlyToAnnual } from "@/lib/calculators/salaryConverter";
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

type Direction = "annualToMonthly" | "monthlyToAnnual";

export function SalaryCalculator() {
  const [direction, setDirection] = useState<Direction>("annualToMonthly");
  const [amount, setAmount] = useState("36,000,000");
  const [includeSeverance, setIncludeSeverance] = useState(false);
  const [result, setResult] = useState<{ monthly: number; annual: number } | null>(null);

  function onCalculate() {
    const raw = parseNumber(amount);
    if (direction === "annualToMonthly") {
      const monthly = annualToMonthly(raw, includeSeverance);
      setResult({ annual: raw, monthly });
    } else {
      const annual = monthlyToAnnual(raw, includeSeverance);
      setResult({ annual, monthly: raw });
    }
  }

  function switchDirection(d: Direction) {
    setDirection(d);
    setAmount(d === "annualToMonthly" ? "36,000,000" : "3,000,000");
    setResult(null);
  }

  function onReset() {
    switchDirection(direction);
    setIncludeSeverance(false);
  }

  const isA2M = direction === "annualToMonthly";

  return (
    <div className="mx-auto max-w-xl px-5 py-8">
      <CalcHeader title="연봉 · 월급 환산기" subtitle="퇴직금 포함 옵션 지원" />

      <Card>
        <div className="mb-4 flex rounded-xl bg-slate-100 p-1 dark:bg-[#3A3A3C]">
          {(
            [
              ["annualToMonthly", "연봉 → 월급"],
              ["monthlyToAnnual", "월급 → 연봉"],
            ] as [Direction, string][]
          ).map(([d, label]) => (
            <button
              key={d}
              type="button"
              onClick={() => switchDirection(d)}
              className={`flex-1 rounded-lg py-3 text-sm font-bold transition-colors ${
                direction === d ? "bg-saboheom text-white" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <NumberField
          label={isA2M ? "연봉 (원)" : "월급 (원)"}
          value={amount}
          onChange={(raw) => setAmount(formatInput(raw))}
          suffix="원"
          accent="saboheom"
        />

        <label className="mb-2 flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={includeSeverance}
            onChange={(e) => setIncludeSeverance(e.target.checked)}
            className="h-5 w-5 accent-saboheom"
          />
          <span className="text-sm text-slate-700 dark:text-slate-200">
            퇴직금 1개월분 포함 (13개월로 분배)
          </span>
        </label>

        <div className="mt-3 flex gap-2.5">
          <SecondaryButton onClick={onReset}>초기화</SecondaryButton>
          <PrimaryButton onClick={onCalculate} accent="saboheom">
            계산하기
          </PrimaryButton>
        </div>
      </Card>

      {result && (
        <Card className="mt-4">
          <ResultRow label="연봉" value={won(result.annual)} />
          <Divider />
          <HighlightBox label="월 환산 급여" value={won(result.monthly)} tone="primary" />
        </Card>
      )}

      <Disclaimer>
        ℹ️ 단순 12개월(또는 퇴직금 포함 13개월) 환산이며 세전 기준입니다. 실수령액은 4대보험
        계산기를 이용하세요.
      </Disclaimer>
    </div>
  );
}
