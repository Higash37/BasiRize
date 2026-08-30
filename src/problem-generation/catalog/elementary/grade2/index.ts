import type { ProblemType } from "../../../types";
import { grade2Addition } from "./addition";
import { grade2BarGraph } from "./barGraph";
import { grade2CapacityUnits } from "./capacityUnits";
import { grade2ElapsedTime } from "./elapsedTime";
import { legacyGrade2AddSubtract } from "./legacyAddSubtract";
import { grade2LengthUnits } from "./lengthUnits";
import { grade2MultiplicationTable } from "./multiplicationTable";
import { grade2PlaceValue } from "./placeValue";
import { grade2Shapes } from "./shapes";
import { grade2SimpleFraction } from "./simpleFraction";
import { grade2Subtraction } from "./subtraction";

export const grade2ProblemTypes: readonly ProblemType[] = [
  grade2PlaceValue,
  grade2Addition,
  grade2Subtraction,
  grade2MultiplicationTable,
  grade2SimpleFraction,
  grade2LengthUnits,
  grade2CapacityUnits,
  grade2ElapsedTime,
  grade2Shapes,
  grade2BarGraph,
];

export const legacyGrade2ProblemTypes: readonly ProblemType[] = [
  legacyGrade2AddSubtract,
];
