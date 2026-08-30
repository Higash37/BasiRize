import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class SumDifferenceGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const smaller = this.randomNumber(10, 80);
    const difference = this.randomNumber(2, 30);
    const larger = smaller + difference;
    const total = smaller + larger;

    return {
      question: `2つの数の和は${total}、差は${difference}です。大きい方の数を求めましょう。`,
      answer: String(larger),
      diagram: {
        kind: "tape",
        upperRatio: larger,
        lowerRatio: smaller,
        upperLabel: "大",
        lowerLabel: "小",
        totalLabel: String(total),
        differenceLabel: String(difference),
      },
    };
  }
}

export const entranceSumDifference: ProblemType = {
  id: "exam-sum-difference",
  level: "小学校",
  grade: "中学受験",
  title: "和差算",
  description:
    "2つの量の和と差からそれぞれの大きさを求める、中学受験向けの和差算プリントです。",
  generator: new SumDifferenceGenerator(),
};
