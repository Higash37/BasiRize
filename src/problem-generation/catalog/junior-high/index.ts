import type { ProblemType } from "../../types";
import { juniorLinearFunction } from "./linearFunction";
import { juniorDataRange } from "./dataRange";
import { juniorPrimeFactorization } from "./primeFactorization";
import { juniorProbability } from "./probability";
import { juniorProportion } from "./proportion";
import { juniorPythagorean } from "./pythagorean";
import { juniorQuadraticFunction } from "./quadraticFunction";
import { juniorSampleSurvey } from "./sampleSurvey";
export const juniorHighAdditionalProblemTypes: readonly ProblemType[] = [
  juniorPrimeFactorization,
  juniorProportion,
  juniorLinearFunction,
  juniorProbability,
  juniorPythagorean,
  juniorQuadraticFunction,
  juniorDataRange,
  juniorSampleSurvey,
];
