import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class ConcentrationGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const total = this.randomNumber(1, 10) * 100;
    const concentration = this.randomNumber(1, 8) * 2;
    const salt = (total * concentration) / 100;

    return {
      question: `${total}gの${concentration}%の食塩水に、食塩は何g含まれていますか。`,
      answer: `${salt}g`,
    };
  }
}

export const entranceConcentration: ProblemType = {
  id: "exam-concentration",
  level: "小学校",
  grade: "中学受験",
  title: "濃度算",
  description:
    "食塩水全体の重さと濃度から食塩の重さを求める、中学受験向け濃度算プリントです。",
  generator: new ConcentrationGenerator(),
};
