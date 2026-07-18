import { describe, expect, it } from "vitest";
import { checkAllHistory, checkDraw, rankLabel, type SlimDraw } from "./check";

const WIN = [1, 2, 3, 4, 5, 6];
const BONUS = 7;

describe("checkDraw — 등수 판정", () => {
  it("6개 일치 → 1등", () => {
    const r = checkDraw([1, 2, 3, 4, 5, 6], WIN, BONUS);
    expect(r.rank).toBe(1);
    expect(r.matchCount).toBe(6);
  });
  it("5개 + 보너스 → 2등", () => {
    const r = checkDraw([1, 2, 3, 4, 5, 7], WIN, BONUS);
    expect(r.rank).toBe(2);
    expect(r.matchCount).toBe(5);
    expect(r.bonusMatched).toBe(true);
  });
  it("5개(보너스 없음) → 3등", () => {
    const r = checkDraw([1, 2, 3, 4, 5, 8], WIN, BONUS);
    expect(r.rank).toBe(3);
    expect(r.bonusMatched).toBe(false);
  });
  it("4개 → 4등", () => {
    expect(checkDraw([1, 2, 3, 4, 8, 9], WIN, BONUS).rank).toBe(4);
  });
  it("3개 → 5등", () => {
    expect(checkDraw([1, 2, 3, 8, 9, 10], WIN, BONUS).rank).toBe(5);
  });
  it("2개 → 낙첨(0)", () => {
    const r = checkDraw([1, 2, 8, 9, 10, 11], WIN, BONUS);
    expect(r.rank).toBe(0);
    expect(r.matched).toEqual([1, 2]);
  });
});

describe("checkAllHistory", () => {
  const draws: SlimDraw[] = [
    { round: 1, date: "2020-01-01", numbers: [1, 2, 3, 4, 5, 6], bonus: 7 }, // 1등
    { round: 2, date: "2020-01-08", numbers: [1, 2, 3, 4, 5, 8], bonus: 9 }, // 3등(5개)
    { round: 3, date: "2020-01-15", numbers: [10, 11, 12, 13, 14, 15], bonus: 7 }, // 낙첨
  ];

  it("등수 분포와 역대 최고 등수를 집계", () => {
    const s = checkAllHistory([1, 2, 3, 4, 5, 6], draws);
    expect(s.total).toBe(3);
    expect(s.counts[1]).toBe(1); // 1회 1등
    expect(s.counts[3]).toBe(1); // 2회 3등
    expect(s.counts[0]).toBe(1); // 3회 낙첨
    expect(s.best).toEqual({ rank: 1, round: 1, date: "2020-01-01" });
  });

  it("당첨 이력이 없으면 best는 null", () => {
    const s = checkAllHistory([20, 21, 22, 23, 24, 25], draws);
    expect(s.best).toBeNull();
    expect(s.counts[0]).toBe(3);
  });
});

describe("rankLabel", () => {
  it("0은 낙첨, 그 외 N등", () => {
    expect(rankLabel(0)).toBe("낙첨");
    expect(rankLabel(1)).toBe("1등");
  });
});
