import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade6RatioGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const left = this.randomNumber(2, 60);
    const right = this.randomNumber(2, 60);
    const divisor = gcd(left, right);
    return {
      question: `比 ${left} : ${right} を、最も簡単な整数の比にしましょう。`,
      answer: `${left / divisor} : ${right / divisor}`,
    };
  }
}

function gcd(left: number, right: number): number {
  let a = left;
  let b = right;
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

export const grade6Ratio: ProblemType = {
  id: "e6-ratio",
  level: "小学校",
  grade: "小6",
  title: "比を簡単にする",
  description:
    "2つの数量の比を同じ数でわり、最も簡単な整数比にする小学6年生向けプリントです。",
  generator: new Grade6RatioGenerator(),
};
