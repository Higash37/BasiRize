import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class ProbabilityGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const target = this.randomNumber(2, 12);
    const favorable = Array.from({ length: 6 }, (_, i) => i + 1).flatMap((a) =>
      Array.from({ length: 6 }, (_, i) => i + 1).filter(
        (b) => a + b === target,
      ),
    ).length;
    const divisor = gcd(favorable, 36);
    return {
      question: `2個のさいころを同時に投げるとき、目の和が${target}になる確率を求めましょう。`,
      answer: `${favorable / divisor}/${36 / divisor}`,
    };
  }
}
function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}
export const juniorProbability: ProblemType = {
  id: "j2-probability",
  level: "中学校",
  grade: "中2",
  title: "確率",
  description:
    "2個のさいころの起こり方から確率を求める中学2年生向けプリントです。",
  generator: new ProbabilityGenerator(),
};
