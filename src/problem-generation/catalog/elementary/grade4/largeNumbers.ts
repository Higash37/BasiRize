import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade4LargeNumbersGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const hundredMillions = this.randomNumber(1, 9);
    const tenThousands = this.randomNumber(0, 9999);
    const ones = this.randomNumber(0, 9999);
    const value = hundredMillions * 100_000_000 + tenThousands * 10_000 + ones;
    return {
      question: `1億が${hundredMillions}こ、1万が${tenThousands}こ、1が${ones}こで、いくつですか。`,
      answer: value.toLocaleString("ja-JP"),
    };
  }
}

export const grade4LargeNumbers: ProblemType = {
  id: "e4-large-numbers",
  level: "小学校",
  grade: "小4",
  title: "億・兆までの大きな数",
  description:
    "億を含む大きな数の構成と位取りを練習する、小学4年生向けプリントです。",
  generator: new Grade4LargeNumbersGenerator(),
};
