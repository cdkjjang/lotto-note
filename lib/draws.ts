// 로또 6/45 당첨 데이터 접근 레이어.
// 원본은 scripts/fetch-draws.mjs가 생성하는 data/draws.json (1회차~최신, 정적).
import drawsData from "@/data/draws.json";

export type Division = {
  prize: number; // 해당 등위 1게임당 당첨금(원)
  winners: number; // 당첨 게임 수
};

export type Draw = {
  round: number; // 회차
  date: string; // 추첨일 YYYY-MM-DD
  numbers: number[]; // 당첨번호 6개 (오름차순)
  bonus: number; // 보너스번호
  divisions: Division[]; // [1등..5등]
  totalSales: number; // 총 판매액(원)
  combination: { auto: number; semiAuto: number; manual: number }; // 1등 자동/반자동/수동
};

// 오름차순(1회 → 최신). data/draws.json은 이미 정렬되어 있다.
export const draws = drawsData as unknown as Draw[];

export const latestDraw: Draw = draws[draws.length - 1];
export const firstDraw: Draw = draws[0];
export const TOTAL_ROUNDS = draws.length;

export function getDraw(round: number): Draw | undefined {
  // 회차 == 배열 index+1 이지만, 안전하게 탐색
  const guess = draws[round - 1];
  if (guess && guess.round === round) return guess;
  return draws.find((d) => d.round === round);
}

// 최신 회차부터 n개 (내림차순)
export function recentDraws(n: number): Draw[] {
  return draws.slice(-n).reverse();
}

// 등위 라벨
export const DIVISION_LABELS = ["1등", "2등", "3등", "4등", "5등"] as const;
