import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class TangentSlopeGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const a = this.randomNonZero(-8, 8),
      b = this.randomNumber(-10, 10),
      x = this.randomNumber(-8, 8);
    return {
      question: `f(x)=${a}x²+${b}x の、x=${x}における接線の傾きを求めましょう。`,
      answer: String(2 * a * x + b),
    };
  }
}
export const highTangentSlope: ProblemType = {
  id: "h3-tangent-slope",
  level: "高校",
  grade: "高3",
  title: "接線の傾き",
  description:
    "導関数へ値を代入して接線の傾きを求める高校3年生向けプリントです。",
  generator: new TangentSlopeGenerator(),
};
