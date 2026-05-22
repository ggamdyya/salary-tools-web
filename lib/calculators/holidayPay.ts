// 주휴수당 계산기 — 근로기준법 제55조 및 시행령 제30조 기준
// 포팅 출처: Calculator.Core/Calculators/HolidayPayCalculator.cs

import {
  MIN_WEEKLY_HOURS_FOR_HOLIDAY_PAY,
  STANDARD_WEEKLY_HOURS,
  STANDARD_DAILY_HOURS,
} from "../constants/laborConstants";
import { roundToEven } from "./rounding";

/** 월 평균 주 수 (1년 52.14주 / 12개월 ≈ 4.345주) */
const MONTHLY_WEEK_FACTOR = 4.345;

export interface HolidayPayResult {
  /** 주휴수당 발생 여부 */
  isEligible: boolean;
  /** 미발생 사유 */
  ineligibleReason?: string;
  /** 주 근무시간 */
  weeklyHours: number;
  /** 시급 */
  hourlyWage: number;
  /** 주간 주휴수당 */
  weeklyHolidayPay: number;
  /** 월간 주휴수당 (4.345주 기준) */
  monthlyHolidayPay: number;
  /** 월간 기본급 (주휴수당 제외) */
  monthlyBasicPay: number;
  /** 월간 총 급여 (기본급 + 주휴수당) */
  monthlyTotalPay: number;
  /** 계산식 설명 */
  calculationFormula: string;
}

function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("ko-KR");
}

/** 주휴수당 계산 */
export function calculateHolidayPay(weeklyHours: number, hourlyWage: number): HolidayPayResult {
  const base: HolidayPayResult = {
    isEligible: false,
    weeklyHours,
    hourlyWage,
    weeklyHolidayPay: 0,
    monthlyHolidayPay: 0,
    monthlyBasicPay: 0,
    monthlyTotalPay: 0,
    calculationFormula: "",
  };

  if (weeklyHours <= 0) {
    return { ...base, ineligibleReason: "주 근무시간을 입력해주세요." };
  }

  if (hourlyWage <= 0) {
    return { ...base, ineligibleReason: "시급을 입력해주세요." };
  }

  // 주 15시간 미만 → 주휴수당 미발생
  if (weeklyHours < MIN_WEEKLY_HOURS_FOR_HOLIDAY_PAY) {
    const monthlyBasicPay = roundToEven(weeklyHours * hourlyWage * MONTHLY_WEEK_FACTOR);
    return {
      ...base,
      ineligibleReason: `주 ${MIN_WEEKLY_HOURS_FOR_HOLIDAY_PAY}시간 미만 근무 시 주휴수당이 발생하지 않습니다.`,
      monthlyBasicPay,
      monthlyTotalPay: monthlyBasicPay,
    };
  }

  // 공식: (주 근무시간 / 40) × 8 × 시급, 단 40시간 초과 시 40시간 제한
  const effectiveWeeklyHours = Math.min(weeklyHours, STANDARD_WEEKLY_HOURS);
  const weeklyHolidayPay =
    (effectiveWeeklyHours / STANDARD_WEEKLY_HOURS) * STANDARD_DAILY_HOURS * hourlyWage;
  const monthlyHolidayPay = weeklyHolidayPay * MONTHLY_WEEK_FACTOR;
  const monthlyBasicPay = weeklyHours * hourlyWage * MONTHLY_WEEK_FACTOR;

  const roundedWeekly = roundToEven(weeklyHolidayPay);
  const roundedMonthlyHoliday = roundToEven(monthlyHolidayPay);
  const roundedMonthlyBasic = roundToEven(monthlyBasicPay);

  const effHoursStr = Number.isInteger(effectiveWeeklyHours)
    ? effectiveWeeklyHours.toString()
    : effectiveWeeklyHours.toFixed(1);

  return {
    isEligible: true,
    weeklyHours,
    hourlyWage,
    weeklyHolidayPay: roundedWeekly,
    monthlyHolidayPay: roundedMonthlyHoliday,
    monthlyBasicPay: roundedMonthlyBasic,
    monthlyTotalPay: roundedMonthlyBasic + roundedMonthlyHoliday,
    calculationFormula: `(${effHoursStr} / 40) × 8 × ${formatNumber(hourlyWage)}원 = ${formatNumber(
      weeklyHolidayPay,
    )}원 (주간)`,
  };
}
