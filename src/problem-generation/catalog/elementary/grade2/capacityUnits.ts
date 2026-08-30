import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade2CapacityUnitsGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const liters = this.randomNumber(1, 9);
    const deciliters = this.randomNumber(1, 9);
    return {
      question: `${liters}L ${deciliters}dL = ___ dL`,
      answer: `${liters * 10 + deciliters}dL`,
    };
  }
}

export const grade2CapacityUnits: ProblemType = {
  id: "e2-capacity-units",
  level: "小学校",
  grade: "小2",
  title: "かさの単位",
  description:
    "LとdLの関係を使って、かさを換算する小学2年生向けの単位プリントです。",
  generator: new Grade2CapacityUnitsGenerator(),
};
