import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade5VolumeGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const width = this.randomNumber(2, 15);
    const depth = this.randomNumber(2, 15);
    const height = this.randomNumber(2, 15);
    return {
      question: `たて${height}cm、横${width}cm、奥行き${depth}cmの直方体の体積を求めましょう。`,
      answer: `${width * depth * height}cm³`,
    };
  }
}

export const grade5Volume: ProblemType = {
  id: "e5-volume",
  level: "小学校",
  grade: "小5",
  title: "直方体・立方体の体積",
  description:
    "縦・横・高さから直方体の体積を求める、小学5年生向けプリントです。",
  generator: new Grade5VolumeGenerator(),
};
