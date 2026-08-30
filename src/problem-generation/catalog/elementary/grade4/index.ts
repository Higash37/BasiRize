import { ArithmeticGenerator } from "../../../arithmetic";
import { FractionGenerator } from "../../../fraction";
import { Operator } from "../../../operator";
import type { ProblemType } from "../../../types";
import { grade4Angles } from "./angles";
import { grade4Area } from "./area";
import { grade4Cuboid } from "./cuboid";
import { grade4Decimals } from "./decimals";
import { grade4Division } from "./division";
import { grade4LargeNumbers } from "./largeNumbers";
import { grade4LineGraph } from "./lineGraph";

const grade4Mixed: ProblemType = {
  id: "e4-mixed",
  level: "小学校",
  grade: "小4",
  title: "四則混合（かっこあり）",
  description:
    "たし算・ひき算・かけ算・わり算を組み合わせた小学4年生向け計算プリントです。",
  generator: new ArithmeticGenerator(Math.random, {
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
  }),
};

const grade4Fractions: ProblemType = {
  id: "e4-fraction-same-denominator",
  level: "小学校",
  grade: "小4",
  title: "同分母の分数の加減",
  description:
    "分母が同じ分数のたし算・ひき算を練習する、小学4年生向けプリントです。",
  generator: new FractionGenerator(
    Math.random,
    10,
    [Operator.ADD, Operator.SUBTRACT],
    true,
  ),
};

export const grade4ProblemTypes: readonly ProblemType[] = [
  grade4LargeNumbers,
  grade4Division,
  grade4Decimals,
  grade4Mixed,
  grade4Fractions,
  grade4Angles,
  grade4Area,
  grade4LineGraph,
  grade4Cuboid,
];
