import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class PlantingTreesGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const interval = this.randomNumber(2, 10);
    const gaps = this.randomNumber(4, 20);
    const closed = this.randomBoolean();
    const length = interval * gaps;
    const count = closed ? gaps : gaps + 1;

    return {
      question: closed
        ? `一周${length}mの池のまわりに、${interval}mおきに木を植えます。木は何本必要ですか。`
        : `${length}mの道のはしからはしまで、${interval}mおきに木を植えます。両はしにも植えると何本必要ですか。`,
      answer: `${count}本`,
      diagram: {
        kind: "point-line",
        pointCount: count,
        intervalLabel: `${interval}m`,
        closed,
      },
    };
  }
}

export const entrancePlantingTrees: ProblemType = {
  id: "exam-planting-trees",
  level: "小学校",
  grade: "中学受験",
  title: "植木算",
  description:
    "直線と円周で間の数がどう変わるかを図とともに練習する、中学受験向け植木算プリントです。",
  generator: new PlantingTreesGenerator(),
};
