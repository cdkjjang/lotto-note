import { describe, expect, it } from "vitest";
import sitemap from "../app/sitemap";
import { INDEXED_DRAW_COUNT, LAST_NOINDEX_ROUND, TOTAL_ROUNDS, latestDraw } from "./draws";

/**
 * 회차 상세 페이지를 색인에서 빼 둔 상태가 조용히 풀리는 것을 막는 테스트.
 *
 * 2026-09-10 측정에서 사이트맵에 열려 있던 최신 20회차의 본문이 **280~290자**로
 * 나왔다. 애드센스 반려 사유가 "가치가 별로 없는 콘텐츠"인데 제출 페이지 중
 * 가장 얇은 것이 그 20개였다. 그래서 전부 닫았다(워크스페이스 CLAUDE.md 8장).
 */

describe("회차 상세 색인 차단", () => {
  it("사이트맵에 회차 상세가 하나도 없다", async () => {
    const entries = await sitemap();
    const drawUrls = entries.filter((e) => /\/numbers\/\d+$/.test(e.url));
    expect(drawUrls).toEqual([]);
  });

  it("모든 회차가 noindex 범위에 든다", () => {
    // generateMetadata 는 `draw.round <= LAST_NOINDEX_ROUND` 로 판단한다.
    expect(LAST_NOINDEX_ROUND).toBeGreaterThanOrEqual(TOTAL_ROUNDS);
    expect(latestDraw.round).toBeLessThanOrEqual(LAST_NOINDEX_ROUND);
  });

  it("slice(-0) 함정에 걸리지 않는다", async () => {
    // -0 === 0 이라 `draws.slice(-0)` 은 배열 전체를 돌려준다.
    // sitemap.ts 가 0일 때를 따로 막지 않으면 1,200여 개가 통째로 들어간다.
    expect(INDEXED_DRAW_COUNT).toBe(0);
    const entries = await sitemap();
    expect(entries.length).toBeLessThan(100);
  });

  it("사이트맵에 목록·통계·확인·생성기 페이지는 남아 있다", async () => {
    // 회차를 닫는 것이지 로또노트 전체를 닫는 것이 아니다.
    const entries = await sitemap();
    const paths = entries.map((e) => e.url.replace(/^https?:\/\/[^/]+/, ""));
    for (const p of ["/numbers", "/stats", "/check", "/generator"]) {
      expect(paths).toContain(p);
    }
  });
});
