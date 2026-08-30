import { ProblemGenerator } from "../../generator";
import type { Problem, ProblemType } from "../../types";
class SampleSurveyGenerator extends ProblemGenerator {
  constructor() {
    super(Math.random);
  }
  protected generateProblem(): Problem {
    const sample = this.randomNumber(20, 100);
    const hits = this.randomNumber(1, sample - 1);
    const population = this.randomNumber(10, 100) * sample;
    const estimate = (population * hits) / sample;
    return {
      question: `${population}個の製品から${sample}個を無作為に調べ、${hits}個が不良品でした。全体の不良品を何個と推定できますか。`,
      answer: `約${estimate}個`,
    };
  }
}
export const juniorSampleSurvey: ProblemType = {
  id: "j3-sample-survey",
  level: "中学校",
  grade: "中3",
  title: "標本調査",
  description:
    "標本の割合から母集団の個数を推定する中学3年生向けプリントです。",
  generator: new SampleSurveyGenerator(),
};
