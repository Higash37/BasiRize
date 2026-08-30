import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade1TimeReadingGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const hour = this.randomNumber(1, 12);
    const minute = this.randomNumber(0, 11) * 5;

    return {
      question: "時計は なんじ なんぷんですか。",
      answer: `${hour}じ${minute === 0 ? "" : `${minute}ふん`}`,
      diagram: { kind: "clock", hour, minute },
    };
  }
}

export const grade1TimeReading: ProblemType = {
  id: "e1-time-reading",
  level: "小学校",
  grade: "小1",
  title: "時計の読み方",
  description:
    "針の位置が毎回変わるアナログ時計を見て、時刻を答える小学1年生向けプリントです。",
  generator: new Grade1TimeReadingGenerator(),
};
