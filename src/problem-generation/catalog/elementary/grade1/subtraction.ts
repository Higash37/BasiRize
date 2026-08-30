import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade1SubtractionGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const minuend = this.randomNumber(1, 18);
    const subtrahend = this.randomNumber(0, Math.min(9, minuend));

    return {
      question: `${minuend} - ${subtrahend} = `,
      answer: String(minuend - subtrahend),
    };
  }
}

export const grade1Subtraction: ProblemType = {
  id: "e1-subtraction",
  level: "小学校",
  grade: "小1",
  title: "ひき算（1桁）",
  description:
    "小学1年生向けの答えが0以上になるひき算プリントです。問題数を選んで印刷できます。",
  generator: new Grade1SubtractionGenerator(),
};
