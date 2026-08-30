import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class CurrentCalculationGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const stillWaterSpeed = this.randomNumber(6, 15);
    const currentSpeed = this.randomNumber(1, stillWaterSpeed - 2);
    const time = this.randomNumber(2, 6);
    const downstreamSpeed = stillWaterSpeed + currentSpeed;
    const distance = downstreamSpeed * time;

    return {
      question: `静水時の速さが時速${stillWaterSpeed}km、川の流れが時速${currentSpeed}kmの船が、下流へ${distance}km進みます。何時間かかりますか。`,
      answer: `${time}時間`,
    };
  }
}

export const entranceCurrent: ProblemType = {
  id: "exam-current",
  level: "小学校",
  grade: "中学受験",
  title: "流水算",
  description:
    "静水時の速さと川の流れから下り・上りの速さを考える、中学受験向け流水算プリントです。",
  generator: new CurrentCalculationGenerator(),
};
