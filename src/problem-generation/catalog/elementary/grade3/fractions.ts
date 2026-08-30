import { FractionGenerator } from "../../../fraction";
import { Operator } from "../../../operator";
import type { ProblemType } from "../../../types";

export const grade3Fractions: ProblemType = {
  id: "e3-fractions",
  level: "小学校",
  grade: "小3",
  title: "同じ分母の分数の計算",
  description:
    "分母が同じ簡単な分数のたし算・ひき算を練習する、小学3年生向けプリントです。",
  generator: new FractionGenerator(
    Math.random,
    10,
    [Operator.ADD, Operator.SUBTRACT],
    true,
  ),
};
