import { ArithmeticGenerator, type ArithmeticSetting } from "./arithmetic";
import {
  ExpansionGenerator,
  FactoringGenerator,
  LikeTermsGenerator,
  LinearEquationGenerator,
  QuadraticEquationGenerator,
  SimultaneousEquationGenerator,
  SquareRootGenerator,
} from "./algebra";
import { FractionGenerator } from "./fraction";
import type { RandomSource } from "./generator";
import { Operator } from "./operator";
import type { Problem, ProblemType, ProblemTypeSummary } from "./types";
import {
  grade1ProblemTypes,
  legacyGrade1ProblemTypes,
} from "./catalog/elementary/grade1";
import {
  grade2ProblemTypes,
  legacyGrade2ProblemTypes,
} from "./catalog/elementary/grade2";
import { grade3ProblemTypes } from "./catalog/elementary/grade3";
import { grade4ProblemTypes } from "./catalog/elementary/grade4";
import { grade5AdditionalProblemTypes } from "./catalog/elementary/grade5";
import { grade6AdditionalProblemTypes } from "./catalog/elementary/grade6";
import { entranceExamProblemTypes } from "./catalog/elementary/entrance-exam";
import { juniorHighAdditionalProblemTypes } from "./catalog/junior-high";
import { highSchoolAdditionalProblemTypes } from "./catalog/high-school";

const random: RandomSource = Math.random;

const grade5Mixed: ArithmeticSetting = {
  min: 1,
  max: 50,
  minTerms: 3,
  maxTerms: 4,
  operators: [
    Operator.ADD,
    Operator.SUBTRACT,
    Operator.MULTIPLY,
    Operator.DIVIDE,
  ],
  allowNegative: false,
  maxAnswer: 5_000,
};

const grade6Mixed: ArithmeticSetting = {
  min: 1,
  max: 100,
  minTerms: 3,
  maxTerms: 5,
  operators: [
    Operator.ADD,
    Operator.SUBTRACT,
    Operator.MULTIPLY,
    Operator.DIVIDE,
  ],
  allowNegative: false,
  maxAnswer: 10_000,
};

const juniorHigh1SignedNumbers: ArithmeticSetting = {
  min: -20,
  max: 20,
  minTerms: 2,
  maxTerms: 2,
  operators: [Operator.ADD, Operator.SUBTRACT, Operator.MULTIPLY],
  allowNegative: true,
  maxAnswer: 400,
};

const problemTypes: readonly ProblemType[] = [
  ...grade1ProblemTypes,
  ...grade2ProblemTypes,
  ...grade3ProblemTypes,
  ...grade4ProblemTypes,
  createProblemType(
    "e5-mixed-advanced",
    "小学校",
    "小5",
    "四則混合（発展）",
    new ArithmeticGenerator(random, grade5Mixed),
  ),
  createProblemType(
    "e5-fraction-different-denominator",
    "小学校",
    "小5",
    "異分母の分数の加減",
    new FractionGenerator(random, 12, [Operator.ADD, Operator.SUBTRACT], false),
  ),
  ...grade5AdditionalProblemTypes,
  createProblemType(
    "e6-mixed-final",
    "小学校",
    "小6",
    "四則混合（総まとめ）",
    new ArithmeticGenerator(random, grade6Mixed),
  ),
  createProblemType(
    "e6-fraction-multiply-divide",
    "小学校",
    "小6",
    "分数のかけ算・わり算",
    new FractionGenerator(
      random,
      10,
      [Operator.MULTIPLY, Operator.DIVIDE],
      false,
    ),
  ),
  ...grade6AdditionalProblemTypes,
  ...entranceExamProblemTypes,
  createProblemType(
    "j1-signed-numbers",
    "中学校",
    "中1",
    "正負の数の計算",
    new ArithmeticGenerator(random, juniorHigh1SignedNumbers),
  ),
  createProblemType(
    "j1-like-terms",
    "中学校",
    "中1",
    "文字式（同類項をまとめる）",
    new LikeTermsGenerator(random, 9),
  ),
  createProblemType(
    "j1-linear-equation",
    "中学校",
    "中1",
    "一次方程式",
    new LinearEquationGenerator(random, 10, 9),
  ),
  createProblemType(
    "j2-simultaneous-equations",
    "中学校",
    "中2",
    "連立方程式",
    new SimultaneousEquationGenerator(random, 9, 5),
  ),
  createProblemType(
    "j3-expansion",
    "中学校",
    "中3",
    "式の展開",
    new ExpansionGenerator(random, 9),
  ),
  createProblemType(
    "j3-factoring",
    "中学校",
    "中3",
    "因数分解",
    new FactoringGenerator(random, 9),
  ),
  createProblemType(
    "j3-quadratic-equation",
    "中学校",
    "中3",
    "二次方程式",
    new QuadraticEquationGenerator(random, 9),
  ),
  createProblemType(
    "j3-square-root",
    "中学校",
    "中3",
    "平方根の計算",
    new SquareRootGenerator(random, 9),
  ),
  ...juniorHighAdditionalProblemTypes,
  createProblemType(
    "h1-factoring-advanced",
    "高校",
    "高1",
    "因数分解（発展）",
    new FactoringGenerator(random, 15),
  ),
  createProblemType(
    "h1-quadratic-equation-advanced",
    "高校",
    "高1",
    "二次方程式（発展）",
    new QuadraticEquationGenerator(random, 15),
  ),
  ...highSchoolAdditionalProblemTypes,
];

const allProblemTypes: readonly ProblemType[] = [
  ...problemTypes,
  ...legacyGrade1ProblemTypes,
  ...legacyGrade2ProblemTypes,
];

export function getProblemTypes(level?: string): ProblemTypeSummary[] {
  return problemTypes
    .filter((type) => level === undefined || type.level === level)
    .map(toSummary);
}

export function getProblemTypeById(id: string): ProblemTypeSummary | undefined {
  const type = allProblemTypes.find((candidate) => candidate.id === id);
  return type === undefined ? undefined : toSummary(type);
}

export function generateProblems(typeId: string, count: number): Problem[] {
  if (!Number.isInteger(count) || count < 1 || count > 200) {
    throw new Error("問題数は1〜200の整数で指定してください");
  }

  const type = allProblemTypes.find((candidate) => candidate.id === typeId);
  if (type === undefined) {
    throw new Error(`そのような問題タイプはありません: ${typeId}`);
  }
  const problems = type.generator.generate(count);
  return isLowerElementary(type)
    ? problems.map((problem) => ({
        ...problem,
        question: toFriendlyElementaryText(problem.question),
      }))
    : problems;
}

function createProblemType(
  id: string,
  level: ProblemType["level"],
  grade: string,
  title: string,
  generator: ProblemType["generator"],
): ProblemType {
  return {
    id,
    level,
    grade,
    title,
    description: `${grade}で学ぶ「${title}」の問題をランダムに生成します。`,
    recommendedQuestionsPerPage: 10,
    generator,
  };
}

function toSummary(type: ProblemType): ProblemTypeSummary {
  return {
    id: type.id,
    level: type.level,
    grade: type.grade,
    title: type.title,
    description: type.description,
    recommendedQuestionsPerPage: getRecommendedQuestionsPerPage(type),
  };
}

const compactWorksheetIds = new Set([
  "e1-time-reading",
  "e2-shapes",
  "e2-bar-graph",
  "e3-circle",
  "e3-bar-graph",
  "e4-angles",
  "e4-area",
  "e4-line-graph",
  "e4-cuboid",
  "e5-circumference",
  "e6-circle-area",
  "e6-symmetry",
  "e6-proportion-graph",
  "exam-sum-difference",
  "exam-planting-trees",
  "exam-age",
  "exam-clock",
]);

function getRecommendedQuestionsPerPage(type: ProblemType): number {
  return compactWorksheetIds.has(type.id) ? 6 : 10;
}

function isLowerElementary(type: ProblemType): boolean {
  return type.level === "小学校" && /^小[1-4]$/.test(type.grade);
}

const elementaryReplacements: readonly [string, string][] = [
  ["何時何分", "なんじなんぷん"],
  ["何時間", "なんじかん"],
  ["求めましょう", "もとめましょう"],
  ["答えましょう", "こたえましょう"],
  ["読み取り", "よみとり"],
  ["長方形", "ちょうほうけい"],
  ["正方形", "せいほうけい"],
  ["直方体", "ちょくほうたい"],
  ["三角形", "さんかくけい"],
  ["四角形", "しかくけい"],
  ["折れ線", "おれせん"],
  ["棒グラフ", "ぼうグラフ"],
  ["面積", "めんせき"],
  ["体積", "たいせき"],
  ["大きさ", "おおきさ"],
  ["名前", "なまえ"],
  ["時計", "とけい"],
  ["時間", "じかん"],
  ["時刻", "じこく"],
  ["長さ", "ながさ"],
  ["重さ", "おもさ"],
  ["全部", "ぜんぶ"],
  ["同じ", "おなじ"],
  ["何分", "なんぷん"],
  ["何本", "なんぼん"],
  ["何個", "なんこ"],
  ["何", "なん"],
  ["図", "ず"],
  ["円", "えん"],
  ["角", "かく"],
  ["辺", "へん"],
  ["数", "かず"],
  ["和", "わ"],
  ["差", "さ"],
];

function toFriendlyElementaryText(text: string): string {
  return elementaryReplacements.reduce(
    (result, [kanji, reading]) => result.replaceAll(kanji, reading),
    text,
  );
}
