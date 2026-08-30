import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class GeometricSequenceGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const first = this.randomNonZero(-8, 8);
    const ratio = this.randomNonZero(-4, 5);
    const n = this.randomNumber(3, 8);
    return {
      question: `初項${first}、公比${ratio}の等比数列の第${n}項を求めましょう。`,
      answer: String(first * ratio ** (n - 1)),
    };
  }
}
export const highGeometricSequence: ProblemType = {
  id: "h2-geometric-sequence",
  level: "高校",
  grade: "高2",
  title: "等比数列",
  description: "初項と公比から等比数列の項を求める高校2年生向けプリントです。",
  generator: new GeometricSequenceGenerator(),
};
