import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class CombinationGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const n = this.randomNumber(5, 15),
      r = this.randomNumber(2, Math.min(5, n - 1));
    let value = 1;
    for (let i = 1; i <= r; i++) value = (value * (n - i + 1)) / i;
    return {
      question: `${n}人から${r}人を選ぶ方法は何通りですか。`,
      answer: `${value}通り`,
    };
  }
}
export const highCombinations: ProblemType = {
  id: "h1-combinations",
  level: "高校",
  grade: "高1",
  title: "組合せ",
  description: "n個からr個を選ぶ組合せの数を求める高校1年生向けプリントです。",
  generator: new CombinationGenerator(),
};
