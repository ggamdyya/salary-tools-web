"use client";

import { useState } from "react";
import {
  calculateSocialInsurance,
  employeeTotalDeduction,
  employeeInsuranceTotal,
  netSalary,
  employerInsuranceTotal,
  totalLaborCost,
  SocialInsuranceResult,
} from "@/lib/calculators/socialInsurance";
import { annualToMonthly } from "@/lib/calculators/salaryConverter";
import {
  INDUSTRIES,
  industryCategories,
  findIndustryByCode,
  DEFAULT_INDUSTRY,
} from "@/lib/constants/industrialAccidentRates";
import { BusinessSize, BUSINESS_SIZE_LABELS } from "@/lib/constants/insuranceConstants";
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

type Mode = "monthly" | "annual";

export function InsuranceCalculator() {
  const [mode, setMode] = useState<Mode>("monthly");
  const [salary, setSalary] = useState("3,000,000");
  const [industryCode, setIndustryCode] = useState(DEFAULT_INDUSTRY.code);
  const [dependents, setDependents] = useState("1");
  const [businessSize, setBusinessSize] = useState<BusinessSize>(BusinessSize.Under150);
  const [result, setResult] = useState<SocialInsuranceResult | null>(null);

  function onCalculate() {
    const raw = parseNumber(salary);
    const monthly = mode === "annual" ? annualToMonthly(raw) : raw;
    const industry = findIndustryByCode(industryCode) ?? DEFAULT_INDUSTRY;
    setResult(
      calculateSocialInsurance({
        monthlyGrossSalary: monthly,
        industry,
        dependents: Math.max(1, Math.round(parseNumber(dependents))),
        businessSize,
      }),
    );
  }

  function onReset() {
    setSalary(mode === "annual" ? "36,000,000" : "3,000,000");
    setIndustryCode(DEFAULT_INDUSTRY.code);
    setDependents("1");
    setBusinessSize(BusinessSize.Under150);
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-8">
      <CalcHeader title="4대보험 계산기" subtitle="2026년 요율 기준 · 실수령액 / 총 인건비" />

      <Card>
        {/* 월급/연봉 토글 */}
        <div className="mb-4 flex rounded-xl bg-slate-100 p-1 dark:bg-[#3A3A3C]">
          {(["monthly", "annual"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setSalary(m === "annual" ? "36,000,000" : "3,000,000");
                setResult(null);
              }}
              className={`flex-1 rounded-lg py-3 text-base font-bold transition-colors ${
                mode === m
                  ? "bg-saboheom text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {m === "monthly" ? "월급" : "연봉"}
            </button>
          ))}
        </div>

        <NumberField
          label={mode === "monthly" ? "월 급여 (세전, 원)" : "연봉 (세전, 원)"}
          value={salary}
          onChange={(raw) => setSalary(formatInput(raw))}
          suffix="원"
          accent="saboheom"
        />

        <div className="mb-4">
          <Label>업종 (산재보험 요율)</Label>
          <select
            value={industryCode}
            onChange={(e) => setIndustryCode(e.target.value)}
            className="w-full appearance-none rounded-xl border-[1.5px] border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 outline-none dark:border-[#3A3A3C] dark:bg-[#2C2C2E] dark:text-white"
          >
            {industryCategories().map((cat) => (
              <optgroup key={cat} label={cat}>
                {INDUSTRIES.filter((i) => i.category === cat).map((i) => (
                  <option key={i.code} value={i.code}>
                    {i.name} ({(i.rate * 100).toFixed(2)}%)
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <NumberField
          label="부양가족 수 (본인 포함)"
          value={dependents}
          onChange={(raw) => setDependents(raw.replace(/[^0-9]/g, ""))}
          suffix="명"
          accent="saboheom"
          hint="소득세 인적공제에 반영됩니다"
        />

        <div className="mb-4">
          <Label>사업장 규모 (고용보험 사업주 부담률)</Label>
          <select
            value={businessSize}
            onChange={(e) => setBusinessSize(e.target.value as BusinessSize)}
            className="w-full appearance-none rounded-xl border-[1.5px] border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 outline-none dark:border-[#3A3A3C] dark:bg-[#2C2C2E] dark:text-white"
          >
            {Object.values(BusinessSize).map((s) => (
              <option key={s} value={s}>
                {BUSINESS_SIZE_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2 flex gap-2.5">
          <SecondaryButton onClick={onReset}>초기화</SecondaryButton>
          <PrimaryButton onClick={onCalculate} accent="saboheom">
            계산하기
          </PrimaryButton>
        </div>
      </Card>

      {result && <InsuranceResultView r={result} />}

      <Disclaimer>
        ℹ️ 소득세·지방소득세는 간이세액표 기반 추정치이며 실제 원천징수액과 다를 수 있습니다. 정확한
        금액은 4대 사회보험공단·국세청 확인을 권장합니다.
      </Disclaimer>
    </div>
  );
}

function InsuranceResultView({ r }: { r: SocialInsuranceResult }) {
  return (
    <>
      {/* 직원 부담 */}
      <Card className="mt-4">
        <div className="mb-1 text-lg font-extrabold text-saboheom">👤 직원 부담</div>
        <Divider />
        <ResultRow label="국민연금" value={won(r.employeeNationalPension)} />
        <ResultRow label="건강보험" value={won(r.employeeHealthInsurance)} />
        <ResultRow label="장기요양" value={won(r.employeeLongTermCare)} />
        <ResultRow label="고용보험" value={won(r.employeeEmploymentInsurance)} />
        <ResultRow label="소득세 *" value={won(r.incomeTax)} />
        <ResultRow label="지방소득세 *" value={won(r.localIncomeTax)} />
        <Divider />
        <ResultRow
          label={<span className="font-bold">차감 합계</span>}
          value={`-${won(employeeTotalDeduction(r))}`}
          valueClassName="!text-red-600"
        />
        <p className="pt-1 text-xs text-slate-400">4대보험만 합계: {won(employeeInsuranceTotal(r))}</p>
        <HighlightBox label="✨ 실수령액" value={won(netSalary(r))} tone="success" />
      </Card>

      {/* 사업주 부담 */}
      <Card className="mt-4">
        <div className="mb-1 text-lg font-extrabold text-slate-700 dark:text-slate-200">
          🏢 사업주 부담
        </div>
        <Divider />
        <ResultRow label="국민연금" value={won(r.employerNationalPension)} />
        <ResultRow label="건강보험" value={won(r.employerHealthInsurance)} />
        <ResultRow label="장기요양" value={won(r.employerLongTermCare)} />
        <ResultRow label="고용보험" value={won(r.employerEmploymentInsurance)} />
        <ResultRow
          label={`산재보험 (${r.industryName}, ${(r.industrialAccidentRate * 100).toFixed(2)}%)`}
          value={won(r.employerIndustrialAccident)}
        />
        <Divider />
        <ResultRow label="사업주 부담 합계" value={won(employerInsuranceTotal(r))} />
        <HighlightBox label="총 인건비" value={won(totalLaborCost(r))} tone="primary" />
      </Card>
    </>
  );
}
