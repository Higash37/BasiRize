import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

const labels = ["9時", "10時", "11時", "12時"];

class Grade4LineGraphGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const values = labels.map(() => this.randomNumber(10, 30));
    const index = this.randomNumber(0, labels.length - 1);
    return {
      question: `折れ線グラフで、${labels[index]}の値はいくつですか。`,
      answer: String(values[index]),
      diagram: { kind: "line-chart", labels, values },
    };
  }
}

export const grade4LineGraph: ProblemType = {
  id: "e4-line-graph",
  level: "小学校",
  grade: "小4",
  title: "折れ線グラフ",
  description:
    "時間とともに変わる数量を折れ線グラフから読み取る、小学4年生向けプリントです。",
  generator: new Grade4LineGraphGenerator(),
};
