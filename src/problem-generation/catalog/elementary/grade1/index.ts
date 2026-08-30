import type { ProblemType } from "../../../types";
import { grade1Addition } from "./addition";
import { legacyGrade1AddSubtract } from "./legacyAddSubtract";
import { grade1NumberComposition } from "./numberComposition";
import { grade1NumberOrder } from "./numberOrder";
import { grade1Subtraction } from "./subtraction";
import { grade1TimeReading } from "./timeReading";

export const grade1ProblemTypes: readonly ProblemType[] = [
  grade1NumberComposition,
  grade1NumberOrder,
  grade1Addition,
  grade1Subtraction,
  grade1TimeReading,
];

export const legacyGrade1ProblemTypes: readonly ProblemType[] = [
  legacyGrade1AddSubtract,
];
