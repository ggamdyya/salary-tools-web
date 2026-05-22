// 포팅 출처: Calculator.Core.Tests/SocialInsuranceCalculatorTests.cs
import { describe, it, expect } from "vitest";
import {
  calculateSocialInsurance,
  employeeTotalDeduction,
  employerInsuranceTotal,
  netSalary,
  totalLaborCost,
} from "../lib/calculators/socialInsurance";
import { calculateMonthlyTax } from "../lib/calculators/incomeTax";
import { annualToMonthly, monthlyToAnnual } from "../lib/calculators/salaryConverter";
import { BusinessSize } from "../lib/constants/insuranceConstants";
import {
  findIndustryByCode,
  DEFAULT_INDUSTRY,
} from "../lib/constants/industrialAccidentRates";

describe("SocialInsuranceCalculator", () => {
  it("월급 300만원 카페업종 본인1명 정상 계산", () => {
    const industry = findIndustryByCode("82")!;
    const r = calculateSocialInsurance({ monthlyGrossSalary: 3_000_000, industry, dependents: 1 });

    expect(r.monthlyGrossSalary).toBe(3_000_000);
    expect(r.employeeNationalPension).toBe(135_000);
    expect(r.employerNationalPension).toBe(135_000);
    expect(r.employeeHealthInsurance).toBe(106_350);
    expect(Math.abs(r.employeeLongTermCare - 13_770)).toBeLessThanOrEqual(10);
    expect(r.employeeEmploymentInsurance).toBe(27_000);
    expect(r.employerIndustrialAccident).toBe(24_000);

    expect(netSalary(r)).toBeGreaterThan(0);
    expect(netSalary(r)).toBeLessThan(3_000_000);
    expect(totalLaborCost(r)).toBeGreaterThan(3_000_000);
  });

  it("월급 0원이면 건강/고용/세금 0", () => {
    const r = calculateSocialInsurance({ monthlyGrossSalary: 0, industry: DEFAULT_INDUSTRY });
    expect(r.employeeHealthInsurance).toBe(0);
    expect(r.employeeEmploymentInsurance).toBe(0);
    expect(r.incomeTax).toBe(0);
    expect(r.localIncomeTax).toBe(0);
  });

  it("월급 매우 높음 → 국민연금 상한 적용 (265,500)", () => {
    const r = calculateSocialInsurance({ monthlyGrossSalary: 20_000_000, industry: DEFAULT_INDUSTRY });
    expect(r.employeeNationalPension).toBe(265_500);
  });

  it("부양가족 많을수록 소득세 감소", () => {
    const r1 = calculateSocialInsurance({ monthlyGrossSalary: 5_000_000, industry: DEFAULT_INDUSTRY, dependents: 1 });
    const r4 = calculateSocialInsurance({ monthlyGrossSalary: 5_000_000, industry: DEFAULT_INDUSTRY, dependents: 4 });
    expect(r4.incomeTax).toBeLessThan(r1.incomeTax);
  });

  it("사업장 규모 따라 고용보험 사업주 부담률 달라짐", () => {
    const small = calculateSocialInsurance({ monthlyGrossSalary: 3_000_000, industry: DEFAULT_INDUSTRY, businessSize: BusinessSize.Under150 });
    const large = calculateSocialInsurance({ monthlyGrossSalary: 3_000_000, industry: DEFAULT_INDUSTRY, businessSize: BusinessSize.Over1000 });
    expect(large.employerEmploymentInsurance).toBeGreaterThan(small.employerEmploymentInsurance);
  });

  it("고용보험 사업주 부담률 정확값 검증", () => {
    const under150 = calculateSocialInsurance({ monthlyGrossSalary: 3_000_000, industry: DEFAULT_INDUSTRY, businessSize: BusinessSize.Under150 });
    expect(under150.employerEmploymentInsurance).toBe(34_500);
    const mid = calculateSocialInsurance({ monthlyGrossSalary: 3_000_000, industry: DEFAULT_INDUSTRY, businessSize: BusinessSize.From150To1000 });
    expect(mid.employerEmploymentInsurance).toBe(46_500);
    const large = calculateSocialInsurance({ monthlyGrossSalary: 3_000_000, industry: DEFAULT_INDUSTRY, businessSize: BusinessSize.Over1000 });
    expect(large.employerEmploymentInsurance).toBe(52_500);
  });

  it("직원 고용보험 사업장 규모 무관 0.9%", () => {
    const small = calculateSocialInsurance({ monthlyGrossSalary: 3_000_000, industry: DEFAULT_INDUSTRY, businessSize: BusinessSize.Under150 });
    const mid = calculateSocialInsurance({ monthlyGrossSalary: 3_000_000, industry: DEFAULT_INDUSTRY, businessSize: BusinessSize.From150To1000 });
    const large = calculateSocialInsurance({ monthlyGrossSalary: 3_000_000, industry: DEFAULT_INDUSTRY, businessSize: BusinessSize.Over1000 });
    expect(small.employeeEmploymentInsurance).toBe(27_000);
    expect(mid.employeeEmploymentInsurance).toBe(27_000);
    expect(large.employeeEmploymentInsurance).toBe(27_000);
  });

  it("건강보험·장기요양 정확값 검증", () => {
    const r = calculateSocialInsurance({ monthlyGrossSalary: 3_000_000, industry: DEFAULT_INDUSTRY });
    expect(r.employeeHealthInsurance).toBe(106_350);
    expect(r.employerHealthInsurance).toBe(106_350);
    expect(r.employeeLongTermCare).toBe(13_770);
    expect(r.employerLongTermCare).toBe(13_770);
  });

  it.each([
    ["82", 0.008],
    ["32", 0.007],
    ["41", 0.0357],
    ["00", 0.007],
  ])("산재보험 업종별 요율 적용 (%s)", (code, rate) => {
    const industry = findIndustryByCode(code as string)!;
    expect(industry).toBeTruthy();
    const r = calculateSocialInsurance({ monthlyGrossSalary: 3_000_000, industry });
    const expected = Math.floor((3_000_000 * (rate as number)) / 10) * 10;
    expect(r.employerIndustrialAccident).toBe(expected);
  });

  it("직원 부담 합계 정확", () => {
    const r = calculateSocialInsurance({ monthlyGrossSalary: 3_000_000, industry: DEFAULT_INDUSTRY, dependents: 1 });
    const manualSum =
      r.employeeNationalPension +
      r.employeeHealthInsurance +
      r.employeeLongTermCare +
      r.employeeEmploymentInsurance +
      r.incomeTax +
      r.localIncomeTax;
    expect(employeeTotalDeduction(r)).toBe(manualSum);
    expect(netSalary(r)).toBe(3_000_000 - manualSum);
  });

  it("사업주 총 인건비 계산 정확", () => {
    const r = calculateSocialInsurance({ monthlyGrossSalary: 3_000_000, industry: DEFAULT_INDUSTRY });
    expect(totalLaborCost(r)).toBe(r.monthlyGrossSalary + employerInsuranceTotal(r));
  });
});

describe("SalaryConverter", () => {
  it("연봉 3600만 → 월급 300만", () => {
    expect(annualToMonthly(36_000_000)).toBe(3_000_000);
  });
  it("월급 300만 → 연봉 3600만", () => {
    expect(monthlyToAnnual(3_000_000)).toBe(36_000_000);
  });
  it("퇴직금 포함 연봉 3900만 → 월급 300만", () => {
    expect(annualToMonthly(39_000_000, true)).toBe(3_000_000);
  });
});

describe("IncomeTaxCalculator", () => {
  it("월급 0이면 세금 0", () => {
    const { incomeTax, localIncomeTax } = calculateMonthlyTax(0);
    expect(incomeTax).toBe(0);
    expect(localIncomeTax).toBe(0);
  });
  it("월급 300만 부양가족1명 세금 양수", () => {
    const { incomeTax, localIncomeTax } = calculateMonthlyTax(3_000_000, 1);
    expect(incomeTax).toBeGreaterThan(0);
    expect(localIncomeTax).toBe(Math.floor((incomeTax * 0.1) / 10) * 10);
  });
  it("부양가족 늘면 세금 감소", () => {
    const t1 = calculateMonthlyTax(5_000_000, 1).incomeTax;
    const t4 = calculateMonthlyTax(5_000_000, 4).incomeTax;
    expect(t4).toBeLessThan(t1);
  });
});
