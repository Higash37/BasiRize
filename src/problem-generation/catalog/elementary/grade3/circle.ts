import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade3CircleGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const radius = this.randomNumber(1, 20);
    return {
      question: "図の円の直径は何cmですか。",
      answer: `${radius * 2}cm`,
      diagram: { kind: "circle", radius, unit: "cm" },
    };
  }
}

export const grade3Circle: ProblemType = {
  id: "e3-circle",
  level: "小学校",
  grade: "小3",
  title: "円の半径と直径",
  description:
    "円の中心・半径・直径の関係を図から読み取る、小学3年生向け図形プリントです。",
  generator: new Grade3CircleGenerator(),
};
