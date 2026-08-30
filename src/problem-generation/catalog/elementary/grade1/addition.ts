import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade1AdditionGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const left = this.randomNumber(0, 9);
    const right = this.randomNumber(0, 9);

    return {
      question: `${left} + ${right} = `,
      answer: String(left + right),
    };
  }
}

export const grade1Addition: ProblemType = {
  id: "e1-addition",
  level: "小学校",
  grade: "小1",
  title: "たし算（1桁）",
  description:
    "小学1年生向けの1桁のたし算プリントです。毎回異なる問題を無料で作成し、印刷できます。",
  generator: new Grade1AdditionGenerator(),
};
