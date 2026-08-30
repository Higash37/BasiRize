import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemType } from "../../../types";

class ClockCalculationGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const hour = this.randomNumber(1, 12);
    const minute = this.randomNumber(0, 11) * 5;
    const rawAngle = Math.abs((hour % 12) * 30 - minute * 5.5);
    const angle = Math.min(rawAngle, 360 - rawAngle);

    return {
      question: "時計の長針と短針がつくる小さい方の角は何度ですか。",
      answer: `${formatNumber(angle)}度`,
      diagram: { kind: "clock", hour, minute },
    };
  }
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export const entranceClockCalculation: ProblemType = {
  id: "exam-clock",
  level: "小学校",
  grade: "中学受験",
  title: "時計算",
  description:
    "長針と短針の動く角度から2本の針がつくる角を求める、中学受験向け時計算プリントです。",
  generator: new ClockCalculationGenerator(),
};
