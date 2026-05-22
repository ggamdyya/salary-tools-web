// 근로소득 소득세 계산기 (간이세액표 기반 추정)
// 포팅 출처: Calculator.Core/Calculators/IncomeTaxCalculator.cs

import {
  TAX_BRACKETS,
  calculateEarnedIncomeDeduction,
  calculateEarnedIncomeTaxCredit,
  PERSONAL_DEDUCTION_PER_PERSON,
  LOCAL_INCOME_TAX_RATE,
} from "../constants/incomeTaxConstants";
import { roundDown10 } from "./rounding";

export interface MonthlyTaxResult {
  /** 소득세 (10원 단위 절사) */
  incomeTax: number;
  /** 지방소득세 (소득세의 10%, 10원 단위 절사) */
  localIncomeTax: number;
}

/** 누진세율 적용 */
export function applyProgressiveTax(taxableIncome: number): number {
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.upperBound) {
      return taxableIncome * bracket.rate - bracket.progressiveDeduction;
    }
  }
  return 0;
}

/**
 * 월 소득세 + 지방소득세 계산 (추정)
 * @param monthlySalary 월 총 급여
 * @param dependents 부양가족 수 (본인 포함, 최소 1)
 */
export function calculateMonthlyTax(monthlySalary: number, dependents = 1): MonthlyTaxResult {
  if (monthlySalary <= 0) return { incomeTax: 0, localIncomeTax: 0 };
  if (dependents < 1) dependents = 1;

  // 1. 연 환산
  const annualSalary = monthlySalary * 12;
  // 2. 근로소득공제
  const earnedIncomeDeduction = calculateEarnedIncomeDeduction(annualSalary);
  const taxableIncomeBeforeDeduction = annualSalary - earnedIncomeDeduction;
  // 3. 인적공제
  const personalDeduction = PERSONAL_DEDUCTION_PER_PERSON * dependents;
  // 4. 과세표준
  const taxableIncome = Math.max(0, taxableIncomeBeforeDeduction - personalDeduction);
  // 5. 산출세액
  const calculatedTax = applyProgressiveTax(taxableIncome);
  // 6. 근로소득세액공제
  const taxCredit = calculateEarnedIncomeTaxCredit(calculatedTax, annualSalary);
  const annualIncomeTax = Math.max(0, calculatedTax - taxCredit);
  // 7. 월 환산
  const monthlyIncomeTax = annualIncomeTax / 12;
  // 8. 지방소득세
  const localTax = monthlyIncomeTax * LOCAL_INCOME_TAX_RATE;
  // 9. 10원 단위 절사
  return {
    incomeTax: roundDown10(monthlyIncomeTax),
    localIncomeTax: roundDown10(localTax),
  };
}
