import { ProblemGenerator } from "../../../generator";
import type { Problem, ProblemDiagram, ProblemType } from "../../../types";

const shapes = [
  { shape: "triangle", answer: "三角形" },
  { shape: "quadrilateral", answer: "四角形" },
  { shape: "rectangle", answer: "長方形" },
  { shape: "square", answer: "正方形" },
] as const satisfies readonly {
  shape: Extract<ProblemDiagram, { kind: "shape" }>["shape"];
  answer: string;
}[];

class Grade2ShapesGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }

  protected generateProblem(): Problem {
    const selected = this.randomElement(shapes);
    const rotation = this.randomNumber(0, 11) * 5;

    return {
      question: "つぎの 形の 名前を かきましょう。",
      answer: selected.answer,
      diagram: { kind: "shape", shape: selected.shape, rotation },
    };
  }
}

export const grade2Shapes: ProblemType = {
  id: "e2-shapes",
  level: "小学校",
  grade: "小2",
  title: "三角形と四角形",
  description:
    "向きを変えて表示される三角形・四角形・長方形・正方形の名前を答える、小学2年生向け図形プリントです。",
  generator: new Grade2ShapesGenerator(),
};
