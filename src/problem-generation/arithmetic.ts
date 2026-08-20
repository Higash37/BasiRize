import { Calculation, Num, type Expression } from "./expression";
import { ProblemGenerator, type RandomSource } from "./generator";
import { Operator, type Operator as OperatorType } from "./operator";
import type { Problem } from "./types";

export type ArithmeticSetting = {
  min: number;
  max: number;
  minTerms: number;
  maxTerms: number;
  operators: readonly OperatorType[];
  allowNegative: boolean;
  maxAnswer: number;
};

export class ArithmeticGenerator extends ProblemGenerator {
  private readonly setting: ArithmeticSetting;

  constructor(random: RandomSource, setting: ArithmeticSetting) {
    super(random);
    validateSetting(setting);
    this.setting = setting;
  }

  protected generateProblem(): Problem {
    const termCount = this.randomNumber(
      this.setting.minTerms,
      this.setting.maxTerms,
    );
    const expression = this.randomExpression(termCount);
    return {
      question: `${expression.text()} = `,
      answer: String(expression.value()),
    };
  }

  private randomExpression(termCount: number): Expression {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const expression = this.buildExpression(termCount);
      if (this.isAcceptable(expression)) {
        return expression;
      }
    }

    throw new Error(
      `条件を満たす式を作れませんでした: ${this.setting.min}〜${this.setting.max}` +
        ` / ${termCount}項`,
    );
  }

  private isAcceptable(expression: Expression): boolean {
    if (!expression.isComputable()) {
      return false;
    }

    const value = expression.value();
    if (!this.setting.allowNegative && value < 0) {
      return false;
    }
    return Math.abs(value) <= this.setting.maxAnswer;
  }

  private buildExpression(termCount: number): Expression {
    if (termCount === 1) {
      return new Num(this.randomNumber(this.setting.min, this.setting.max));
    }

    const leftTerms = this.randomNumber(1, termCount - 1);
    const rightTerms = termCount - leftTerms;
    const left = this.randomExpression(leftTerms);
    const operator = this.randomElement(this.setting.operators);

    if (operator === Operator.DIVIDE && rightTerms === 1) {
      const divisor = this.randomDivisorOf(left.value());
      if (divisor !== undefined) {
        return new Calculation(left, operator, new Num(divisor));
      }
    }

    const right = this.randomExpression(rightTerms);
    return new Calculation(left, operator, right);
  }

  private randomDivisorOf(value: number): number | undefined {
    const target = Math.abs(value);
    if (target === 0) {
      return undefined;
    }

    const lower = Math.max(2, this.setting.min);
    const divisors: number[] = [];

    for (
      let divisor = lower;
      divisor <= this.setting.max && divisor * 2 <= target;
      divisor += 1
    ) {
      if (target % divisor === 0) {
        divisors.push(divisor);
      }
    }

    return divisors.length === 0 ? undefined : this.randomElement(divisors);
  }
}

export class ExactDivisionGenerator extends ProblemGenerator {
  private readonly maxDivisor: number;
  private readonly maxQuotient: number;

  constructor(random: RandomSource, maxDivisor: number, maxQuotient: number) {
    super(random);
    if (maxDivisor < 2 || maxQuotient < 2) {
      throw new Error("割る数と商の上限は2以上で指定してください");
    }
    this.maxDivisor = maxDivisor;
    this.maxQuotient = maxQuotient;
  }

  protected generateProblem(): Problem {
    const divisor = this.randomNumber(2, this.maxDivisor);
    const quotient = this.randomNumber(2, this.maxQuotient);
    const dividend = divisor * quotient;

    return {
      question: `${dividend} ÷ ${divisor} =`,
      answer: String(quotient),
    };
  }
}

export class RemainderDivisionGenerator extends ProblemGenerator {
  private readonly maxDivisor: number;
  private readonly maxQuotient: number;

  constructor(random: RandomSource, maxDivisor: number, maxQuotient: number) {
    super(random);
    if (maxDivisor < 2 || maxQuotient < 1) {
      throw new Error("割る数は2以上、商は1以上で指定してください");
    }
    this.maxDivisor = maxDivisor;
    this.maxQuotient = maxQuotient;
  }

  protected generateProblem(): Problem {
    const divisor = this.randomNumber(2, this.maxDivisor);
    const quotient = this.randomNumber(1, this.maxQuotient);
    const remainder = this.randomNumber(1, divisor - 1);
    const dividend = divisor * quotient + remainder;

    return {
      question: `${dividend} ÷ ${divisor} = `,
      answer: `${quotient} あまり ${remainder}`,
    };
  }
}

function validateSetting(setting: ArithmeticSetting): void {
  if (setting.min > setting.max) {
    throw new Error(`minがmaxより大きい: ${setting.min} > ${setting.max}`);
  }
  if (setting.minTerms < 2 || setting.maxTerms < setting.minTerms) {
    throw new Error("項数の範囲が不正です");
  }
  if (setting.operators.length === 0) {
    throw new Error("使う演算子が指定されていません");
  }
  if (setting.maxAnswer < 0) {
    throw new Error("答えの上限は0以上で指定してください");
  }
}
