// 연봉 ↔ 월급 환산기
// 포팅 출처: Calculator.Core/Calculators/SalaryConverter.cs

import { roundHalfAwayFromZero } from "./rounding";

/**
 * 연봉을 월급으로 변환
 * @param annualSalary 연봉 (원)
 * @param includesSeverance 연봉에 퇴직금(1개월분) 포함 여부
 */
export function annualToMonthly(annualSalary: number, includesSeverance = false): number {
  if (annualSalary < 0) annualSalary = 0;
  const divisor = includesSeverance ? 13 : 12;
  return roundHalfAwayFromZero(annualSalary / divisor);
}

/**
 * 월급을 연봉으로 변환
 * @param monthlySalary 월 급여 (원)
 * @param includeSeverance 퇴직금 1개월분 포함 여부
 */
export function monthlyToAnnual(monthlySalary: number, includeSeverance = false): number {
  if (monthlySalary < 0) monthlySalary = 0;
  const multiplier = includeSeverance ? 13 : 12;
  return monthlySalary * multiplier;
}
