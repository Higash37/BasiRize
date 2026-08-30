import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class ProportionGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const coefficient = this.randomNonZero(-9, 9);
    const x = this.randomNumber(-12, 12);
    return {
      question: `y = ${coefficient}x で、x = ${x}のときのyを求めましょう。`,
      answer: String(coefficient * x),
    };
  }
}
export const juniorProportion: ProblemType = {
  id: "j1-proportion",
  level: "中学校",
  grade: "中1",
  title: "比例",
  description: "比例の式にxの値を代入してyを求める中学1年生向けプリントです。",
  generator: new ProportionGenerator(),
};
