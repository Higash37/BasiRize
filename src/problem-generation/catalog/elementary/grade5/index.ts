import type { ProblemType } from "../../../types";
import { grade5Average } from "./average";
import { grade5Circumference } from "./circumference";
import { grade5DecimalCalculation } from "./decimalCalculation";
import { grade5Percentage } from "./percentage";
import { grade5Speed } from "./speed";
import { grade5TriangleArea } from "./triangleArea";
import { grade5UnitRate } from "./unitRate";
import { grade5Volume } from "./volume";

export const grade5AdditionalProblemTypes: readonly ProblemType[] = [
  grade5DecimalCalculation,
  grade5Average,
  grade5Percentage,
  grade5Speed,
  grade5TriangleArea,
  grade5Volume,
  grade5UnitRate,
  grade5Circumference,
];
