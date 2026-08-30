import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";

const primes = [2, 3, 5, 7] as const;
class PrimeFactorizationGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const first = this.randomElement(primes);
    const second = this.randomElement(primes.filter((value) => value >= first));
    const third = this.randomElement(primes.filter((value) => value >= second));
    const factors = [first, second, third];
    return {
      question: `${factors.reduce<number>((a, b) => a * b, 1)}を素因数分解しましょう。`,
      answer: factors.join(" × "),
    };
  }
}
export const juniorPrimeFactorization: ProblemType = {
  id: "j1-prime-factorization",
  level: "中学校",
  grade: "中1",
  title: "素因数分解",
  description: "自然数を素数の積で表す中学1年生向けプリントです。",
  generator: new PrimeFactorizationGenerator(),
};
