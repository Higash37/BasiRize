import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade5SpeedGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const speed = this.randomNumber(3, 12) * 5;
    const time = this.randomNumber(2, 6);
    const distance = speed * time;
    const questionType = this.randomNumber(0, 2);

    if (questionType === 0) {
      return {
        question: `${distance}kmの道のりを${time}時間で進みました。時速は何kmですか。`,
        answer: `時速${speed}km`,
      };
    }
    if (questionType === 1) {
      return {
        question: `時速${speed}kmで${time}時間進みました。道のりは何kmですか。`,
        answer: `${distance}km`,
      };
    }
    return {
      question: `${distance}kmの道のりを時速${speed}kmで進みました。何時間かかりますか。`,
      answer: `${time}時間`,
    };
  }
}

export const grade5Speed: ProblemType = {
  id: "e5-speed",
  level: "小学校",
  grade: "小5",
  title: "速さ・道のり・時間",
  description:
    "速さ・道のり・時間の関係を使い、求める量を切り替えて練習できる小学5年生向けプリントです。",
  generator: new Grade5SpeedGenerator(),
};
