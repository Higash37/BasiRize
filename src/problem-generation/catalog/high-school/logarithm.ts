import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class LogarithmGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const base = this.randomNumber(2, 9);
    const exponent = this.randomNumber(1, 6);
    return {
      question: `log_${base} ${base ** exponent} の値を求めましょう。`,
      answer: String(exponent),
    };
  }
}
export const highLogarithm: ProblemType = {
  id: "h2-logarithm",
  level: "高校",
  grade: "高2",
  title: "対数の値",
  description:
    "対数の定義を使って基本的な値を求める高校2年生向けプリントです。",
  generator: new LogarithmGenerator(),
};
