import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class QuadraticInequalityGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const p = this.randomNumber(-10, 5);
    const q = p + this.randomNumber(1, 10);
    return {
      question: `x² ${-(p + q) < 0 ? "-" : "+"} ${Math.abs(p + q)}x ${p * q < 0 ? "-" : "+"} ${Math.abs(p * q)} > 0 を解きましょう。`,
      answer: `x < ${p} または x > ${q}`,
    };
  }
}
export const highQuadraticInequality: ProblemType = {
  id: "h1-quadratic-inequality",
  level: "高校",
  grade: "高1",
  title: "二次不等式",
  description:
    "因数分解できる二次不等式の解の範囲を求める高校1年生向けプリントです。",
  generator: new QuadraticInequalityGenerator(),
};
