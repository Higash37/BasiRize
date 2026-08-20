export const Operator = {
  ADD: "add",
  SUBTRACT: "subtract",
  MULTIPLY: "multiply",
  DIVIDE: "divide",
} as const;

export type Operator = (typeof Operator)[keyof typeof Operator];

export function operatorSymbol(operator: Operator): string {
  switch (operator) {
    case Operator.ADD:
      return "+";
    case Operator.SUBTRACT:
      return "-";
    case Operator.MULTIPLY:
      return "×";
    case Operator.DIVIDE:
      return "÷";
  }
}

export function applyOperator(
  operator: Operator,
  left: number,
  right: number,
): number {
  switch (operator) {
    case Operator.ADD:
      return left + right;
    case Operator.SUBTRACT:
      return left - right;
    case Operator.MULTIPLY:
      return left * right;
    case Operator.DIVIDE:
      return Math.trunc(left / right);
  }
}

export function operatorPrecedence(operator: Operator): number {
  switch (operator) {
    case Operator.ADD:
    case Operator.SUBTRACT:
      return 1;
    case Operator.MULTIPLY:
    case Operator.DIVIDE:
      return 2;
  }
}

export function keepsMeaningOnRight(operator: Operator): boolean {
  return operator === Operator.ADD || operator === Operator.MULTIPLY;
}
