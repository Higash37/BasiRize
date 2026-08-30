import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class QuadraticFunctionGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const a = this.randomNonZero(-6, 6);
    const x = this.randomNumber(-10, 10);
    return {
      question: `y = ${a}x² で、x = ${x}のときのyを求めましょう。`,
      answer: String(a * x * x),
    };
  }
}
export const juniorQuadraticFunction: ProblemType = {
  id: "j3-quadratic-function",
  level: "中学校",
  grade: "中3",
  title: "関数 y=ax²",
  description: "二次関数にxの値を代入してyを求める中学3年生向けプリントです。",
  generator: new QuadraticFunctionGenerator(),
};
