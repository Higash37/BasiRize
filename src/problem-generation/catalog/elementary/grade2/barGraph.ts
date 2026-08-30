import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

const labels = ["A", "B", "C", "D"];

class Grade2BarGraphGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const values = labels.map(() => this.randomNumber(1, 5));
    const greatestValue = Math.max(...values);
    const greatestLabels = labels.filter(
      (_, index) => values[index] === greatestValue,
    );

    return {
      question:
        "棒グラフを見て、いちばん 数が 多いものを すべて かきましょう。",
      answer: greatestLabels.join("、"),
      diagram: { kind: "bar-chart", labels, values },
    };
  }
}

export const grade2BarGraph: ProblemType = {
  id: "e2-bar-graph",
  level: "小学校",
  grade: "小2",
  title: "簡単な棒グラフ",
  description:
    "目盛りを読み、最も多い項目を答える小学2年生向けの棒グラフプリントです。",
  generator: new Grade2BarGraphGenerator(),
};
