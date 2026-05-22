// AdSense 설정. 환경변수가 없으면 광고는 렌더되지 않으며 사이트에 아무 영향 없음.
// 승인 후 .env.local 에 값을 채우면 자동으로 광고가 활성화된다.

/** 게시자 ID (예: ca-pub-1234567890123456) */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

/** 게시자 ID 설정 여부 (스크립트 로드/ads.txt 기준) */
export const adsEnabled = /^ca-pub-\d+$/.test(ADSENSE_CLIENT);

/** 위치별 광고 슬롯 ID (광고 단위 생성 후 발급되는 숫자열) */
export const AD_SLOTS = {
  /** 계산 결과 하단 */
  calcBottom: process.env.NEXT_PUBLIC_AD_SLOT_CALC ?? "",
  /** 블로그 글 하단 */
  article: process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE ?? "",
} as const;
