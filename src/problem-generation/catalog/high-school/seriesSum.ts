import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class SeriesSumGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const first = this.randomNumber(-10, 20),
      difference = this.randomNonZero(-6, 8),
      n = this.randomNumber(5, 25);
    const last = first + (n - 1) * difference;
    return {
      question: `初項${first}、公差${difference}、項数${n}の等差数列の和を求めましょう。`,
      answer: String((n * (first + last)) / 2),
    };
  }
}
export const highSeriesSum: ProblemType = {
  id: "h2-series-sum",
  level: "高校",
  grade: "高2",
  title: "等差数列の和",
  description:
    "初項・公差・項数から等差数列の和を求める高校2年生向けプリントです。",
  generator: new SeriesSumGenerator(),
};
