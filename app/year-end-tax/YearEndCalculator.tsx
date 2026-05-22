"use client";

import { useState } from "react";
import { calculateYearEndTax, YearEndTaxResult } from "@/lib/calculators/yearEndTax";
import { won, parseNumber, formatInput } from "@/lib/format";
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

export function YearEndCalculator() {
  const [annual, setAnnual] = useState("36,000,000");
  const [withheld, setWithheld] = useState("1,200,000");
  const [dependents, setDependents] = useState("1");
  const [result, setResult] = useState<YearEndTaxResult | null>(null);

  function onCalculate() {
    setResult(
      calculateYearEndTax(
        parseNumber(annual),
        parseNumber(withheld),
        Math.max(1, Math.round(parseNumber(dependents))),
        12,
      ),
    );
  }

  function onReset() {
    setAnnual("36,000,000");
    setWithheld("1,200,000");
    setDependents("1");
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-8">
      <CalcHeader title="연말정산 환급액 계산기" subtitle="예상 환급/추가납부 미리보기" />

      <Card>
        <NumberField
          label="연 총 급여 (세전, 원)"
          value={annual}
          onChange={(raw) => setAnnual(formatInput(raw))}
          suffix="원"
          accent="saboheom"
        />
        <NumberField
          label="연간 기납부 세액 (원천징수 합계, 원)"
          value={withheld}
          onChange={(raw) => setWithheld(formatInput(raw))}
          suffix="원"
          accent="saboheom"
          hint="급여명세서의 소득세 + 지방소득세 1년 합계"
        />
        <NumberField
          label="부양가족 수 (본인 포함)"
          value={dependents}
          onChange={(raw) => setDependents(raw.replace(/[^0-9]/g, ""))}
          suffix="명"
          accent="saboheom"
        />

        <div className="mt-2 flex gap-2.5">
          <SecondaryButton onClick={onReset}>초기화</SecondaryButton>
          <PrimaryButton onClick={onCalculate} accent="saboheom">
            계산하기
          </PrimaryButton>
        </div>
      </Card>

      {result && (
        <Card className="mt-4">
          <ResultRow label="기납부 세액" value={won(result.totalWithheld)} />
          <ResultRow label="실제 결정세액(추정)" value={won(result.actualTaxLiability)} />
          <Divider />
          {result.isRefund ? (
            <HighlightBox label="🎉 예상 환급액" value={won(result.refund)} tone="success" />
          ) : (
            <HighlightBox
              label="예상 추가 납부액"
              value={won(Math.abs(result.refund))}
              tone="danger"
            />
          )}
        </Card>
      )}

      <Disclaimer>
        ℹ️ 의료비·신용카드·연금저축 등 세액·소득공제 항목을 반영하지 않은 단순 추정치입니다. 실제
        연말정산 결과와 차이가 클 수 있으며 국세청 홈택스 확인을 권장합니다.
      </Disclaimer>
    </div>
  );
}
