export type Problem = {
  question: string;
  answer: string;
  diagram?: ProblemDiagram;
};

export type ProblemDiagram =
  | {
      kind: "clock";
      hour: number;
      minute: number;
    }
  | {
      kind: "shape";
      shape: "triangle" | "quadrilateral" | "rectangle" | "square";
      rotation: number;
    }
  | {
      kind: "bar-chart";
      labels: string[];
      values: number[];
    }
  | {
      kind: "circle";
      radius: number;
      unit: "cm";
    }
  | {
      kind: "tape";
      upperRatio: number;
      lowerRatio: number;
      upperLabel: string;
      lowerLabel: string;
      totalLabel?: string;
      differenceLabel?: string;
    }
  | {
      kind: "point-line";
      intervalLabel: string;
      closed: boolean;
    }
  | {
      kind: "angle";
      degrees: number;
    }
  | {
      kind: "rectangle";
      width: number;
      height: number;
      unit: "cm";
    }
  | {
      kind: "line-chart";
      labels: string[];
      values: number[];
    }
  | {
      kind: "cuboid";
      width: number;
      depth: number;
      height: number;
      unit: "cm";
    }
  | {
      kind: "symmetry";
      mode: "line" | "point";
      variant: number;
    }
  | {
      kind: "proportion-graph";
      slope: number;
      maxX: number;
    };

export type Level = "小学校" | "中学校" | "高校";

export type ProblemTypeSummary = {
  id: string;
  level: Level;
  grade: string;
  title: string;
  description: string;
  recommendedQuestionsPerPage?: number;
};

export type ProblemGenerator = {
  generate(count: number): Problem[];
};

export type ProblemType = ProblemTypeSummary & {
  generator: ProblemGenerator;
};
