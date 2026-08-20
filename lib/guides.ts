import type { Guide } from "./guide-types";
import { guides1 } from "./guides-1";
import { guides2 } from "./guides-2";
import { guides3 } from "./guides-3";
import { guides4 } from "./guides-4";
import { guides5 } from "./guides-5";
import { guides6 } from "./guides-6";
import { guides7 } from "./guides-7";

export type { Guide, GuideSection } from "./guide-types";

export const guides: Guide[] = [...guides1, ...guides2, ...guides3, ...guides4, ...guides5, ...guides6, ...guides7];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
