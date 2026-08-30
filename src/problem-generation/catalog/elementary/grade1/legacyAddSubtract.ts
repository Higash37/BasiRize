import { ArithmeticGenerator } from "../../../arithmetic";
import { Operator } from "../../../operator";
import type { ProblemType } from "../../../types";

export const legacyGrade1AddSubtract: ProblemType = {
  id: "e1-add-sub",
  level: "小学校",
  grade: "小1",
  title: "たし算・ひき算（1桁）",
  description:
    "以前のURLとの互換性を保つための、小学1年生向けたし算・ひき算プリントです。",
  generator: new ArithmeticGenerator(Math.random, {
    min: 1,
    max: 9,
    minTerms: 2,
    maxTerms: 2,
    operators: [Operator.ADD, Operator.SUBTRACT],
    allowNegative: false,
    maxAnswer: 18,
  }),
};
