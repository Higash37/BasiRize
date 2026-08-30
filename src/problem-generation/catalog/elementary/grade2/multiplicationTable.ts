import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade2MultiplicationTableGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const left = this.randomNumber(1, 9);
    const right = this.randomNumber(1, 9);
    return {
      question: `${left} × ${right} = `,
      answer: String(left * right),
    };
  }
}

export const grade2MultiplicationTable: ProblemType = {
  id: "e2-multiplication-table",
  level: "小学校",
  grade: "小2",
  title: "かけ算九九",
  description:
    "1の段から9の段までのかけ算九九をランダムに練習できる、小学2年生向けプリントです。",
  generator: new Grade2MultiplicationTableGenerator(),
};
