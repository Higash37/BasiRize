import type { Level } from "./problem-generation";

const LEVEL_SLUGS: Record<Level, string> = {
  小学校: "elementary",
  中学校: "junior-high",
  高校: "high-school",
};

export function getLevelPath(level: Level): string {
  return `/math/${LEVEL_SLUGS[level]}`;
}

export function getLevelFromSlug(slug: string | undefined): Level | undefined {
  if (!slug) {
    return undefined;
  }

  return (Object.entries(LEVEL_SLUGS) as [Level, string][]).find(
    ([, levelSlug]) => levelSlug === slug,
  )?.[0];
}

export const SEO_LEVELS = Object.keys(LEVEL_SLUGS) as Level[];
