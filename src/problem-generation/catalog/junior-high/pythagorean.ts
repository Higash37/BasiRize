import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
const triples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
] as const;
class PythagoreanGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const [a, b, c] = this.randomElement(triples);
    const scale = this.randomNumber(1, 10);
    return {
      question: `直角をはさむ2辺が${a * scale}cm、${b * scale}cmの直角三角形の斜辺を求めましょう。`,
      answer: `${c * scale}cm`,
    };
  }
}
export const juniorPythagorean: ProblemType = {
  id: "j3-pythagorean",
  level: "中学校",
  grade: "中3",
  title: "三平方の定理",
  description: "直角三角形の2辺から残りの辺を求める中学3年生向けプリントです。",
  generator: new PythagoreanGenerator(),
};
