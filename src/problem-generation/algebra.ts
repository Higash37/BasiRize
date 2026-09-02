import { ProblemGenerator, type RandomSource } from "./generator";
import { Operator, operatorSymbol } from "./operator";
import { factor, quadratic, signedTerm, withVariable } from "./polynomial";
import type { Problem } from "./types";

export class LikeTermsGenerator extends ProblemGenerator {
  private readonly maxCoefficient: number;

  constructor(random: RandomSource, maxCoefficient: number) {
    super(random);
    ensurePositive(maxCoefficient, "係数の上限");
    this.maxCoefficient = maxCoefficient;
  }

  protected generateProblem(): Problem {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const first = this.randomNumber(1, this.maxCoefficient);
      const second = this.randomNumber(1, this.maxCoefficient);
      const operator = this.randomBoolean() ? Operator.ADD : Operator.SUBTRACT;
      const result =
        operator === Operator.ADD ? first + second : first - second;

      if (result <= 0) {
        continue;
      }

      return {
        question:
          `${withVariable(first, "x")} ${operatorSymbol(operator)} ` +
          `${withVariable(second, "x")}\n=`,
        answer: withVariable(result, "x"),
      };
    }
    throw new Error("同類項の問題を作れませんでした");
  }
}

export class ExpansionGenerator extends ProblemGenerator {
  private readonly maxRoot: number;

  constructor(random: RandomSource, maxRoot: number) {
    super(random);
    ensurePositive(maxRoot, "係数の上限");
    this.maxRoot = maxRoot;
  }

  protected generateProblem(): Problem {
    const first = this.randomNonZero(-this.maxRoot, this.maxRoot);
    const second = this.randomNonZero(-this.maxRoot, this.maxRoot);
    return {
      question: `${factor(first)}${factor(second)} を展開すると？`,
      answer: quadratic(first + second, first * second),
    };
  }
}

export class FactoringGenerator extends ProblemGenerator {
  private readonly maxRoot: number;

  constructor(random: RandomSource, maxRoot: number) {
    super(random);
    ensurePositive(maxRoot, "係数の上限");
    this.maxRoot = maxRoot;
  }

  protected generateProblem(): Problem {
    const first = this.randomNonZero(-this.maxRoot, this.maxRoot);
    const second = this.randomNonZero(-this.maxRoot, this.maxRoot);
    return {
      question: `${quadratic(first + second, first * second)} を因数分解すると？`,
      answer: `${factor(first)}${factor(second)}`,
    };
  }
}

export class LinearEquationGenerator extends ProblemGenerator {
  private readonly maxSolution: number;
  private readonly maxCoefficient: number;

  constructor(
    random: RandomSource,
    maxSolution: number,
    maxCoefficient: number,
  ) {
    super(random);
    ensurePositive(maxSolution, "解の上限");
    ensurePositive(maxCoefficient, "係数の上限");
    this.maxSolution = maxSolution;
    this.maxCoefficient = maxCoefficient;
  }

  protected generateProblem(): Problem {
    const solution = this.randomNonZero(-this.maxSolution, this.maxSolution);
    const coefficient = this.randomNumber(1, this.maxCoefficient);
    const constant = this.randomNonZero(
      -this.maxCoefficient,
      this.maxCoefficient,
    );
    const rightSide = coefficient * solution + constant;

    return {
      question:
        `${withVariable(coefficient, "x")}${signedTerm(constant, "")}` +
        ` = ${rightSide} のとき、\nx = `,
      answer: String(solution),
    };
  }
}

export class SimultaneousEquationGenerator extends ProblemGenerator {
  private readonly maxSolution: number;
  private readonly maxCoefficient: number;

  constructor(
    random: RandomSource,
    maxSolution: number,
    maxCoefficient: number,
  ) {
    super(random);
    ensurePositive(maxSolution, "解の上限");
    ensurePositive(maxCoefficient, "係数の上限");
    this.maxSolution = maxSolution;
    this.maxCoefficient = maxCoefficient;
  }

  protected generateProblem(): Problem {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const x = this.randomNonZero(-this.maxSolution, this.maxSolution);
      const y = this.randomNonZero(-this.maxSolution, this.maxSolution);
      const a1 = this.randomNumber(1, this.maxCoefficient);
      const b1 = this.randomNumber(1, this.maxCoefficient);
      const a2 = this.randomNumber(1, this.maxCoefficient);
      const b2 = this.randomNumber(1, this.maxCoefficient);

      if (a1 * b2 === a2 * b1) {
        continue;
      }

      const c1 = a1 * x + b1 * y;
      const c2 = a2 * x - b2 * y;
      const first = `${withVariable(a1, "x")}${signedTerm(b1, "y")} = ${c1}`;
      const second = `${withVariable(a2, "x")}${signedTerm(-b2, "y")} = ${c2}`;

      return {
        question: `${first}, ${second} のとき、\nx = \ny = `,
        answer: `x = ${x}, y = ${y}`,
      };
    }
    throw new Error("連立方程式の問題を作れませんでした");
  }
}

export class QuadraticEquationGenerator extends ProblemGenerator {
  private readonly maxRoot: number;

  constructor(random: RandomSource, maxRoot: number) {
    super(random);
    ensurePositive(maxRoot, "解の上限");
    this.maxRoot = maxRoot;
  }

  protected generateProblem(): Problem {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const first = this.randomNumber(-this.maxRoot, this.maxRoot);
      const second = this.randomNumber(-this.maxRoot, this.maxRoot);
      if (first === 0 && second === 0) {
        continue;
      }

      const answer =
        first === second
          ? `x = ${first}`
          : `x = ${Math.min(first, second)}, ${Math.max(first, second)}`;
      return {
        question: `${quadratic(-(first + second), first * second)} = 0 のとき、\nx = `,
        answer,
      };
    }
    throw new Error("二次方程式の問題を作れませんでした");
  }
}

const RADICANDS = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15] as const;

export class SquareRootGenerator extends ProblemGenerator {
  private readonly maxCoefficient: number;

  constructor(random: RandomSource, maxCoefficient: number) {
    super(random);
    ensurePositive(maxCoefficient, "係数の上限");
    this.maxCoefficient = maxCoefficient;
  }

  protected generateProblem(): Problem {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const radicand = this.randomElement(RADICANDS);
      const first = this.randomNumber(1, this.maxCoefficient);
      const second = this.randomNumber(1, this.maxCoefficient);
      const operator = this.randomBoolean() ? Operator.ADD : Operator.SUBTRACT;
      const result =
        operator === Operator.ADD ? first + second : first - second;

      if (result <= 0) {
        continue;
      }

      const root = `√${radicand}`;
      return {
        question:
          `${withVariable(first, root)} ${operatorSymbol(operator)} ` +
          `${withVariable(second, root)}\n= `,
        answer: withVariable(result, root),
      };
    }
    throw new Error("平方根の問題を作れませんでした");
  }
}

function ensurePositive(value: number, name: string): void {
  if (value < 1) {
    throw new Error(`${name}は1以上で指定してください: ${value}`);
  }
}
