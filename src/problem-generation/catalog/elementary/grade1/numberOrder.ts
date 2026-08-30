import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade1NumberOrderGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const number = this.randomNumber(1, 98);

    return {
      question: `${number}の まえの数と、つぎの数を かきましょう。\n___、${number}、___`,
      answer: `${number - 1}、${number}、${number + 1}`,
    };
  }
}

export const grade1NumberOrder: ProblemType = {
  id: "e1-number-order",
  level: "小学校",
  grade: "小1",
  title: "数の順序",
  description:
    "ある数の前と次の数を答える、小学1年生向けの数の順序プリントです。数直線の基礎練習に使えます。",
  generator: new Grade1NumberOrderGenerator(),
};
