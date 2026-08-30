import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class DifferentiationGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const coefficient = this.randomNonZero(-12, 12);
    const exponent = this.randomNumber(2, 8);
    return {
      question: `f(x) = ${coefficient}x^${exponent} を微分しましょう。`,
      answer: `f'(x) = ${coefficient * exponent}x^${exponent - 1}`,
    };
  }
}
export const highDifferentiation: ProblemType = {
  id: "h2-differentiation",
  level: "高校",
  grade: "高2",
  title: "微分法",
  description: "べき関数を微分して導関数を求める高校2年生向けプリントです。",
  generator: new DifferentiationGenerator(),
};
