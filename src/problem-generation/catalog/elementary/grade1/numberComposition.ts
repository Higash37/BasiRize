import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade1NumberCompositionGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const tens = this.randomNumber(1, 9);
    const ones = this.randomNumber(0, 9);

    return {
      question: `10が${tens}こと、1が${ones}こで、いくつですか。`,
      answer: String(tens * 10 + ones),
    };
  }
}

export const grade1NumberComposition: ProblemType = {
  id: "e1-number-composition",
  level: "小学校",
  grade: "小1",
  title: "数の構成",
  description:
    "10のまとまりと1の個数から数を答える、小学1年生向けの数の構成プリントです。",
  generator: new Grade1NumberCompositionGenerator(),
};
