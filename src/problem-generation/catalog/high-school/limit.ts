import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class LimitGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const a = this.randomNonZero(-9, 9);
    const b = this.randomNumber(-12, 12);
    const target = this.randomNumber(-10, 10);
    return {
      question: `lim[x→${target}] (${a}x + ${b}) を求めましょう。`,
      answer: String(a * target + b),
    };
  }
}
export const highLimit: ProblemType = {
  id: "h3-limit",
  level: "高校",
  grade: "高3",
  title: "極限",
  description:
    "多項式の基本的な極限を代入によって求める高校3年生向けプリントです。",
  generator: new LimitGenerator(),
};
