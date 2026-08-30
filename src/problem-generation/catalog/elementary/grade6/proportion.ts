import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade6ProportionGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const leftUnit = this.randomNumber(2, 15);
    const rightUnit = this.randomNumber(2, 15);
    const scale = this.randomNumber(2, 12);
    return {
      question: `□ : ${rightUnit * scale} = ${leftUnit} : ${rightUnit} の□を求めましょう。`,
      answer: String(leftUnit * scale),
    };
  }
}

export const grade6Proportion: ProblemType = {
  id: "e6-proportion",
  level: "小学校",
  grade: "小6",
  title: "比例式",
  description:
    "等しい比の性質を使って比例式の未知数を求める、小学6年生向けプリントです。",
  generator: new Grade6ProportionGenerator(),
};
