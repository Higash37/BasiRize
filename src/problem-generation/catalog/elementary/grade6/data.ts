import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade6DataGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const values = Array.from({ length: 5 }, () =>
      this.randomNumber(1, 50),
    ).sort((a, b) => a - b);
    return {
      question: `${values.join("、")}の中央値を求めましょう。`,
      answer: String(values[2]),
    };
  }
}

export const grade6Data: ProblemType = {
  id: "e6-data",
  level: "小学校",
  grade: "小6",
  title: "データの代表値",
  description:
    "並べたデータから中央値などの代表値を求める、小学6年生向けプリントです。",
  generator: new Grade6DataGenerator(),
};
