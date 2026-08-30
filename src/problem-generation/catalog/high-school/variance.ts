import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class VarianceGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const mean = this.randomNumber(5, 30);
    const offset = this.randomNumber(1, 10);
    const values = [mean - offset, mean - offset, mean + offset, mean + offset];
    return {
      question: `データ ${values.join("、")} の分散を求めましょう。`,
      answer: String(offset * offset),
    };
  }
}
export const highVariance: ProblemType = {
  id: "h1-variance",
  level: "高校",
  grade: "高1",
  title: "分散",
  description:
    "平均との差の二乗の平均から分散を求める高校1年生向けプリントです。",
  generator: new VarianceGenerator(),
};
