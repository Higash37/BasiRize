import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade5DecimalCalculationGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const decimalTenths = this.randomNumber(11, 999);
    const integer = this.randomNumber(2, 20);
    const decimal = decimalTenths / 10;

    if (this.randomBoolean()) {
      return {
        question: `${format(decimal)} × ${integer} = `,
        answer: format(decimal * integer),
      };
    }

    return {
      question: `${format(decimal * integer)} ÷ ${integer} = `,
      answer: format(decimal),
    };
  }
}

function format(value: number): string {
  return Number(value.toFixed(2)).toString();
}

export const grade5DecimalCalculation: ProblemType = {
  id: "e5-decimal-multiply-divide",
  level: "小学校",
  grade: "小5",
  title: "小数のかけ算・わり算",
  description:
    "小数に整数をかけたり、積を整数でわったりする小学5年生向け計算プリントです。",
  generator: new Grade5DecimalCalculationGenerator(),
};
