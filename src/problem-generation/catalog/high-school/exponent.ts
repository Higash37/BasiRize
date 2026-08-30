import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class ExponentGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const base = this.randomNumber(2, 9);
    const left = this.randomNumber(1, 8);
    const right = this.randomNumber(1, 8);
    return {
      question: `${base}^${left} × ${base}^${right} を1つの累乗で表しましょう。`,
      answer: `${base}^${left + right}`,
    };
  }
}
export const highExponent: ProblemType = {
  id: "h2-exponent",
  level: "高校",
  grade: "高2",
  title: "指数法則",
  description:
    "同じ底の累乗の積を指数法則で整理する高校2年生向けプリントです。",
  generator: new ExponentGenerator(),
};
