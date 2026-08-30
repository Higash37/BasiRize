import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade5CircumferenceGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const radius = this.randomNumber(1, 20);
    const circumference = 2 * radius * 3.14;
    return {
      question: "図の円周の長さを、円周率を3.14として求めましょう。",
      answer: `${Number(circumference.toFixed(2))}cm`,
      diagram: { kind: "circle", radius, unit: "cm" },
    };
  }
}

export const grade5Circumference: ProblemType = {
  id: "e5-circumference",
  level: "小学校",
  grade: "小5",
  title: "円周と円周率",
  description:
    "直径・半径と円周率3.14から円周を求める、小学5年生向けプリントです。",
  generator: new Grade5CircumferenceGenerator(),
};
