import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class PassingCalculationGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const speed = this.randomNumber(10, 30);
    const trainLength = this.randomNumber(5, 20) * 10;
    const time = this.randomNumber(10, 40);
    const tunnelLength = speed * time - trainLength;

    if (tunnelLength <= 0) {
      return this.generateProblem();
    }

    return {
      question: `長さ${trainLength}mの列車が、長さ${tunnelLength}mのトンネルを秒速${speed}mで通過します。列車全体が通過するまで何秒かかりますか。`,
      answer: `${time}秒`,
    };
  }
}

export const entrancePassing: ProblemType = {
  id: "exam-passing",
  level: "小学校",
  grade: "中学受験",
  title: "通過算",
  description:
    "列車の長さとトンネルなどの長さを合わせて通過時間を求める、中学受験向け通過算プリントです。",
  generator: new PassingCalculationGenerator(),
};
