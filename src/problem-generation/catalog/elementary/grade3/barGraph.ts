import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

const labels = ["月", "火", "水", "木"];

class Grade3BarGraphGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const values = labels.map(() => this.randomNumber(1, 10));
    const leftIndex = this.randomNumber(0, labels.length - 1);
    let rightIndex = this.randomNumber(0, labels.length - 2);
    if (rightIndex >= leftIndex) rightIndex += 1;
    const difference = Math.abs(values[leftIndex]! - values[rightIndex]!);

    return {
      question: `${labels[leftIndex]}曜日と${labels[rightIndex]}曜日の数のちがいはいくつですか。`,
      answer: String(difference),
      diagram: { kind: "bar-chart", labels, values },
    };
  }
}

export const grade3BarGraph: ProblemType = {
  id: "e3-bar-graph",
  level: "小学校",
  grade: "小3",
  title: "棒グラフの読み取り",
  description:
    "棒グラフの目盛りを読み、2つの項目の差を求める小学3年生向けプリントです。",
  generator: new Grade3BarGraphGenerator(),
};
