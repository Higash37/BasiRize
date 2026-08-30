import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade6CombinationsGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const shirts = this.randomNumber(2, 10);
    const trousers = this.randomNumber(2, 10);
    return {
      question: `シャツが${shirts}種類、ズボンが${trousers}種類あります。1つずつ選ぶ組み合わせは何通りですか。`,
      answer: `${shirts * trousers}通り`,
    };
  }
}

export const grade6Combinations: ProblemType = {
  id: "e6-combinations",
  level: "小学校",
  grade: "小6",
  title: "場合の数",
  description:
    "2つの選択肢の組み合わせを落ちや重なりなく数える、小学6年生向けプリントです。",
  generator: new Grade6CombinationsGenerator(),
};
