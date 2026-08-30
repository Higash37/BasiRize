import {
  ExactDivisionGenerator,
  RemainderDivisionGenerator,
} from "../../../arithmetic";
import type { ProblemType } from "../../../types";

export const grade3ExactDivision: ProblemType = {
  id: "e3-exact-division",
  level: "小学校",
  grade: "小3",
  title: "わり切れるわり算",
  description:
    "九九を逆に使い、あまりなくわり切れるわり算を練習する小学3年生向けプリントです。",
  generator: new ExactDivisionGenerator(Math.random, 9, 9),
};

export const grade3RemainderDivision: ProblemType = {
  id: "e3-remainder-division",
  level: "小学校",
  grade: "小3",
  title: "あまりのあるわり算",
  description:
    "商とあまりを求め、あまりがわる数より小さくなることを身につける小学3年生向けプリントです。",
  generator: new RemainderDivisionGenerator(Math.random, 9, 9),
};
