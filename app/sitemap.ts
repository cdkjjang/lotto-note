import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { INDEXED_DRAW_COUNT, draws, latestDraw } from "@/lib/draws";
import { guides } from "@/lib/guides";

// 추첨 결과와 무관한 정적 페이지의 최종 갱신일.
// 본문을 손볼 때 함께 올려 재크롤링을 유도한다.
const TOOL_UPDATED = "2026-08-03";

export default function sitemap(): MetadataRoute.Sitemap {
  // 회차 데이터가 반영되는 페이지는 최신 추첨일을 갱신일로 쓴다.
  const lastMod = new Date(latestDraw.date);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: lastMod, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/numbers`, lastModified: lastMod, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/stats`, lastModified: lastMod, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/check`, lastModified: lastMod, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/generator`, lastModified: TOOL_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/stories`, lastModified: TOOL_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/guide`, lastModified: TOOL_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: TOOL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/contact`, lastModified: TOOL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/editorial`, lastModified: TOOL_UPDATED, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: TOOL_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: TOOL_UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${SITE_URL}/guide/${g.slug}`,
    lastModified: new Date(g.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 회차 상세는 1,200여 개가 서로 비슷한 얇은 페이지라 전부 색인하면
  // '가치 낮은 콘텐츠'로 평가받기 쉽다. 검색 수요가 실제로 있는
  // 최신 20회차만 사이트맵에 넣고, 나머지는 noindex로 처리한다.
  // (사이트 안에서는 조회·이동이 그대로 가능하다.)
  const drawPages: MetadataRoute.Sitemap = draws
    .slice(-INDEXED_DRAW_COUNT)
    .map((d) => ({
      url: `${SITE_URL}/numbers/${d.round}`,
      lastModified: new Date(d.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }));

  return [...staticPages, ...guidePages, ...drawPages];
}
