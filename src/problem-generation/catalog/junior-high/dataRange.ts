import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class DataRangeGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const values = Array.from({ length: 6 }, () =>
      this.randomNumber(1, 50),
    ).sort((a, b) => a - b);
    return {
      question: `データ ${values.join("、")} の範囲を求めましょう。`,
      answer: String(values[5]! - values[0]!),
    };
  }
}
export const juniorDataRange: ProblemType = {
  id: "j1-data-range",
  level: "中学校",
  grade: "中1",
  title: "データの範囲",
  description:
    "最大値と最小値の差からデータの範囲を求める中学1年生向けプリントです。",
  generator: new DataRangeGenerator(),
};
