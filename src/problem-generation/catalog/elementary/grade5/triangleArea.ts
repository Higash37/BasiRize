import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade5TriangleAreaGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const base = this.randomNumber(2, 20);
    const height = this.randomNumber(2, 20) * 2;
    return {
      question: `底辺${base}cm、高さ${height}cmの三角形の面積を求めましょう。`,
      answer: `${(base * height) / 2}cm²`,
    };
  }
}

export const grade5TriangleArea: ProblemType = {
  id: "e5-triangle-area",
  level: "小学校",
  grade: "小5",
  title: "三角形の面積",
  description:
    "底辺と高さから三角形の面積を求める、小学5年生向けプリントです。",
  generator: new Grade5TriangleAreaGenerator(),
};
