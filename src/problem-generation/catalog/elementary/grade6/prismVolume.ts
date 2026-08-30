import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade6PrismVolumeGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const base = this.randomNumber(2, 20);
    const triangleHeight = this.randomNumber(2, 20) * 2;
    const prismHeight = this.randomNumber(2, 20);
    const baseArea = (base * triangleHeight) / 2;
    return {
      question: `底面が底辺${base}cm、高さ${triangleHeight}cmの三角形で、柱の高さが${prismHeight}cmの三角柱の体積を求めましょう。`,
      answer: `${baseArea * prismHeight}cm³`,
    };
  }
}

export const grade6PrismVolume: ProblemType = {
  id: "e6-prism-volume",
  level: "小学校",
  grade: "小6",
  title: "角柱の体積",
  description:
    "底面積×高さを使って三角柱の体積を求める、小学6年生向けプリントです。",
  generator: new Grade6PrismVolumeGenerator(),
};
