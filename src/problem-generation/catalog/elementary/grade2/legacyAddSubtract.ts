import { ArithmeticGenerator } from "../../../arithmetic";
import { Operator } from "../../../operator";
import type { ProblemType } from "../../../types";

export const legacyGrade2AddSubtract: ProblemType = {
  id: "e2-add-sub-carry",
  level: "小学校",
  grade: "小2",
  title: "たし算・ひき算（2桁）",
  description:
    "以前のURLとの互換性を保つための、小学2年生向けたし算・ひき算プリントです。",
  generator: new ArithmeticGenerator(Math.random, {
    min: 10,
    max: 99,
    minTerms: 2,
    maxTerms: 2,
    operators: [Operator.ADD, Operator.SUBTRACT],
    allowNegative: false,
    maxAnswer: 200,
  }),
};
