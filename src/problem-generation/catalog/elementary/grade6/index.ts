import type { ProblemType } from "../../../types";
import { grade6CircleArea } from "./circleArea";
import { grade6Combinations } from "./combinations";
import { grade6Data } from "./data";
import { grade6PrismVolume } from "./prismVolume";
import { grade6Proportion } from "./proportion";
import { grade6Ratio } from "./ratio";
import { grade6ProportionGraph } from "./proportionGraph";
import { grade6Symmetry } from "./symmetry";

export const grade6AdditionalProblemTypes: readonly ProblemType[] = [
  grade6Ratio,
  grade6Proportion,
  grade6CircleArea,
  grade6PrismVolume,
  grade6Combinations,
  grade6Symmetry,
  grade6ProportionGraph,
  grade6Data,
];
