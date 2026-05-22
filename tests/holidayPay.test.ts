// 포팅 출처: Calculator.Core.Tests/HolidayPayCalculatorTests.cs
import { describe, it, expect } from "vitest";
import { calculateHolidayPay } from "../lib/calculators/holidayPay";

describe("HolidayPayCalculator", () => {
  it("주 15시간 미만 근무 시 주휴수당 미발생", () => {
    const r = calculateHolidayPay(14, 10_030);
    expect(r.isEligible).toBe(false);
    expect(r.weeklyHolidayPay).toBe(0);
    expect(r.ineligibleReason).toBeTruthy();
  });

  it("주 15시간 정확히 근무 시 주휴수당 발생 (30,090)", () => {
    const r = calculateHolidayPay(15, 10_030);
    expect(r.isEligible).toBe(true);
    expect(r.weeklyHolidayPay).toBe(30_090);
  });

  it("주 40시간 근무 시 주휴수당 8시간분 (80,240)", () => {
    const r = calculateHolidayPay(40, 10_030);
    expect(r.isEligible).toBe(true);
    expect(r.weeklyHolidayPay).toBe(80_240);
  });

  it("주 40시간 초과 근무 시 40시간 기준", () => {
    const r = calculateHolidayPay(50, 10_030);
    expect(r.isEligible).toBe(true);
    expect(r.weeklyHolidayPay).toBe(80_240);
  });

  it("주 25시간 근무 시 정확한 주휴수당 (50,150)", () => {
    const r = calculateHolidayPay(25, 10_030);
    expect(r.isEligible).toBe(true);
    expect(r.weeklyHolidayPay).toBe(50_150);
  });

  it("시급 0 입력 시 미발생", () => {
    const r = calculateHolidayPay(20, 0);
    expect(r.isEligible).toBe(false);
    expect(r.ineligibleReason).toContain("시급");
  });

  it("근무시간 0 입력 시 미발생", () => {
    const r = calculateHolidayPay(0, 10_030);
    expect(r.isEligible).toBe(false);
    expect(r.ineligibleReason).toContain("근무시간");
  });

  it("월간 급여 계산 검증 (약 2,091,857)", () => {
    const r = calculateHolidayPay(40, 10_030);
    expect(Math.abs(r.monthlyTotalPay - 2_091_857)).toBeLessThanOrEqual(5);
  });

  it.each([
    [15, 10_030, 30_090],
    [20, 10_030, 40_120],
    [30, 10_030, 60_180],
    [40, 10_030, 80_240],
    [40, 12_000, 96_000],
  ])("다양한 조합 (%i시간, 시급 %i) → %i", (hours, wage, expected) => {
    const r = calculateHolidayPay(hours, wage);
    expect(r.weeklyHolidayPay).toBe(expected);
  });
});
