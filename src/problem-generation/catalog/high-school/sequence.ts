import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class SequenceGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const first = this.randomNumber(-20, 20);
    const difference = this.randomNonZero(-10, 10);
    const n = this.randomNumber(5, 30);
    return {
      question: `初項${first}、公差${difference}の等差数列の第${n}項を求めましょう。`,
      answer: String(first + (n - 1) * difference),
    };
  }
}
export const highSequence: ProblemType = {
  id: "h2-arithmetic-sequence",
  level: "高校",
  grade: "高2",
  title: "等差数列",
  description: "初項と公差から一般項の値を求める高校2年生向けプリントです。",
  generator: new SequenceGenerator(),
};
