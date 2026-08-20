import { ProblemGenerator, type RandomSource } from "./generator";
import {
  Operator,
  operatorSymbol,
  type Operator as OperatorType,
} from "./operator";
import type { Problem } from "./types";

class Fraction {
  readonly numerator: number;
  readonly denominator: number;

  constructor(numerator: number, denominator: number) {
    if (denominator === 0) {
      throw new Error("分母を0にはできません");
    }

    let normalizedNumerator = denominator < 0 ? -numerator : numerator;
    let normalizedDenominator = Math.abs(denominator);
    const divisor = greatestCommonDivisor(
      Math.abs(normalizedNumerator),
      normalizedDenominator,
    );
    normalizedNumerator /= divisor;
    normalizedDenominator /= divisor;

    this.numerator = normalizedNumerator;
    this.denominator = normalizedDenominator;
  }

  apply(operator: OperatorType, other: Fraction): Fraction {
    switch (operator) {
      case Operator.ADD:
        return this.add(other);
      case Operator.SUBTRACT:
        return this.subtract(other);
      case Operator.MULTIPLY:
        return this.multiply(other);
      case Operator.DIVIDE:
        return this.divide(other);
    }
  }

  text(): string {
    return this.denominator === 1
      ? String(this.numerator)
      : `${this.numerator}/${this.denominator}`;
  }

  private add(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.denominator + other.numerator * this.denominator,
      this.denominator * other.denominator,
    );
  }

  private subtract(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.denominator - other.numerator * this.denominator,
      this.denominator * other.denominator,
    );
  }

  private multiply(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.numerator,
      this.denominator * other.denominator,
    );
  }

  private divide(other: Fraction): Fraction {
    if (other.numerator === 0) {
      throw new Error("0で割れません");
    }
    return new Fraction(
      this.numerator * other.denominator,
      this.denominator * other.numerator,
    );
  }
}

export class FractionGenerator extends ProblemGenerator {
  private readonly maxDenominator: number;
  private readonly operators: readonly OperatorType[];
  private readonly sameDenominator: boolean;

  constructor(
    random: RandomSource,
    maxDenominator: number,
    operators: readonly OperatorType[],
    sameDenominator: boolean,
  ) {
    super(random);
    if (maxDenominator < 2 || operators.length === 0) {
      throw new Error("分母の上限または演算子の指定が不正です");
    }
    this.maxDenominator = maxDenominator;
    this.operators = operators;
    this.sameDenominator = sameDenominator;
  }

  protected generateProblem(): Problem {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const denominator1 = this.randomNumber(2, this.maxDenominator);
      const denominator2 = this.sameDenominator
        ? denominator1
        : this.randomNumber(2, this.maxDenominator);
      const numerator1 = this.randomNumber(1, denominator1 - 1);
      const numerator2 = this.randomNumber(1, denominator2 - 1);
      const first = new Fraction(numerator1, denominator1);
      const second = new Fraction(numerator2, denominator2);

      let firstText: string;
      let secondText: string;

      if (this.sameDenominator) {
        firstText = `${numerator1}/${denominator1}`;
        secondText = `${numerator2}/${denominator2}`;
      } else {
        if (first.denominator === second.denominator) {
          continue;
        }
        firstText = first.text();
        secondText = second.text();
      }

      const operator = this.randomElement(this.operators);
      const answer = first.apply(operator, second);
      if (answer.numerator <= 0) {
        continue;
      }

      return {
        question: `${firstText} ${operatorSymbol(operator)} ${secondText} =`,
        answer: answer.text(),
      };
    }

    throw new Error("条件を満たす分数の問題を作れませんでした");
  }
}

function greatestCommonDivisor(a: number, b: number): number {
  let left = a;
  let right = b;
  while (right !== 0) {
    const remainder = left % right;
    left = right;
    right = remainder;
  }
  return left;
}
