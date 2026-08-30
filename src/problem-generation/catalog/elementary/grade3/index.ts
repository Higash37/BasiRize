import type { ProblemType } from "../../../types";
import { grade3BarGraph } from "./barGraph";
import { grade3Circle } from "./circle";
import { grade3Decimals } from "./decimals";
import { grade3ExactDivision, grade3RemainderDivision } from "./division";
import { grade3Fractions } from "./fractions";
import { grade3LargeNumbers } from "./largeNumbers";
import { grade3Measurement } from "./measurement";
import { grade3Multiplication } from "./multiplication";
import { grade3TimeUnits } from "./timeUnits";

export const grade3ProblemTypes: readonly ProblemType[] = [
  grade3LargeNumbers,
  grade3Multiplication,
  grade3ExactDivision,
  grade3RemainderDivision,
  grade3Decimals,
  grade3Fractions,
  grade3TimeUnits,
  grade3Measurement,
  grade3Circle,
  grade3BarGraph,
];
