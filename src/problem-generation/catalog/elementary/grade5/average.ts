import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade5AverageGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const average = this.randomNumber(10, 100);
    const firstOffset = this.randomNumber(-9, 9);
    const secondOffset = this.randomNumber(-9, 9);
    const values = [
      average + firstOffset,
      average + secondOffset,
      average - firstOffset - secondOffset,
    ];
    if (values.some((value) => value <= 0)) return this.generateProblem();

    return {
      question: `${values.join("、")}の平均を求めましょう。`,
      answer: String(average),
    };
  }
}

export const grade5Average: ProblemType = {
  id: "e5-average",
  level: "小学校",
  grade: "小5",
  title: "平均",
  description:
    "複数の数量の合計を個数で等分して平均を求める、小学5年生向けプリントです。",
  generator: new Grade5AverageGenerator(),
};
