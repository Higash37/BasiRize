import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade5UnitRateGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const people = this.randomNumber(2, 20);
    const perPerson = this.randomNumber(2, 30);
    const area = people * perPerson;
    return {
      question: `${area}m²の部屋に${people}人います。1人あたりの面積は何m²ですか。`,
      answer: `${perPerson}m²`,
    };
  }
}

export const grade5UnitRate: ProblemType = {
  id: "e5-unit-rate",
  level: "小学校",
  grade: "小5",
  title: "単位量あたりの大きさ",
  description:
    "1人あたり・1個あたりの量を求めて比べる、小学5年生向けプリントです。",
  generator: new Grade5UnitRateGenerator(),
};
