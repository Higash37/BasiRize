import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade2AdditionGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const leftOnes = this.randomNumber(1, 9);
    const rightOnes = this.randomNumber(10 - leftOnes, 9);
    const left = this.randomNumber(1, 8) * 10 + leftOnes;
    const right = this.randomNumber(1, 9) * 10 + rightOnes;
    return {
      question: `${left} + ${right} = `,
      answer: String(left + right),
    };
  }
}

export const grade2Addition: ProblemType = {
  id: "e2-addition",
  level: "小学校",
  grade: "小2",
  title: "2桁のたし算",
  description:
    "繰り上がりを含む2桁どうしのたし算をランダム生成する、小学2年生向けプリントです。",
  generator: new Grade2AdditionGenerator(),
};
