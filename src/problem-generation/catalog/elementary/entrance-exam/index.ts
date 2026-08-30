import type { ProblemType } from "../../../types";
import { entranceAge } from "./age";
import { entranceClockCalculation } from "./clockCalculation";
import { entranceConcentration } from "./concentration";
import { entranceCraneTurtle } from "./craneTurtle";
import { entranceCurrent } from "./current";
import { entranceMeeting } from "./meeting";
import { entrancePlantingTrees } from "./plantingTrees";
import { entrancePassing } from "./passing";
import { entranceProfitLoss } from "./profitLoss";
import { entranceSumDifference } from "./sumDifference";
import { entranceWork } from "./work";

export const entranceExamProblemTypes: readonly ProblemType[] = [
  entranceSumDifference,
  entranceCraneTurtle,
  entrancePlantingTrees,
  entranceAge,
  entranceMeeting,
  entranceCurrent,
  entranceWork,
  entranceProfitLoss,
  entranceConcentration,
  entrancePassing,
  entranceClockCalculation,
];
