import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade3LargeNumbersGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const tenThousands = this.randomNumber(1, 9);
    const thousands = this.randomNumber(0, 9);
    const hundreds = this.randomNumber(0, 9);
    const tens = this.randomNumber(0, 9);
    const ones = this.randomNumber(0, 9);
    const value =
      tenThousands * 10_000 +
      thousands * 1_000 +
      hundreds * 100 +
      tens * 10 +
      ones;

    return {
      question: `1万が${tenThousands}こ、1000が${thousands}こ、100が${hundreds}こ、10が${tens}こ、1が${ones}こで、いくつですか。`,
      answer: value.toLocaleString("ja-JP"),
    };
  }
}

export const grade3LargeNumbers: ProblemType = {
  id: "e3-large-numbers",
  level: "小学校",
  grade: "小3",
  title: "万の位までの数",
  description:
    "一万をこえる数の構成と位取りを練習する、小学3年生向けの大きな数のプリントです。",
  generator: new Grade3LargeNumbersGenerator(),
};
