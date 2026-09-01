import type { Level } from "./problem-generation";

const LEVEL_SLUGS: Record<Level, string> = {
  小学校: "elementary",
  中学校: "junior-high",
  高校: "high-school",
};

type LevelSeoContent = {
  title: string;
  description: string;
  heading: string;
  introduction: string;
};

type GradeRoute = {
  level: Level;
  grade: string;
  slug: string;
  displayName: string;
};

type GradeSeoContent = {
  title: string;
  description: string;
  heading: string;
  introduction: string;
};

// URLに日本語の学年名を直接入れず、短く安定した英字slugへ対応付ける。
// 新しい学年を台帳へ追加した場合は、SEOページも明示的に設計するためここへ追加する。
export const SEO_GRADES: readonly GradeRoute[] = [
  { level: "小学校", grade: "小1", slug: "grade-1", displayName: "小学1年生" },
  { level: "小学校", grade: "小2", slug: "grade-2", displayName: "小学2年生" },
  { level: "小学校", grade: "小3", slug: "grade-3", displayName: "小学3年生" },
  { level: "小学校", grade: "小4", slug: "grade-4", displayName: "小学4年生" },
  { level: "小学校", grade: "小5", slug: "grade-5", displayName: "小学5年生" },
  { level: "小学校", grade: "小6", slug: "grade-6", displayName: "小学6年生" },
  {
    level: "小学校",
    grade: "中学受験",
    slug: "entrance-exam",
    displayName: "中学受験",
  },
  { level: "中学校", grade: "中1", slug: "grade-1", displayName: "中学1年生" },
  { level: "中学校", grade: "中2", slug: "grade-2", displayName: "中学2年生" },
  { level: "中学校", grade: "中3", slug: "grade-3", displayName: "中学3年生" },
  { level: "高校", grade: "高1", slug: "grade-1", displayName: "高校1年生" },
  { level: "高校", grade: "高2", slug: "grade-2", displayName: "高校2年生" },
  { level: "高校", grade: "高3", slug: "grade-3", displayName: "高校3年生" },
];

// 学校区分ページで使う検索向けの文言を1か所に集約する。
// Reactの画面とビルド時のプリレンダリングが同じ内容を参照することで、
// 見出し・description・静的HTMLの食い違いを防ぐ。
const LEVEL_SEO_CONTENT: Record<Level, LevelSeoContent> = {
  小学校: {
    title: "小学生の算数問題プリントを無料作成【小1〜小6】| math²ドリル",
    description:
      "小学1年生から6年生までの算数問題プリントを単元別に無料作成。家庭学習や個別指導の教材作成にも。たし算、ひき算、かけ算、わり算、分数、小数、図形などを選び、解答付きで印刷できます。",
    heading: "小学生の算数問題プリント",
    introduction:
      "小学1年生から6年生までの算数を、学年・単元別に選べます。必要なプリントを選ぶと、毎回ちがう問題を解答付きで無料作成できます。",
  },
  中学校: {
    title: "中学生の数学問題プリントを無料作成【中1〜中3】| math²ドリル",
    description:
      "中学1年生から3年生までの数学問題プリントを単元別に無料作成。塾講師・個別指導の教材作成にも。正負の数、方程式、関数、図形、確率などを選び、解答付きで印刷できます。",
    heading: "中学生の数学問題プリント",
    introduction:
      "中学1年生から3年生までの数学を、学年・単元別に選べます。授業、宿題、定期テスト対策に使える問題を解答付きで無料作成できます。",
  },
  高校: {
    title: "高校生の数学問題プリントを無料作成 | math²ドリル",
    description:
      "高校数学の基礎問題プリントを単元別に無料作成。塾講師・家庭教師の教材作成にも。二次関数、三角比、場合の数、数列、微分・積分、ベクトルなどを選び、解答付きで印刷できます。",
    heading: "高校生の数学問題プリント",
    introduction:
      "高校数学の基礎問題を、学年・単元別に選べます。反復練習や授業の確認に使える問題を解答付きで無料作成できます。",
  },
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

export function getLevelSeoContent(level: Level): LevelSeoContent {
  return LEVEL_SEO_CONTENT[level];
}

export function getGradePath(level: Level, grade: string): string {
  const route = SEO_GRADES.find(
    (candidate) => candidate.level === level && candidate.grade === grade,
  );
  if (!route) {
    throw new Error(`SEO用の学年URLが未定義です: ${level}/${grade}`);
  }
  return `${getLevelPath(level)}/${route.slug}`;
}

export function getGradeFromSlug(
  level: Level,
  slug: string | undefined,
): string | undefined {
  return SEO_GRADES.find(
    (candidate) => candidate.level === level && candidate.slug === slug,
  )?.grade;
}

export function getGradeSeoContent(
  level: Level,
  grade: string,
  unitTitles: string[],
): GradeSeoContent {
  const route = SEO_GRADES.find(
    (candidate) => candidate.level === level && candidate.grade === grade,
  );
  if (!route) {
    throw new Error(`SEO用の学年情報が未定義です: ${level}/${grade}`);
  }

  const subject = level === "小学校" ? "算数" : "数学";
  const unitExamples = unitTitles.slice(0, 5).join("、");
  return {
    title: `${route.displayName}の${subject}問題プリントを無料作成 | math²ドリル`,
    description: `${route.displayName}で学ぶ${subject}の問題プリントを単元別に無料作成。${unitExamples}などの問題を毎回新しく生成し、解答付きで印刷・PDF保存できます。`,
    heading: `${route.displayName}の${subject}問題プリント`,
    introduction: `${route.displayName}で学ぶ${subject}の問題を単元別に選べます。反復練習、授業、宿題に使うプリントを解答付きで無料作成できます。`,
  };
}

export const SEO_LEVELS = Object.keys(LEVEL_SLUGS) as Level[];
