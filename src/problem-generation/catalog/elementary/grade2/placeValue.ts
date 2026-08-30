import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade2PlaceValueGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const thousands = this.randomNumber(1, 9);
    const hundreds = this.randomNumber(0, 9);
    const tens = this.randomNumber(0, 9);
    const ones = this.randomNumber(0, 9);

    return {
      question:
        `1000が${thousands}こ、100が${hundreds}こ、` +
        `10が${tens}こ、1が${ones}こで、いくつですか。`,
      answer: String(thousands * 1000 + hundreds * 100 + tens * 10 + ones),
    };
  }
}

export const grade2PlaceValue: ProblemType = {
  id: "e2-place-value",
  level: "小学校",
  grade: "小2",
  title: "数の構成と位取り",
  description:
    "1000・100・10・1のまとまりから数を答える、小学2年生向けの位取りプリントです。",
  generator: new Grade2PlaceValueGenerator(),
};
