import type { ProblemType } from "../../types";
import { highDifferentiation } from "./differentiation";
import { highCombinations } from "./combinations";
import { highDefiniteIntegral } from "./definiteIntegral";
import { highExponent } from "./exponent";
import { highGeometricSequence } from "./geometricSequence";
import { highInequality } from "./inequality";
import { highIntegration } from "./integration";
import { highLimit } from "./limit";
import { highQuadraticInequality } from "./quadraticInequality";
import { highLogarithm } from "./logarithm";
import { highSequence } from "./sequence";
import { highTrigonometry } from "./trigonometry";
import { highSets } from "./sets";
import { highSeriesSum } from "./seriesSum";
import { highTangentSlope } from "./tangentSlope";
import { highVariance } from "./variance";
import { highVectors } from "./vectors";
export const highSchoolAdditionalProblemTypes: readonly ProblemType[] = [
  highInequality,
  highTrigonometry,
  highExponent,
  highLogarithm,
  highSequence,
  highDifferentiation,
  highIntegration,
  highLimit,
  highSets,
  highQuadraticInequality,
  highVariance,
  highCombinations,
  highVectors,
  highSeriesSum,
  highTangentSlope,
  highDefiniteIntegral,
  highGeometricSequence,
];
