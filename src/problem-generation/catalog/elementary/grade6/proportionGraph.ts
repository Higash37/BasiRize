import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade6ProportionGraphGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const slope = this.randomNumber(2, 12);
    const maxX = this.randomNumber(3, 10);
    return {
      question: `比例のグラフで、xが${maxX}のときのyを求めましょう。`,
      answer: String(slope * maxX),
      diagram: { kind: "proportion-graph", slope, maxX },
    };
  }
}

export const grade6ProportionGraph: ProblemType = {
  id: "e6-proportion-graph",
  level: "小学校",
  grade: "小6",
  title: "比例のグラフ",
  description:
    "原点を通る直線から比例の式と値を読み取る、小学6年生向けプリントです。",
  generator: new Grade6ProportionGraphGenerator(),
};
