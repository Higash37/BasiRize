import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class SetsGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const start = this.randomNumber(1, 10);
    const a = [start, start + 2, start + 4];
    const b = [start + 2, start + 3, start + 4];
    return {
      question: `A={${a.join(", ")}}, B={${b.join(", ")}} のとき、A∩Bを求めましょう。`,
      answer: `{${start + 2}, ${start + 4}}`,
    };
  }
}
export const highSets: ProblemType = {
  id: "h1-sets",
  level: "高校",
  grade: "高1",
  title: "集合",
  description: "共通部分や和集合を求める高校1年生向けプリントです。",
  generator: new SetsGenerator(),
};
