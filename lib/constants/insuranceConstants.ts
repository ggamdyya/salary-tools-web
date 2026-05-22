// 4대보험 요율 (2026년 기준)
// 포팅 출처: Calculator.Core/Constants/InsuranceConstants.cs
// 출처: 국민연금공단, 건강보험공단, 근로복지공단, 고용노동부 고시

/** 국민연금 (2026년) */
export const NationalPension = {
  /** 직원 부담률 (4.5%) */
  EmployeeRate: 0.045,
  /** 사업주 부담률 (4.5%) */
  EmployerRate: 0.045,
  /** 월 보수액 상한 (2026년 추정, 매년 7월 변경) */
  MonthlyUpperLimit: 5_900_000,
  /** 월 보수액 하한 (2026년 추정) */
  MonthlyLowerLimit: 370_000,
} as const;

/** 건강보험 (2026년) */
export const HealthInsurance = {
  /** 직원 부담률 (3.545%) */
  EmployeeRate: 0.03545,
  /** 사업주 부담률 (3.545%) */
  EmployerRate: 0.03545,
  /** 장기요양보험 요율 (건강보험료 기준 12.95%) */
  LongTermCareRate: 0.1295,
} as const;

/**
 * 고용보험 (2026년)
 * 직원 부담: 실업급여 0.9% (모든 사업장 동일)
 * 사업주 부담: 실업급여 0.9% + 고용안정·직업능력개발사업
 *   - 150인 미만/우선지원: +0.25% = 1.15%
 *   - 150~1,000인 미만: +0.65% = 1.55%
 *   - 1,000인 이상/국가·지자체: +0.85% = 1.75%
 */
export const EmploymentInsurance = {
  /** 직원 부담률 (실업급여 0.9%) */
  EmployeeRate: 0.009,
  /** 사업주 - 150인 미만 (1.15%) */
  EmployerRateUnder150: 0.0115,
  /** 사업주 - 150인 이상 1,000인 미만 (1.55%) */
  EmployerRate150To1000: 0.0155,
  /** 사업주 - 1,000인 이상 또는 국가/지자체 (1.75%) */
  EmployerRateOver1000: 0.0175,
} as const;

/** 사업장 규모 (고용보험 사업주 부담률 산정용) */
export enum BusinessSize {
  /** 150인 미만 */
  Under150 = "Under150",
  /** 150인 이상 1000인 미만 (우선지원대상기업) */
  From150To1000 = "From150To1000",
  /** 1000인 이상 또는 국가/지자체 */
  Over1000 = "Over1000",
}

export const BUSINESS_SIZE_LABELS: Record<BusinessSize, string> = {
  [BusinessSize.Under150]: "150인 미만",
  [BusinessSize.From150To1000]: "150인 이상 1,000인 미만",
  [BusinessSize.Over1000]: "1,000인 이상 / 국가·지자체",
};
