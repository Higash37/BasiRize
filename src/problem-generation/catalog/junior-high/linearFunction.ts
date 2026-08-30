import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class LinearFunctionGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const slope = this.randomNonZero(-9, 9);
    const intercept = this.randomNumber(-12, 12);
    const x1 = this.randomNumber(-5, 5);
    const x2 = x1 + this.randomNumber(1, 6);
    const y1 = slope * x1 + intercept;
    const y2 = slope * x2 + intercept;
    return {
      question: `点(${x1}, ${y1})と点(${x2}, ${y2})を通る直線の傾きを求めましょう。`,
      answer: String(slope),
    };
  }
}
export const juniorLinearFunction: ProblemType = {
  id: "j2-linear-function",
  level: "中学校",
  grade: "中2",
  title: "一次関数の傾き",
  description: "2点の座標から一次関数の傾きを求める中学2年生向けプリントです。",
  generator: new LinearFunctionGenerator(),
};
