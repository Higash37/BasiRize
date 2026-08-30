import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class ProfitLossGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const cost = this.randomNumber(5, 50) * 100;
    const markupRate = this.randomNumber(1, 5) * 10;
    const listPrice = cost * (1 + markupRate / 100);

    return {
      question: `原価${cost}円の商品に、原価の${markupRate}%の利益を見込んで定価をつけました。定価はいくらですか。`,
      answer: `${listPrice}円`,
    };
  }
}

export const entranceProfitLoss: ProblemType = {
  id: "exam-profit-loss",
  level: "小学校",
  grade: "中学受験",
  title: "損益算",
  description:
    "原価・定価・売価・利益の関係を割合で考える、中学受験向け損益算プリントです。",
  generator: new ProfitLossGenerator(),
};
