import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade2SubtractionGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const minuendOnes = this.randomNumber(0, 8);
    const subtrahendOnes = this.randomNumber(minuendOnes + 1, 9);
    const minuendTens = this.randomNumber(2, 9);
    const subtrahendTens = this.randomNumber(1, minuendTens - 1);
    const minuend = minuendTens * 10 + minuendOnes;
    const subtrahend = subtrahendTens * 10 + subtrahendOnes;
    return {
      question: `${minuend} - ${subtrahend} = `,
      answer: String(minuend - subtrahend),
    };
  }
}

export const grade2Subtraction: ProblemType = {
  id: "e2-subtraction",
  level: "小学校",
  grade: "小2",
  title: "2桁のひき算",
  description:
    "繰り下がりを含む2桁どうしのひき算をランダム生成する、小学2年生向けプリントです。",
  generator: new Grade2SubtractionGenerator(),
};
