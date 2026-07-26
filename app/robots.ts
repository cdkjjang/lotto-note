import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * 회차 상세(/numbers/[round])는 1,200여 개가 서로 비슷한 얇은 페이지다.
 * 전부 색인되면 '가치 낮은 콘텐츠' 비중이 커지므로 색인을 제한한다.
 *
 * 구현: 오래된 회차 페이지에는 `robots: { index: false }` 메타태그를 붙이고
 * (app/numbers/[round]/page.tsx의 generateMetadata), sitemap에는 최신 회차만 넣는다.
 * robots.txt로 크롤링 자체를 막으면 noindex 메타태그를 읽지 못해
 * 이미 색인된 페이지가 계속 남으므로, 크롤링은 허용하고 noindex로 처리한다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
