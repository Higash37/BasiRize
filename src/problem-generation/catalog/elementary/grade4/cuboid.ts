import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade4CuboidGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const width = this.randomNumber(2, 15);
    const depth = this.randomNumber(2, 15);
    const height = this.randomNumber(2, 15);
    return {
      question: "図の直方体のすべての辺の長さの合計を求めましょう。",
      answer: `${4 * (width + depth + height)}cm`,
      diagram: { kind: "cuboid", width, depth, height, unit: "cm" },
    };
  }
}

export const grade4Cuboid: ProblemType = {
  id: "e4-cuboid",
  level: "小学校",
  grade: "小4",
  title: "直方体と立方体",
  description:
    "直方体の辺の対応関係を立体図から読み取る、小学4年生向けプリントです。",
  generator: new Grade4CuboidGenerator(),
};
