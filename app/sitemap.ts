import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { draws, latestDraw } from "@/lib/draws";
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
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${SITE_URL}/guide/${g.slug}`,
    lastModified: new Date(g.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const drawPages: MetadataRoute.Sitemap = draws.map((d) => ({
    url: `${SITE_URL}/numbers/${d.round}`,
    lastModified: new Date(d.date),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticPages, ...guidePages, ...drawPages];
}
