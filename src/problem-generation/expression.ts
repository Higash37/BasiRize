import {
  Operator,
  applyOperator,
  keepsMeaningOnRight,
  operatorPrecedence,
  operatorSymbol,
  type Operator as OperatorType,
} from "./operator";

export type Expression = {
  value(): number;
  text(): string;
  isComputable(): boolean;
  precedence(): number;
};

export class Num implements Expression {
  private readonly number: number;

  constructor(number: number) {
    this.number = number;
  }

  value(): number {
    return this.number;
  }

  text(): string {
    return String(this.number);
  }

  isComputable(): boolean {
    return true;
  }

  precedence(): number {
    return this.number < 0 ? 0 : 3;
  }
}

export class Calculation implements Expression {
  private readonly left: Expression;
  private readonly operator: OperatorType;
  private readonly right: Expression;

  constructor(left: Expression, operator: OperatorType, right: Expression) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  value(): number {
    return applyOperator(this.operator, this.left.value(), this.right.value());
  }

  text(): string {
    return `${this.render(this.left, false)} ${operatorSymbol(this.operator)} ${this.render(this.right, true)}`;
  }

  isComputable(): boolean {
    if (!this.left.isComputable() || !this.right.isComputable()) {
      return false;
    }

    if (this.operator === Operator.DIVIDE) {
      const rightValue = this.right.value();
      if (rightValue === 0 || this.left.value() % rightValue !== 0) {
        return false;
      }
    }

    return true;
  }

  precedence(): number {
    return operatorPrecedence(this.operator);
  }

  private render(child: Expression, isRight: boolean): string {
    let needsBrackets = child.precedence() < this.precedence();

    if (
      isRight &&
      child.precedence() === this.precedence() &&
      !keepsMeaningOnRight(this.operator)
    ) {
      needsBrackets = true;
    }

    return needsBrackets ? `(${child.text()})` : child.text();
  }
}
