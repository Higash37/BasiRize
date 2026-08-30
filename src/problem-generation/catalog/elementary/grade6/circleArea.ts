import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade6CircleAreaGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const radius = this.randomNumber(1, 20);
    const area = radius * radius * 3.14;
    return {
      question: "図の円の面積を、円周率を3.14として求めましょう。",
      answer: `${format(area)}cm²`,
      diagram: { kind: "circle", radius, unit: "cm" },
    };
  }
}

function format(value: number): string {
  return Number(value.toFixed(2)).toString();
}

export const grade6CircleArea: ProblemType = {
  id: "e6-circle-area",
  level: "小学校",
  grade: "小6",
  title: "円の面積",
  description:
    "半径と円周率3.14から円の面積を求める、小学6年生向け図形プリントです。",
  generator: new Grade6CircleAreaGenerator(),
};
