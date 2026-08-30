import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade4AnglesGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const degrees = this.randomNumber(1, 17) * 10;
    return {
      question: "図の角の大きさを答えましょう。",
      answer: `${degrees}度`,
      diagram: { kind: "angle", degrees },
    };
  }
}

export const grade4Angles: ProblemType = {
  id: "e4-angles",
  level: "小学校",
  grade: "小4",
  title: "角の大きさ",
  description:
    "0度より大きく180度より小さい角を図から読み取る、小学4年生向けプリントです。",
  generator: new Grade4AnglesGenerator(),
};
