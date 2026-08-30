import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class IntegrationGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const exponent = this.randomNumber(1, 7);
    const resultCoefficient = this.randomNonZero(-9, 9);
    const coefficient = resultCoefficient * (exponent + 1);
    return {
      question: `∫ ${coefficient}x^${exponent} dx を求めましょう。`,
      answer: `${resultCoefficient}x^${exponent + 1} + C`,
    };
  }
}
export const highIntegration: ProblemType = {
  id: "h2-integration",
  level: "高校",
  grade: "高2",
  title: "不定積分",
  description: "べき関数の不定積分を求める高校2年生向けプリントです。",
  generator: new IntegrationGenerator(),
};
