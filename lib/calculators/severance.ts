// 퇴직금 예상 계산기
// 포팅 출처: Calculator.Core/Calculators/SeveranceCalculator.cs
//
// 퇴직금 = 1일 평균임금 × 30일 × (재직일수 / 365)
// 1일 평균임금 = 마지막 3개월 임금총액 ÷ 마지막 3개월 일수
// 1년 미만 근무 시 퇴직금 발생 안 함.

import { roundDown10 } from "./rounding";

export interface SeveranceResult {
  /** 입사일 (ISO yyyy-mm-dd) */
  startDate: string;
  /** 기준일 */
  endDate: string;
  /** 총 재직일수 */
  totalDays: number;
  /** 재직 년수 (소수점) */
  yearsOfService: number;
  /** 마지막 3개월 평균 월급 */
  recentAverageMonthlySalary: number;
  /** 1일 평균임금 */
  dailyAverageWage: number;
  /** 예상 퇴직금 */
  severanceAmount: number;
  /** 퇴직금 발생 여부 (1년 이상) */
  isEligible: boolean;
  /** 안내 메시지 */
  ineligibleReason?: string;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function dayDiff(start: Date, end: Date): number {
  const s = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const e = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.floor((e - s) / MS_PER_DAY);
}

/**
 * 퇴직금 계산
 * @param startDate 입사일
 * @param endDate 기준일 (보통 오늘)
 * @param recentMonthlySalaries 마지막 3개월 월급 (없으면 빈 배열)
 */
export function calculateSeverance(
  startDate: Date,
  endDate: Date,
  recentMonthlySalaries: number[],
): SeveranceResult {
  const totalDays = dayDiff(startDate, endDate);
  const yearsOfService = totalDays / 365;
  const startIso = startDate.toISOString().slice(0, 10);
  const endIso = endDate.toISOString().slice(0, 10);

  // 1년 미만은 퇴직금 발생 안 함
  if (totalDays < 365) {
    return {
      startDate: startIso,
      endDate: endIso,
      totalDays,
      yearsOfService,
      recentAverageMonthlySalary: 0,
      dailyAverageWage: 0,
      severanceAmount: 0,
      isEligible: false,
      ineligibleReason: `퇴직금은 1년 이상 근무 시 발생합니다. (현재 ${totalDays}일, 약 ${yearsOfService.toFixed(
        1,
      )}년)`,
    };
  }

  // 마지막 3개월 평균 월급
  let averageMonthly = 0;
  if (recentMonthlySalaries.length > 0) {
    const slice = recentMonthlySalaries.slice(0, 3);
    averageMonthly = slice.reduce((a, b) => a + b, 0) / slice.length;
  }

  if (averageMonthly <= 0) {
    return {
      startDate: startIso,
      endDate: endIso,
      totalDays,
      yearsOfService,
      recentAverageMonthlySalary: 0,
      dailyAverageWage: 0,
      severanceAmount: 0,
      isEligible: true,
      ineligibleReason: "마지막 3개월 급여를 입력하면 정확한 퇴직금을 계산할 수 있습니다.",
    };
  }

  // 1일 평균임금 = 월급 × 12 / 365
  const dailyAverageWage = (averageMonthly * 12) / 365;
  // 퇴직금 = 1일 평균임금 × 30 × (재직일수 / 365)
  const severance = dailyAverageWage * 30 * (totalDays / 365);

  return {
    startDate: startIso,
    endDate: endIso,
    totalDays,
    yearsOfService,
    recentAverageMonthlySalary: averageMonthly,
    dailyAverageWage: Math.round(dailyAverageWage),
    severanceAmount: roundDown10(severance),
    isEligible: true,
  };
}
