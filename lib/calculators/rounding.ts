// C# decimal 반올림 방식을 JS number로 재현하기 위한 헬퍼.

/**
 * 10원 단위 절사 (실제 4대보험료 부과 방식) — C# Math.Floor(v/10)*10
 * C# decimal 연산은 정확하지만 JS number는 부동소수 오차가 있어
 * (예: 3_000_000 * 0.009 = 26999.9999...), 절사 전 sub-원 수준에서 보정한다.
 */
export function roundDown10(value: number): number {
  const corrected = Number(value.toFixed(4));
  return Math.floor(corrected / 10) * 10;
}

/**
 * C# Math.Round 기본값 (MidpointRounding.ToEven, 은행가 반올림).
 * 부동소수 오차를 줄이기 위해 소수 6자리에서 보정 후 처리.
 */
export function roundToEven(value: number): number {
  const corrected = Number(value.toFixed(6));
  const floor = Math.floor(corrected);
  const diff = corrected - floor;
  if (diff < 0.5) return floor;
  if (diff > 0.5) return floor + 1;
  // 정확히 0.5 → 짝수로
  return floor % 2 === 0 ? floor : floor + 1;
}

/** C# Math.Round(v, MidpointRounding.AwayFromZero) */
export function roundHalfAwayFromZero(value: number): number {
  const corrected = Number(value.toFixed(6));
  return Math.sign(corrected) * Math.round(Math.abs(corrected));
}
