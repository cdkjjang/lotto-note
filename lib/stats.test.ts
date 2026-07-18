import { describe, expect, it } from "vitest";
import type { Draw } from "./draws";
import {
  coldNumbers,
  frequencyMap,
  hotNumbers,
  lowCountDistribution,
  oddCountDistribution,
  roundsSinceLast,
} from "./stats";

const D = (round: number, numbers: number[], bonus: number): Draw => ({
  round,
  date: "2020-01-01",
  numbers,
  bonus,
  divisions: [],
  totalSales: 0,
  combination: { auto: 0, semiAuto: 0, manual: 0 },
});

const fixture: Draw[] = [
  D(1, [1, 2, 3, 4, 5, 6], 7),
  D(2, [1, 2, 3, 10, 11, 12], 8),
  D(3, [1, 2, 20, 21, 22, 23], 9),
];

describe("frequencyMap", () => {
  it("본번호 출현 횟수를 센다", () => {
    const map = frequencyMap(fixture);
    expect(map[1]).toBe(3);
    expect(map[2]).toBe(3);
    expect(map[3]).toBe(2);
    expect(map[4]).toBe(1);
    expect(map[8]).toBe(0); // 보너스로만 등장 → 본번호 0
  });
  it("includeBonus=true면 보너스도 포함", () => {
    const map = frequencyMap(fixture, true);
    expect(map[8]).toBe(1);
    expect(map[7]).toBe(1);
  });
});

describe("hot/cold", () => {
  it("hotNumbers는 최다 출현부터", () => {
    const hot = hotNumbers(fixture, 3);
    expect(hot.map((h) => h.number)).toEqual([1, 2, 3]);
    expect(hot[0].count).toBe(3);
  });
  it("coldNumbers는 최소 출현부터(0회 포함)", () => {
    const cold = coldNumbers(fixture, 1);
    // 한 번도 안 나온 번호(예: 8,13...)가 count 0으로 최하위
    expect(cold[0].count).toBe(0);
  });
});

describe("roundsSinceLast", () => {
  it("최신 회차에 나온 번호는 0", () => {
    const r = roundsSinceLast(fixture);
    expect(r[1]).toBe(0); // 3회에 출현
    expect(r[20]).toBe(0);
  });
  it("과거에만 나온 번호는 경과 회차 수", () => {
    const r = roundsSinceLast(fixture);
    expect(r[4]).toBe(2); // 1회에 마지막, 최신 3회 → 2
    expect(r[10]).toBe(1); // 2회에 마지막 → 1
  });
  it("한 번도 안 나온 번호는 -1", () => {
    const r = roundsSinceLast(fixture);
    expect(r[8]).toBe(-1);
  });
});

describe("분포", () => {
  it("oddCountDistribution — 세 회차 모두 홀수 3개", () => {
    const dist = oddCountDistribution(fixture);
    expect(dist[3]).toBe(3);
    expect(dist[0]).toBe(0);
  });
  it("lowCountDistribution — 저번호(1~22) 개수", () => {
    const dist = lowCountDistribution(fixture);
    // 1회:6개, 2회:6개, 3회:5개(23은 고번호)
    expect(dist[6]).toBe(2);
    expect(dist[5]).toBe(1);
  });
});
