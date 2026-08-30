import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class InequalityGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const a = this.randomNumber(2, 12);
    const boundary = this.randomNumber(-12, 12);
    const b = this.randomNumber(-20, 20);
    const c = a * boundary + b;
    return {
      question: `${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)} < ${c} を解きましょう。`,
      answer: `x < ${boundary}`,
    };
  }
}
export const highInequality: ProblemType = {
  id: "h1-inequality",
  level: "高校",
  grade: "高1",
  title: "一次不等式",
  description:
    "一次不等式を変形して解の範囲を求める高校1年生向けプリントです。",
  generator: new InequalityGenerator(),
};
