import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade4AreaGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const width = this.randomNumber(2, 20);
    const height = this.randomNumber(2, 20);
    return {
      question: "図の長方形の面積を求めましょう。",
      answer: `${width * height}cm²`,
      diagram: { kind: "rectangle", width, height, unit: "cm" },
    };
  }
}

export const grade4Area: ProblemType = {
  id: "e4-area",
  level: "小学校",
  grade: "小4",
  title: "長方形・正方形の面積",
  description:
    "辺の長さが書かれた図から長方形の面積を求める、小学4年生向けプリントです。",
  generator: new Grade4AreaGenerator(),
};
