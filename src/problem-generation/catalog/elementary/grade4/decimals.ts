import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade4DecimalsGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const left = this.randomNumber(100, 9999);
    const right = this.randomNumber(10, 999);
    const addition = this.randomBoolean();
    const larger = Math.max(left, right);
    const smaller = Math.min(left, right);
    const answer = addition ? left + right : larger - smaller;
    return {
      question: addition
        ? `${formatHundredths(left)} + ${formatHundredths(right)} = `
        : `${formatHundredths(larger)} - ${formatHundredths(smaller)} = `,
      answer: formatHundredths(answer),
    };
  }
}

function formatHundredths(value: number): string {
  return (value / 100).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export const grade4Decimals: ProblemType = {
  id: "e4-decimals",
  level: "小学校",
  grade: "小4",
  title: "小数のたし算・ひき算",
  description:
    "100分の1の位までの小数のたし算・ひき算を練習する、小学4年生向けプリントです。",
  generator: new Grade4DecimalsGenerator(),
};
