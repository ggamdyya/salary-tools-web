// 연말정산 환급/추가납부 예측 계산기
// 포팅 출처: Calculator.Core/Calculators/YearEndTaxCalculator.cs
//
// ⚠️ 추정치. 공제 항목(의료비, 신용카드 등) 미반영.

import {
  calculateEarnedIncomeDeduction,
  calculateEarnedIncomeTaxCredit,
  PERSONAL_DEDUCTION_PER_PERSON,
  LOCAL_INCOME_TAX_RATE,
} from "../constants/incomeTaxConstants";
import { applyProgressiveTax } from "./incomeTax";
import { roundDown10 } from "./rounding";

export interface YearEndTaxResult {
  /** 연 총 급여 */
  annualGrossSalary: number;
  /** 연 누적 원천징수 (이미 낸 세금) */
  totalWithheld: number;
  /** 정확한 연 산출세액 (실제 내야 할 세금) */
  actualTaxLiability: number;
  /** 환급/추가납부 (양수: 환급, 음수: 추가 납부) */
  refund: number;
  /** 환급 여부 */
  isRefund: boolean;
  /** 기록된 월 수 */
  recordedMonthCount: number;
  /** 예측 신뢰도 (12개월이면 100%) */
  confidence: number;
}

/**
 * 연말정산 예측
 * @param annualGrossSalary 연 총 급여
 * @param totalWithheld 연 누적 원천징수액 (소득세 + 지방소득세 합)
 * @param dependents 부양가족 수 (본인 포함)
 * @param recordedMonthCount 기록된 월 수 (신뢰도 계산용)
 */
export function calculateYearEndTax(
  annualGrossSalary: number,
  totalWithheld: number,
  dependents: number,
  recordedMonthCount: number,
): YearEndTaxResult {
  if (dependents < 1) dependents = 1;

  // 1. 근로소득공제
  const earnedIncomeDeduction = calculateEarnedIncomeDeduction(annualGrossSalary);
  const taxableIncomeBase = annualGrossSalary - earnedIncomeDeduction;
  // 2. 인적공제
  const personalDeduction = PERSONAL_DEDUCTION_PER_PERSON * dependents;
  // 3. 과세표준
  const taxableIncome = Math.max(0, taxableIncomeBase - personalDeduction);
  // 4. 산출세액
  const calculatedTax = applyProgressiveTax(taxableIncome);
  // 5. 근로소득세액공제
  const taxCredit = calculateEarnedIncomeTaxCredit(calculatedTax, annualGrossSalary);
  const actualIncomeTax = Math.max(0, calculatedTax - taxCredit);
  // 6. 지방소득세 포함
  const actualTotalTax = actualIncomeTax * (1 + LOCAL_INCOME_TAX_RATE);
  // 7. 환급/추가 납부
  const refund = totalWithheld - actualTotalTax;

  const roundedRefund = roundDown10(refund);

  return {
    annualGrossSalary,
    totalWithheld,
    actualTaxLiability: roundDown10(actualTotalTax),
    refund: roundedRefund,
    isRefund: roundedRefund > 0,
    recordedMonthCount,
    confidence: (recordedMonthCount * 100) / 12,
  };
}
