import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class DefiniteIntegralGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const power = this.randomNumber(1, 5);
    const resultCoefficient = this.randomNumber(1, 8);
    const coefficient = resultCoefficient * (power + 1);
    const upper = this.randomNumber(1, 6);
    return {
      question: `∫[0→${upper}] ${coefficient}x^${power} dx を求めましょう。`,
      answer: String(resultCoefficient * upper ** (power + 1)),
    };
  }
}
export const highDefiniteIntegral: ProblemType = {
  id: "h3-definite-integral",
  level: "高校",
  grade: "高3",
  title: "定積分",
  description:
    "べき関数を積分して区間の定積分を求める高校3年生向けプリントです。",
  generator: new DefiniteIntegralGenerator(),
};
