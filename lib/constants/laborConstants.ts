// 노동 관련 법정 상수 (매년 변경되므로 한 곳에서 관리)
// 포팅 출처: Calculator.Core/Constants/LaborConstants.cs

/** 2026년 최저시급 (원) */
export const MINIMUM_WAGE_2026 = 10_030;

/** 주휴수당 발생 최소 주 근무시간 */
export const MIN_WEEKLY_HOURS_FOR_HOLIDAY_PAY = 15;

/** 법정 주 근무시간 (주휴수당 계산 기준) */
export const STANDARD_WEEKLY_HOURS = 40;

/** 법정 일 근무시간 (주휴수당 계산 시 곱하는 값) */
export const STANDARD_DAILY_HOURS = 8;

/** 일용직 비과세 한도 (1일 기준) */
export const DAILY_WORKER_TAX_FREE_LIMIT = 150_000;

/** 일용직 소득세율 (소득세 + 지방소득세) */
export const DAILY_WORKER_TAX_RATE = 0.027;

/** 3.3% 원천징수율 (프리랜서/사업소득) */
export const FREELANCER_WITHHOLDING_RATE = 0.033;
