import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade3MeasurementGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    if (this.randomBoolean()) {
      const kilometers = this.randomNumber(1, 9);
      const meters = this.randomNumber(1, 999);
      return {
        question: `${kilometers}km ${meters}m = ___ m`,
        answer: `${kilometers * 1000 + meters}m`,
      };
    }

    const kilograms = this.randomNumber(1, 9);
    const grams = this.randomNumber(1, 999);
    return {
      question: `${kilograms}kg ${grams}g = ___ g`,
      answer: `${kilograms * 1000 + grams}g`,
    };
  }
}

export const grade3Measurement: ProblemType = {
  id: "e3-measurement",
  level: "小学校",
  grade: "小3",
  title: "長さと重さの単位",
  description:
    "kmとm、kgとgの関係を使って量を換算する、小学3年生向けプリントです。",
  generator: new Grade3MeasurementGenerator(),
};
