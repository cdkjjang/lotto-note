import { describe, expect, it } from "vitest";
import {
  generateGames,
  generateNumbers,
  PICK_COUNT,
  seededRng,
} from "./generator";

function isValidTicket(nums: number[], count = PICK_COUNT) {
  expect(nums).toHaveLength(count);
  expect(new Set(nums).size).toBe(count); // 중복 없음
  for (const n of nums) {
    expect(n).toBeGreaterThanOrEqual(1);
    expect(n).toBeLessThanOrEqual(45);
  }
  // 오름차순 정렬
  expect([...nums].sort((a, b) => a - b)).toEqual(nums);
}

describe("generateNumbers", () => {
  it("기본: 1~45 범위의 유효한 6개", () => {
    isValidTicket(generateNumbers({ rng: seededRng(1) }));
  });

  it("같은 시드면 결정적으로 동일", () => {
    const a = generateNumbers({ rng: seededRng(42) });
    const b = generateNumbers({ rng: seededRng(42) });
    expect(a).toEqual(b);
  });

  it("고정수(include)는 반드시 포함", () => {
    const nums = generateNumbers({ include: [7, 13], rng: seededRng(3) });
    expect(nums).toContain(7);
    expect(nums).toContain(13);
    isValidTicket(nums);
  });

  it("제외수(exclude)는 절대 나오지 않는다", () => {
    const exclude = [1, 2, 3, 4, 5, 10, 20, 30, 40];
    const nums = generateNumbers({ exclude, rng: seededRng(9) });
    for (const n of exclude) expect(nums).not.toContain(n);
    isValidTicket(nums);
  });

  it("제외수 우선: include와 exclude가 겹치면 exclude", () => {
    const nums = generateNumbers({
      include: [8],
      exclude: [8],
      rng: seededRng(5),
    });
    expect(nums).not.toContain(8);
  });

  it("가중치가 특정 번호에만 있으면 그 번호들만 뽑힌다", () => {
    const weights = new Array(46).fill(0);
    for (const n of [11, 12, 13, 14, 15, 16]) weights[n] = 1;
    const nums = generateNumbers({ weights, rng: seededRng(7) });
    expect(nums).toEqual([11, 12, 13, 14, 15, 16]);
  });
});

describe("generateGames", () => {
  it("요청한 게임 수만큼 각각 유효한 티켓 생성", () => {
    const games = generateGames(5, { rng: seededRng(100) });
    expect(games).toHaveLength(5);
    for (const g of games) isValidTicket(g);
  });
});
