import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
const values = [
  { angle: 0, sin: "0", cos: "1" },
  { angle: 30, sin: "1/2", cos: "√3/2" },
  { angle: 45, sin: "√2/2", cos: "√2/2" },
  { angle: 60, sin: "√3/2", cos: "1/2" },
  { angle: 90, sin: "1", cos: "0" },
] as const;
class TrigonometryGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const value = this.randomElement(values);
    const useSin = this.randomBoolean();
    return {
      question: `${useSin ? "sin" : "cos"} ${value.angle}° の値を求めましょう。`,
      answer: useSin ? value.sin : value.cos,
    };
  }
}
export const highTrigonometry: ProblemType = {
  id: "h1-trigonometry",
  level: "高校",
  grade: "高1",
  title: "三角比の値",
  description: "特別な角のsin・cosの値を求める高校1年生向けプリントです。",
  generator: new TrigonometryGenerator(),
};
