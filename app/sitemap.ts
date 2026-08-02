import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { INDEXED_DRAW_COUNT, draws, latestDraw } from "@/lib/draws";
import { guides } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastMod = new Date(latestDraw.date);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1, lastModified: lastMod },
    { url: `${SITE_URL}/numbers`, changeFrequency: "weekly", priority: 0.9, lastModified: lastMod },
    { url: `${SITE_URL}/stats`, changeFrequency: "weekly", priority: 0.9, lastModified: lastMod },
    { url: `${SITE_URL}/generator`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/check`, changeFrequency: "weekly", priority: 0.8, lastModified: lastMod },
    { url: `${SITE_URL}/stories`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/guide`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/editorial`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${SITE_URL}/guide/${g.slug}`,
    lastModified: new Date(g.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 회차 상세는 1,200여 개가 서로 비슷한 얇은 페이지라 전부 색인하면
  // '가치 낮은 콘텐츠'로 평가받기 쉽다. 검색 수요가 실제로 있는
  // 최신 20회차만 사이트맵에 넣고, 나머지는 robots.ts에서 크롤링을 막는다.
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
