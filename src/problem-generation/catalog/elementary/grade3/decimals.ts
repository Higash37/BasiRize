import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade3DecimalsGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const leftTenths = this.randomNumber(1, 99);
    const rightTenths = this.randomNumber(1, 99);
    const addition = this.randomBoolean();
    const large = Math.max(leftTenths, rightTenths);
    const small = Math.min(leftTenths, rightTenths);
    const answerTenths = addition ? leftTenths + rightTenths : large - small;

    return {
      question: addition
        ? `${formatTenths(leftTenths)} + ${formatTenths(rightTenths)} = `
        : `${formatTenths(large)} - ${formatTenths(small)} = `,
      answer: formatTenths(answerTenths),
    };
  }
}

function formatTenths(value: number): string {
  return (value / 10).toFixed(1).replace(/\.0$/, "");
}

export const grade3Decimals: ProblemType = {
  id: "e3-decimals",
  level: "小学校",
  grade: "小3",
  title: "小数のたし算・ひき算",
  description:
    "10分の1の位までの小数をたしたりひいたりする、小学3年生向けプリントです。",
  generator: new Grade3DecimalsGenerator(),
};
