// 4대보험 + 소득세 계산기
// 포팅 출처: Calculator.Core/Calculators/SocialInsuranceCalculator.cs

import {
  NationalPension,
  HealthInsurance,
  EmploymentInsurance,
  BusinessSize,
} from "../constants/insuranceConstants";
import { Industry } from "../constants/industrialAccidentRates";
import { calculateMonthlyTax } from "./incomeTax";
import { roundDown10 } from "./rounding";

export interface SocialInsuranceResult {
  monthlyGrossSalary: number;

  // 직원 부담
  employeeNationalPension: number;
  employeeHealthInsurance: number;
  employeeLongTermCare: number;
  employeeEmploymentInsurance: number;
  incomeTax: number;
  localIncomeTax: number;

  // 사업주 부담
  employerNationalPension: number;
  employerHealthInsurance: number;
  employerLongTermCare: number;
  employerEmploymentInsurance: number;
  employerIndustrialAccident: number;

  // 메타
  industryName: string;
  industrialAccidentRate: number;
  dependents: number;
  year: number;
}

/** 국민연금 보수액 상한/하한 적용 */
function applyPensionLimits(monthlySalary: number): number {
  if (monthlySalary > NationalPension.MonthlyUpperLimit) return NationalPension.MonthlyUpperLimit;
  if (monthlySalary < NationalPension.MonthlyLowerLimit) return NationalPension.MonthlyLowerLimit;
  return monthlySalary;
}

export interface SocialInsuranceParams {
  monthlyGrossSalary: number;
  industry: Industry;
  dependents?: number;
  businessSize?: BusinessSize;
}

export function calculateSocialInsurance({
  monthlyGrossSalary,
  industry,
  dependents = 1,
  businessSize = BusinessSize.Under150,
}: SocialInsuranceParams): SocialInsuranceResult {
  if (monthlyGrossSalary < 0) monthlyGrossSalary = 0;
  if (dependents < 1) dependents = 1;

  // 국민연금 (상한/하한)
  const pensionBase = applyPensionLimits(monthlyGrossSalary);
  const employeeNationalPension = roundDown10(pensionBase * NationalPension.EmployeeRate);
  const employerNationalPension = roundDown10(pensionBase * NationalPension.EmployerRate);

  // 건강보험
  const employeeHealthInsurance = roundDown10(monthlyGrossSalary * HealthInsurance.EmployeeRate);
  const employerHealthInsurance = roundDown10(monthlyGrossSalary * HealthInsurance.EmployerRate);

  // 장기요양 (건강보험료 기반)
  const employeeLongTermCare = roundDown10(employeeHealthInsurance * HealthInsurance.LongTermCareRate);
  const employerLongTermCare = roundDown10(employerHealthInsurance * HealthInsurance.LongTermCareRate);

  // 고용보험
  const employeeEmployment = roundDown10(monthlyGrossSalary * EmploymentInsurance.EmployeeRate);
  let employerEmploymentRate: number;
  switch (businessSize) {
    case BusinessSize.From150To1000:
      employerEmploymentRate = EmploymentInsurance.EmployerRate150To1000;
      break;
    case BusinessSize.Over1000:
      employerEmploymentRate = EmploymentInsurance.EmployerRateOver1000;
      break;
    default:
      employerEmploymentRate = EmploymentInsurance.EmployerRateUnder150;
  }
  const employerEmployment = roundDown10(monthlyGrossSalary * employerEmploymentRate);

  // 산재보험 (사업주 단독)
  const employerIndustrialAccident = roundDown10(monthlyGrossSalary * industry.rate);

  // 소득세 (간이세액표 추정)
  const { incomeTax, localIncomeTax } = calculateMonthlyTax(monthlyGrossSalary, dependents);

  return {
    monthlyGrossSalary,
    employeeNationalPension,
    employeeHealthInsurance,
    employeeLongTermCare,
    employeeEmploymentInsurance: employeeEmployment,
    incomeTax,
    localIncomeTax,
    employerNationalPension,
    employerHealthInsurance,
    employerLongTermCare,
    employerEmploymentInsurance: employerEmployment,
    employerIndustrialAccident,
    industryName: industry.name,
    industrialAccidentRate: industry.rate,
    dependents,
    year: 2026,
  };
}

// ===== 파생 계산 (C# SocialInsuranceResult의 computed 속성) =====

/** 직원 부담 합계 (4대보험 + 세금) */
export function employeeTotalDeduction(r: SocialInsuranceResult): number {
  return (
    r.employeeNationalPension +
    r.employeeHealthInsurance +
    r.employeeLongTermCare +
    r.employeeEmploymentInsurance +
    r.incomeTax +
    r.localIncomeTax
  );
}

/** 직원 4대보험 합계 (세금 제외) */
export function employeeInsuranceTotal(r: SocialInsuranceResult): number {
  return (
    r.employeeNationalPension +
    r.employeeHealthInsurance +
    r.employeeLongTermCare +
    r.employeeEmploymentInsurance
  );
}

/** 직원 실수령액 */
export function netSalary(r: SocialInsuranceResult): number {
  return r.monthlyGrossSalary - employeeTotalDeduction(r);
}

/** 사업주 4대보험 부담 합계 */
export function employerInsuranceTotal(r: SocialInsuranceResult): number {
  return (
    r.employerNationalPension +
    r.employerHealthInsurance +
    r.employerLongTermCare +
    r.employerEmploymentInsurance +
    r.employerIndustrialAccident
  );
}

/** 사업주 총 인건비 */
export function totalLaborCost(r: SocialInsuranceResult): number {
  return r.monthlyGrossSalary + employerInsuranceTotal(r);
}
