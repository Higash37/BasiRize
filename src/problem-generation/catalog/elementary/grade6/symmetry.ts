import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade6SymmetryGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const mode = this.randomBoolean() ? "line" : "point";
    const variant = this.randomNumber(0, 20);
    return {
      question: "図の対称の種類を答えましょう。",
      answer: mode === "line" ? "線対称" : "点対称",
      diagram: { kind: "symmetry", mode, variant },
    };
  }
}

export const grade6Symmetry: ProblemType = {
  id: "e6-symmetry",
  level: "小学校",
  grade: "小6",
  title: "線対称・点対称",
  description:
    "図形が線対称か点対称かを見分ける、小学6年生向け図形プリントです。",
  generator: new Grade6SymmetryGenerator(),
};
