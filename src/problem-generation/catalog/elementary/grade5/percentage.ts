import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade5PercentageGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const base = this.randomNumber(2, 40) * 50;
    const percentage = this.randomNumber(1, 20) * 5;
    const compared = (base * percentage) / 100;
    return {
      question: `${base}の${percentage}%はいくつですか。`,
      answer: String(compared),
    };
  }
}

export const grade5Percentage: ProblemType = {
  id: "e5-percentage",
  level: "小学校",
  grade: "小5",
  title: "割合と百分率",
  description:
    "もとにする量と百分率から比べる量を求める、小学5年生向け割合プリントです。",
  generator: new Grade5PercentageGenerator(),
};
