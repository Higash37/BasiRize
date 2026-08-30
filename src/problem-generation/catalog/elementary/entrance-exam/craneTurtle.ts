import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class CraneTurtleGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const cranes = this.randomNumber(3, 25);
    const turtles = this.randomNumber(3, 25);
    const total = cranes + turtles;
    const legs = cranes * 2 + turtles * 4;

    return {
      question: `つるとかめが合わせて${total}匹います。足は合わせて${legs}本です。かめは何匹ですか。`,
      answer: `${turtles}匹`,
    };
  }
}

export const entranceCraneTurtle: ProblemType = {
  id: "exam-crane-turtle",
  level: "小学校",
  grade: "中学受験",
  title: "つるかめ算",
  description:
    "個数の合計と足の本数から内訳を求める、中学受験向けのつるかめ算プリントです。",
  generator: new CraneTurtleGenerator(),
};
