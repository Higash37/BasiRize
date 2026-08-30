import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade2SimpleFractionGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const denominator = this.randomNumber(2, 10);
    const objects = ["ケーキ", "テープ", "紙", "ピザ"] as const;
    const object = this.randomElement(objects);
    return {
      question: `1つの${object}を ${denominator}こに おなじように分けました。1こ分を 分数で かきましょう。`,
      answer: `1/${denominator}`,
    };
  }
}

export const grade2SimpleFraction: ProblemType = {
  id: "e2-simple-fraction",
  level: "小学校",
  grade: "小2",
  title: "簡単な分数",
  description:
    "同じ大きさに分けた1個分を分数で表す、小学2年生向けの分数入門プリントです。",
  generator: new Grade2SimpleFractionGenerator(),
};
