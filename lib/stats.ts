// 당첨번호 통계 — 순수 함수. 모두 Draw[] 를 입력으로 받아 테스트 가능.
// ⚠️ 통계는 과거 사실의 집계일 뿐, 다음 회차 번호를 예측하지 않는다.
//    로또는 매 회차 독립적인 완전 무작위 추첨이다.
import type { Draw } from "./draws";

export const NUMBER_MIN = 1;
export const NUMBER_MAX = 45;
export const ALL_NUMBERS: number[] = Array.from(
  { length: NUMBER_MAX },
  (_, i) => i + 1,
);

export type NumberCount = { number: number; count: number };

// 각 번호(1..45)의 본번호 출현 횟수. 반환 배열 길이 46, index 0은 사용 안 함.
export function frequencyMap(draws: Draw[], includeBonus = false): number[] {
  const map = new Array(NUMBER_MAX + 1).fill(0);
  for (const d of draws) {
    for (const n of d.numbers) map[n]++;
    if (includeBonus) map[d.bonus]++;
  }
  return map;
}

export function frequencies(
  draws: Draw[],
  includeBonus = false,
): NumberCount[] {
  const map = frequencyMap(draws, includeBonus);
  return ALL_NUMBERS.map((n) => ({ number: n, count: map[n] }));
}

// 출현 횟수 내림차순(동률은 번호 오름차순) 상위 n개
export function hotNumbers(draws: Draw[], n = 6): NumberCount[] {
  return [...frequencies(draws)]
    .sort((a, b) => b.count - a.count || a.number - b.number)
    .slice(0, n);
}

// 출현 횟수 오름차순 하위 n개
export function coldNumbers(draws: Draw[], n = 6): NumberCount[] {
  return [...frequencies(draws)]
    .sort((a, b) => a.count - b.count || a.number - b.number)
    .slice(0, n);
}

// 각 번호가 마지막 출현 후 지난 회차 수(0 = 최신 회차에 출현). index 1..45.
// 한 번도 안 나온 번호는 -1.
export function roundsSinceLast(draws: Draw[]): number[] {
  const result = new Array(NUMBER_MAX + 1).fill(-1);
  if (draws.length === 0) return result;
  const latestRound = draws[draws.length - 1].round;
  for (let i = draws.length - 1; i >= 0; i--) {
    const d = draws[i];
    for (const num of d.numbers) {
      if (result[num] === -1) result[num] = latestRound - d.round;
    }
    // 조기 종료: 모두 채워졌으면 멈춤
  }
  return result;
}

// 각 회차의 홀수 개수(0~6) 분포 — dist[k] = 홀수가 k개였던 회차 수
export function oddCountDistribution(draws: Draw[]): number[] {
  const dist = new Array(7).fill(0);
  for (const d of draws) {
    const odd = d.numbers.filter((n) => n % 2 === 1).length;
    dist[odd]++;
  }
  return dist;
}

// 저번호(1~22) vs 고번호(23~45) — dist[k] = 저번호가 k개였던 회차 수
export function lowCountDistribution(draws: Draw[]): number[] {
  const dist = new Array(7).fill(0);
  for (const d of draws) {
    const low = d.numbers.filter((n) => n <= 22).length;
    dist[low]++;
  }
  return dist;
}

// 통계 가중 번호 생성용 가중치(index 1..45). 출현이 잦은 번호에 더 큰 가중.
// (예측이 아니라 "많이 나온 번호 위주"라는 재미 요소일 뿐)
export function frequencyWeights(draws: Draw[]): number[] {
  const map = frequencyMap(draws);
  // 최소 1 보정해 한 번도 안 나온 번호도 0 확률이 되지 않게
  return map.map((c) => c + 1);
}
