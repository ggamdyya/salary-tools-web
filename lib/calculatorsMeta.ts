export interface CalcMeta {
  slug: string;
  title: string;
  short: string;
  desc: string;
  emoji: string;
  accent: "juhyu" | "saboheom";
  keywords: string[];
}

export const CALCULATORS: CalcMeta[] = [
  {
    slug: "juhu",
    title: "주휴수당 계산기",
    short: "주휴수당",
    desc: "시급과 주 근무시간으로 주휴수당과 월급을 3초 만에 계산",
    emoji: "🗓️",
    accent: "juhyu",
    keywords: ["주휴수당 계산기", "주휴수당", "최저시급 2026", "알바 주휴수당", "주15시간"],
  },
  {
    slug: "insurance",
    title: "4대보험 계산기",
    short: "4대보험·실수령액",
    desc: "월급에서 4대보험·소득세를 차감한 실수령액과 사업주 총 인건비",
    emoji: "🛡️",
    accent: "saboheom",
    keywords: ["4대보험 계산기", "실수령액 계산기", "월급 실수령액", "국민연금", "건강보험"],
  },
  {
    slug: "salary",
    title: "연봉·월급 환산기",
    short: "연봉↔월급",
    desc: "연봉과 월급을 서로 환산. 퇴직금 포함 옵션 지원",
    emoji: "🔄",
    accent: "saboheom",
    keywords: ["연봉 계산기", "월급 계산기", "연봉 월급 환산", "연봉 실수령액"],
  },
  {
    slug: "severance",
    title: "퇴직금 계산기",
    short: "퇴직금",
    desc: "입사일·퇴사일과 최근 3개월 급여로 예상 퇴직금 계산",
    emoji: "💰",
    accent: "juhyu",
    keywords: ["퇴직금 계산기", "퇴직금", "평균임금", "퇴직금 계산법"],
  },
  {
    slug: "year-end-tax",
    title: "연말정산 환급액 계산기",
    short: "연말정산 예상",
    desc: "연 급여와 원천징수액으로 예상 환급/추가납부 미리 확인",
    emoji: "🧾",
    accent: "saboheom",
    keywords: ["연말정산 계산기", "연말정산 환급금", "연말정산 미리보기", "13월의 월급"],
  },
];

export function getCalc(slug: string): CalcMeta | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

export const SITE_NAME = "급여계산기 모음";
export const SITE_URL = "https://salary-tools.vercel.app";
