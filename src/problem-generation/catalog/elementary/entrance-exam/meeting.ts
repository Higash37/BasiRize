import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class MeetingCalculationGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const firstSpeed = this.randomNumber(3, 8);
    const secondSpeed = this.randomNumber(3, 8);
    const time = this.randomNumber(2, 8);
    const distance = (firstSpeed + secondSpeed) * time;

    return {
      question: `${distance}km離れた2地点から、時速${firstSpeed}kmと時速${secondSpeed}kmで同時に向かい合って出発します。何時間後に出会いますか。`,
      answer: `${time}時間後`,
    };
  }
}

export const entranceMeeting: ProblemType = {
  id: "exam-meeting",
  level: "小学校",
  grade: "中学受験",
  title: "旅人算（出会い）",
  description:
    "向かい合う2人の速さの和から出会う時刻を求める、中学受験向け旅人算プリントです。",
  generator: new MeetingCalculationGenerator(),
};
