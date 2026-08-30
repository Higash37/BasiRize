import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade3MultiplicationGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const left = this.randomNumber(10, 99);
    const right = this.randomNumber(2, 9);
    return { question: `${left} × ${right} = `, answer: String(left * right) };
  }
}

export const grade3Multiplication: ProblemType = {
  id: "e3-multiplication",
  level: "小学校",
  grade: "小3",
  title: "2桁×1桁のかけ算",
  description:
    "2桁の数に1桁の数をかける筆算の基礎を練習する、小学3年生向けプリントです。",
  generator: new Grade3MultiplicationGenerator(),
};
