// 근로소득 간이세액표 기반 소득세 계산용 상수
// 포팅 출처: Calculator.Core/Constants/IncomeTaxConstants.cs
// 정확한 세액은 국세청 간이세액표 참조 필요. 본 앱은 산식 기반 추정치.

export interface TaxBracket {
  lowerBound: number;
  upperBound: number;
  rate: number;
  progressiveDeduction: number;
}

/**
 * 종합소득세 과세표준 누진세율 (2026년 기준)
 * 산출세액 = 과세표준 × 세율 - 누진공제
 */
export const TAX_BRACKETS: readonly TaxBracket[] = [
  { lowerBound: 0, upperBound: 14_000_000, rate: 0.06, progressiveDeduction: 0 },
  { lowerBound: 14_000_000, upperBound: 50_000_000, rate: 0.15, progressiveDeduction: 1_260_000 },
  { lowerBound: 50_000_000, upperBound: 88_000_000, rate: 0.24, progressiveDeduction: 5_760_000 },
  { lowerBound: 88_000_000, upperBound: 150_000_000, rate: 0.35, progressiveDeduction: 15_440_000 },
  { lowerBound: 150_000_000, upperBound: 300_000_000, rate: 0.38, progressiveDeduction: 19_940_000 },
  { lowerBound: 300_000_000, upperBound: 500_000_000, rate: 0.4, progressiveDeduction: 25_940_000 },
  { lowerBound: 500_000_000, upperBound: 1_000_000_000, rate: 0.42, progressiveDeduction: 35_940_000 },
  { lowerBound: 1_000_000_000, upperBound: Number.MAX_VALUE, rate: 0.45, progressiveDeduction: 65_940_000 },
];

/** 근로소득공제 (연 총급여 기준) */
export function calculateEarnedIncomeDeduction(annualIncome: number): number {
  if (annualIncome <= 5_000_000) return annualIncome * 0.7;
  if (annualIncome <= 15_000_000) return 3_500_000 + (annualIncome - 5_000_000) * 0.4;
  if (annualIncome <= 45_000_000) return 7_500_000 + (annualIncome - 15_000_000) * 0.15;
  if (annualIncome <= 100_000_000) return 12_000_000 + (annualIncome - 45_000_000) * 0.05;
  return 14_750_000 + (annualIncome - 100_000_000) * 0.02;
}

/** 근로소득세액공제 (산출세액 기준) */
export function calculateEarnedIncomeTaxCredit(calculatedTax: number, annualIncome: number): number {
  let credit: number;
  if (calculatedTax <= 1_300_000) {
    credit = calculatedTax * 0.55;
  } else {
    credit = 715_000 + (calculatedTax - 1_300_000) * 0.3;
  }

  let maxCredit: number;
  if (annualIncome <= 33_000_000) {
    maxCredit = 740_000;
  } else if (annualIncome <= 70_000_000) {
    maxCredit = Math.max(660_000, 740_000 - (annualIncome - 33_000_000) * 0.008);
  } else if (annualIncome <= 120_000_000) {
    maxCredit = Math.max(500_000, 660_000 - ((annualIncome - 70_000_000) * 0.5) / 100);
  } else {
    maxCredit = Math.max(200_000, 500_000 - ((annualIncome - 120_000_000) * 0.5) / 100);
  }

  return Math.min(credit, maxCredit);
}

/** 인적공제 1인당 금액 (연 150만원) */
export const PERSONAL_DEDUCTION_PER_PERSON = 1_500_000;

/** 지방소득세율 (소득세의 10%) */
export const LOCAL_INCOME_TAX_RATE = 0.1;
