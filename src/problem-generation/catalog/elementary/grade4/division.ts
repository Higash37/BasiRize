import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade4DivisionGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const divisor = this.randomNumber(10, 99);
    const quotient = this.randomNumber(2, 99);
    const dividend = divisor * quotient;
    return {
      question: `${dividend} ÷ ${divisor} = `,
      answer: String(quotient),
    };
  }
}

export const grade4Division: ProblemType = {
  id: "e4-division",
  level: "小学校",
  grade: "小4",
  title: "2桁でわるわり算",
  description:
    "2桁の数でわる、あまりのないわり算を練習する小学4年生向けプリントです。",
  generator: new Grade4DivisionGenerator(),
};
