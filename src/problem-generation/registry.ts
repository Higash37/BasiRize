import {
  ArithmeticGenerator,
  ExactDivisionGenerator,
  RemainderDivisionGenerator,
  type ArithmeticSetting,
} from "./arithmetic";
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

const random: RandomSource = Math.random;

const grade1AddSubtract: ArithmeticSetting = {
  min: 1,
  max: 9,
  minTerms: 2,
  maxTerms: 2,
  operators: [Operator.ADD, Operator.SUBTRACT],
  allowNegative: false,
  maxAnswer: 18,
};

const grade2AddSubtract: ArithmeticSetting = {
  min: 10,
  max: 99,
  minTerms: 2,
  maxTerms: 2,
  operators: [Operator.ADD, Operator.SUBTRACT],
  allowNegative: false,
  maxAnswer: 200,
};

const grade2MultiplicationTable: ArithmeticSetting = {
  min: 1,
  max: 9,
  minTerms: 2,
  maxTerms: 2,
  operators: [Operator.MULTIPLY],
  allowNegative: false,
  maxAnswer: 81,
};

const grade3Multiplication: ArithmeticSetting = {
  min: 1,
  max: 20,
  minTerms: 2,
  maxTerms: 2,
  operators: [Operator.MULTIPLY],
  allowNegative: false,
  maxAnswer: 400,
};

const grade4Mixed: ArithmeticSetting = {
  min: 1,
  max: 20,
  minTerms: 3,
  maxTerms: 4,
  operators: [
    Operator.ADD,
    Operator.SUBTRACT,
    Operator.MULTIPLY,
    Operator.DIVIDE,
  ],
  allowNegative: false,
  maxAnswer: 1_000,
};

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
  createProblemType(
    "e1-add-sub",
    "小学校",
    "小1",
    "たし算・ひき算（1桁）",
    new ArithmeticGenerator(random, grade1AddSubtract),
  ),
  createProblemType(
    "e2-add-sub-carry",
    "小学校",
    "小2",
    "たし算・ひき算（2桁）",
    new ArithmeticGenerator(random, grade2AddSubtract),
  ),
  createProblemType(
    "e2-multiplication-table",
    "小学校",
    "小2",
    "かけ算九九",
    new ArithmeticGenerator(random, grade2MultiplicationTable),
  ),
  createProblemType(
    "e3-multiplication",
    "小学校",
    "小3",
    "かけ算",
    new ArithmeticGenerator(random, grade3Multiplication),
  ),
  createProblemType(
    "e3-exact-division",
    "小学校",
    "小3",
    "わり算（九九の逆）",
    new ExactDivisionGenerator(random, 9, 9),
  ),
  createProblemType(
    "e3-remainder-division",
    "小学校",
    "小3",
    "あまりのあるわり算",
    new RemainderDivisionGenerator(random, 9, 9),
  ),
  createProblemType(
    "e4-mixed",
    "小学校",
    "小4",
    "四則混合（かっこあり）",
    new ArithmeticGenerator(random, grade4Mixed),
  ),
  createProblemType(
    "e4-fraction-same-denominator",
    "小学校",
    "小4",
    "同分母の分数の加減",
    new FractionGenerator(random, 10, [Operator.ADD, Operator.SUBTRACT], true),
  ),
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
];

export function getProblemTypes(level?: string): ProblemTypeSummary[] {
  return problemTypes
    .filter((type) => level === undefined || type.level === level)
    .map(toSummary);
}

export function getProblemTypeById(id: string): ProblemTypeSummary | undefined {
  const type = problemTypes.find((candidate) => candidate.id === id);
  return type === undefined ? undefined : toSummary(type);
}

export function generateProblems(typeId: string, count: number): Problem[] {
  if (!Number.isInteger(count) || count < 1 || count > 200) {
    throw new Error("問題数は1〜200の整数で指定してください");
  }

  const type = problemTypes.find((candidate) => candidate.id === typeId);
  if (type === undefined) {
    throw new Error(`そのような問題タイプはありません: ${typeId}`);
  }
  return type.generator.generate(count);
}

function createProblemType(
  id: string,
  level: ProblemType["level"],
  grade: string,
  title: string,
  generator: ProblemType["generator"],
): ProblemType {
  return { id, level, grade, title, generator };
}

function toSummary(type: ProblemType): ProblemTypeSummary {
  return {
    id: type.id,
    level: type.level,
    grade: type.grade,
    title: type.title,
  };
}
