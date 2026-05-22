/** 숫자를 원화 천단위 콤마 문자열로 (소수점 절사) */
export function won(value: number): string {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

/** 숫자만 콤마 (단위 없음) */
export function comma(value: number): string {
  return Math.round(value).toLocaleString("ko-KR");
}

/** 입력 문자열에서 숫자만 추출 (콤마/원 등 제거) */
export function parseNumber(input: string): number {
  const cleaned = input.replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

/** 입력 표시용: 숫자에 콤마 (빈 값이면 빈 문자열) */
export function formatInput(input: string): string {
  const cleaned = input.replace(/[^0-9]/g, "");
  if (cleaned === "") return "";
  return parseInt(cleaned, 10).toLocaleString("ko-KR");
}
