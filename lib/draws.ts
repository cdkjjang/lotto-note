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

/**
 * 검색엔진에 색인할 최신 회차 수 — **0, 즉 하나도 색인하지 않는다.**
 *
 * 회차 상세는 1,200여 개가 서로 비슷한 얇은 페이지라, 예전에는 검색 수요가
 * 있을 법한 최신 20회차만 열어 두었다. 2026-09-10 측정에서 **그 20개의 본문이
 * 280~290자**로 나왔다. 애드센스 반려 사유가 "가치가 별로 없는 콘텐츠"인데
 * 사이트맵으로 제출하는 페이지 중 가장 얇은 것이 이 20개였다.
 *
 * 게다가 이 검색어("N회 당첨번호")는 동행복권 공식 페이지가 1위이고,
 * 280자로 이길 수 있는 자리가 아니다. 색인 후보 20개를 얻으려고 얇은 페이지를
 * 남길 이유가 없어 전부 닫았다.
 *
 * ⚠️ 다시 열려면 **본문을 먼저 두껍게 해야 한다.** 숫자만 올리지 말 것.
 * (사이트 안에서 전 회차 조회·이동은 그대로 가능하다 — 크롤링도 막지 않는다.)
 */
export const INDEXED_DRAW_COUNT = 0;

/**
 * 색인 대상에서 제외되는 가장 큰 회차 번호 (이 번호 이하가 차단 대상).
 * `INDEXED_DRAW_COUNT`가 0이면 최신 회차까지 전부 포함된다.
 */
export const LAST_NOINDEX_ROUND = Math.max(0, TOTAL_ROUNDS - INDEXED_DRAW_COUNT);

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
