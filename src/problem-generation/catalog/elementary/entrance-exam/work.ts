import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class WorkCalculationGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const firstRate = this.randomNumber(2, 8);
    const secondRate = this.randomNumber(2, 8);
    const days = this.randomNumber(2, 10);
    const total = (firstRate + secondRate) * days;

    return {
      question: `Aさんは1日に${firstRate}個、Bさんは1日に${secondRate}個作ります。2人で${total}個作るには何日かかりますか。`,
      answer: `${days}日`,
      diagram: {
        kind: "tape",
        upperRatio: firstRate,
        lowerRatio: secondRate,
        upperLabel: "A",
        lowerLabel: "B",
        totalLabel: `${total}個`,
      },
    };
  }
}

export const entranceWork: ProblemType = {
  id: "exam-work",
  level: "小学校",
  grade: "中学受験",
  title: "仕事算",
  description:
    "1日あたりの仕事量を合わせ、全体を終える日数を求める中学受験向け仕事算プリントです。",
  generator: new WorkCalculationGenerator(),
};
