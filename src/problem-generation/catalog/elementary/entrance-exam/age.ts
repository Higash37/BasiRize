import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class AgeCalculationGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const child = this.randomNumber(6, 15);
    const yearsLater = this.randomNumber(3, 15);
    const ratio = this.randomNumber(2, 3);
    const parent = ratio * (child + yearsLater) - yearsLater;

    return {
      question: `今、親は${parent}歳、子は${child}歳です。親の年齢が子の年齢の${ratio}倍になるのは何年後ですか。`,
      answer: `${yearsLater}年後`,
      diagram: {
        kind: "tape",
        upperRatio: parent,
        lowerRatio: child,
        upperLabel: "親",
        lowerLabel: "子",
        differenceLabel: `${parent - child}歳`,
      },
    };
  }
}

export const entranceAge: ProblemType = {
  id: "exam-age",
  level: "小学校",
  grade: "中学受験",
  title: "年齢算",
  description:
    "変わらない年齢差と倍数関係から何年後かを求める、中学受験向け年齢算プリントです。",
  generator: new AgeCalculationGenerator(),
};
