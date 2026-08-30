import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class Grade2ElapsedTimeGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const startHour = this.randomNumber(1, 11);
    const startMinute = this.randomNumber(0, 5) * 10;
    const elapsed = this.randomNumber(1, 5) * 10;
    const totalMinutes = startHour * 60 + startMinute + elapsed;
    const answerHour = Math.floor(totalMinutes / 60);
    const answerMinute = totalMinutes % 60;

    return {
      question: `${formatTime(startHour, startMinute)}から ${elapsed}分後は 何時何分ですか。`,
      answer: formatTime(answerHour, answerMinute),
    };
  }
}

function formatTime(hour: number, minute: number): string {
  return `${hour}時${minute === 0 ? "" : `${minute}分`}`;
}

export const grade2ElapsedTime: ProblemType = {
  id: "e2-elapsed-time",
  level: "小学校",
  grade: "小2",
  title: "時刻と時間",
  description:
    "ある時刻から何分後かを求める、小学2年生向けの時刻と時間のプリントです。",
  generator: new Grade2ElapsedTimeGenerator(),
};
