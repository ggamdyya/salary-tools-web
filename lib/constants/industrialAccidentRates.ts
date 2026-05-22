// 산재보험 업종별 요율표 (2026년 기준). 산재보험은 사업주 단독 부담.
// 포팅 출처: Calculator.Core/Constants/IndustrialAccidentRates.cs
// 출처: 고용노동부 고시. 대표 업종 그룹으로 단순화.

export interface Industry {
  code: string;
  category: string;
  name: string;
  rate: number;
}

/** 전체 업종 목록 (요율은 천분율을 비율로 환산) */
export const INDUSTRIES: readonly Industry[] = [
  // 광업
  { code: "11", category: "광업", name: "석탄광업 및 채석업", rate: 0.2851 },
  { code: "12", category: "광업", name: "금속광업", rate: 0.0568 },
  { code: "13", category: "광업", name: "비금속광업 및 기타광업", rate: 0.1378 },
  // 제조업
  { code: "21", category: "제조업", name: "식료품 제조업", rate: 0.014 },
  { code: "22", category: "제조업", name: "섬유 또는 섬유제품 제조업", rate: 0.009 },
  { code: "23", category: "제조업", name: "목재 및 종이제품 제조업", rate: 0.0188 },
  { code: "24", category: "제조업", name: "출판·인쇄·제본업", rate: 0.008 },
  { code: "25", category: "제조업", name: "화학제품 제조업", rate: 0.009 },
  { code: "26", category: "제조업", name: "의약품·화장품 제조업", rate: 0.007 },
  { code: "27", category: "제조업", name: "고무 및 플라스틱 제조업", rate: 0.0125 },
  { code: "28", category: "제조업", name: "유리·도자기·시멘트 제조업", rate: 0.026 },
  { code: "29", category: "제조업", name: "1차 금속 제조업", rate: 0.0173 },
  { code: "30", category: "제조업", name: "금속제품 제조업", rate: 0.0175 },
  { code: "31", category: "제조업", name: "기계기구 제조업", rate: 0.0118 },
  { code: "32", category: "제조업", name: "전기·전자기기 제조업", rate: 0.007 },
  { code: "33", category: "제조업", name: "수송용 기계기구 제조업", rate: 0.015 },
  { code: "34", category: "제조업", name: "기타 제조업", rate: 0.015 },
  // 건설업
  { code: "41", category: "건설업", name: "건설업 (일반)", rate: 0.0357 },
  // 전기·가스·수도
  { code: "51", category: "전기·가스·수도", name: "전기·가스·증기 및 수도사업", rate: 0.008 },
  // 운수·창고·통신
  { code: "61", category: "운수·창고·통신", name: "철도·항공·운수 관련 서비스업", rate: 0.008 },
  { code: "62", category: "운수·창고·통신", name: "육상 및 수상 운수업", rate: 0.019 },
  { code: "63", category: "운수·창고·통신", name: "창고 및 운송 관련 서비스업", rate: 0.008 },
  { code: "64", category: "운수·창고·통신", name: "통신업", rate: 0.009 },
  // 임업
  { code: "71", category: "임업", name: "임업", rate: 0.0571 },
  // 어업
  { code: "72", category: "어업", name: "어업", rate: 0.0277 },
  // 농업
  { code: "73", category: "농업", name: "농업", rate: 0.0071 },
  // 도소매·음식·숙박
  { code: "81", category: "도소매·음식·숙박", name: "도매 및 소매업", rate: 0.008 },
  { code: "82", category: "도소매·음식·숙박", name: "음식 및 숙박업 (카페·식당 포함)", rate: 0.008 },
  // 부동산·임대
  { code: "91", category: "부동산·임대", name: "부동산 및 임대업", rate: 0.007 },
  // 금융·보험
  { code: "92", category: "금융·보험", name: "금융 및 보험업", rate: 0.006 },
  // 교육·연구
  { code: "93", category: "교육·연구", name: "교육서비스업 (학원 포함)", rate: 0.007 },
  { code: "94", category: "교육·연구", name: "전문·과학 및 기술서비스업", rate: 0.007 },
  // 보건·복지
  { code: "95", category: "보건·복지", name: "보건업 (병원·의원)", rate: 0.008 },
  { code: "96", category: "보건·복지", name: "사회복지서비스업", rate: 0.006 },
  // 기타 서비스
  { code: "97", category: "기타 서비스", name: "공공행정·국방", rate: 0.006 },
  { code: "98", category: "기타 서비스", name: "회원단체 및 종교단체", rate: 0.006 },
  { code: "99", category: "기타 서비스", name: "오락·문화·운동 관련 서비스업", rate: 0.009 },
  // 기타
  { code: "00", category: "기타", name: "사무직 (사무실 근무)", rate: 0.007 },
  { code: "01", category: "기타", name: "기타 분류 외", rate: 0.008 },
];

/** 카테고리 순서 (UI 그룹핑용, 등장 순서 유지) */
export function industryCategories(): string[] {
  const seen: string[] = [];
  for (const ind of INDUSTRIES) {
    if (!seen.includes(ind.category)) seen.push(ind.category);
  }
  return seen;
}

/** 기본 업종 (카페/음식점) */
export const DEFAULT_INDUSTRY: Industry = INDUSTRIES.find((i) => i.code === "82")!;

/** 코드로 업종 검색 */
export function findIndustryByCode(code: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.code === code);
}
