import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade2LengthUnitsGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    if (this.randomBoolean()) {
      const meters = this.randomNumber(1, 9);
      const centimeters = this.randomNumber(1, 99);
      return {
        question: `${meters}m ${centimeters}cm = ___ cm`,
        answer: `${meters * 100 + centimeters}cm`,
      };
    }

    const centimeters = this.randomNumber(101, 999);
    return {
      question: `${centimeters}cm = ___ m ___ cm`,
      answer: `${Math.floor(centimeters / 100)}m ${centimeters % 100}cm`,
    };
  }
}

export const grade2LengthUnits: ProblemType = {
  id: "e2-length-units",
  level: "小学校",
  grade: "小2",
  title: "長さの単位",
  description:
    "mとcmの関係を使って長さを換算する、小学2年生向けの単位プリントです。",
  generator: new Grade2LengthUnitsGenerator(),
};
