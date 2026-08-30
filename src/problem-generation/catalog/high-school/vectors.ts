import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class VectorGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const ax = this.randomNumber(-9, 9),
      ay = this.randomNumber(-9, 9),
      bx = this.randomNumber(-9, 9),
      by = this.randomNumber(-9, 9);
    return {
      question: `ベクトル a=(${ax}, ${ay}), b=(${bx}, ${by}) のとき、a+bを求めましょう。`,
      answer: `(${ax + bx}, ${ay + by})`,
    };
  }
}
export const highVectors: ProblemType = {
  id: "h2-vectors",
  level: "高校",
  grade: "高2",
  title: "ベクトルの加法",
  description: "成分表示されたベクトルの和を求める高校2年生向けプリントです。",
  generator: new VectorGenerator(),
};
