import type {
  Problem,
  ProblemGenerator as ProblemGeneratorType,
} from "./types";

export type RandomSource = () => number;

export abstract class ProblemGenerator implements ProblemGeneratorType {
  private readonly random: RandomSource;

  protected constructor(random: RandomSource) {
    this.random = random;
  }

  protected abstract generateProblem(): Problem;

  generate(count: number): Problem[] {
    const problems: Problem[] = [];
    const seen = new Set<string>();
    const limit = count * 100;

    for (
      let attempt = 0;
      attempt < limit && problems.length < count;
      attempt += 1
    ) {
      const problem = this.generateProblem();
      if (!seen.has(problem.question)) {
        seen.add(problem.question);
        problems.push(problem);
      }
    }

    if (problems.length < count) {
      throw new Error(
        `${this.constructor.name}: 重複しない問題を${count}問作れませんでした` +
          `（${problems.length}問まで）`,
      );
    }

    return problems;
  }

  protected randomNumber(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  protected randomNonZero(min: number, max: number): number {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const value = this.randomNumber(min, max);
      if (value !== 0) {
        return value;
      }
    }
    throw new Error(`0以外の数を作れませんでした: ${min}〜${max}`);
  }

  protected randomBoolean(): boolean {
    return this.random() < 0.5;
  }

  protected randomElement<T>(values: readonly T[]): T {
    const value = values[this.randomNumber(0, values.length - 1)];
    if (value === undefined) {
      throw new Error("空の選択肢から値を選べません");
    }
    return value;
  }
}
