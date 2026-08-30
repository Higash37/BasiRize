import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade3TimeUnitsGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    if (this.randomBoolean()) {
      const minutes = this.randomNumber(1, 9);
      const seconds = this.randomNumber(1, 59);
      return {
        question: `${minutes}分${seconds}秒 = ___ 秒`,
        answer: `${minutes * 60 + seconds}秒`,
      };
    }

    const hours = this.randomNumber(1, 9);
    const minutes = this.randomNumber(1, 59);
    return {
      question: `${hours}時間${minutes}分 = ___ 分`,
      answer: `${hours * 60 + minutes}分`,
    };
  }
}

export const grade3TimeUnits: ProblemType = {
  id: "e3-time-units",
  level: "小学校",
  grade: "小3",
  title: "時間の単位",
  description:
    "時間・分・秒の関係を使って時間を換算する、小学3年生向けプリントです。",
  generator: new Grade3TimeUnitsGenerator(),
};
