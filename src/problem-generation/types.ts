export type Problem = {
  question: string;
  answer: string;
};

export type Level = "小学校" | "中学校" | "高校";

export type ProblemTypeSummary = {
  id: string;
  level: Level;
  grade: string;
  title: string;
};

export type ProblemGenerator = {
  generate(count: number): Problem[];
};

export type ProblemType = ProblemTypeSummary & {
  generator: ProblemGenerator;
};
