import { describe, expect, it } from "vitest";
import { generateProblems, getProblemTypeById, getProblemTypes } from "./index";
import { factor, quadratic, signedTerm, withVariable } from "./polynomial";

describe("問題タイプ一覧", () => {
  it("Java版と同じ22種類を持つ", () => {
    expect(getProblemTypes()).toHaveLength(22);
    expect(getProblemTypes("小学校")).toHaveLength(12);
    expect(getProblemTypes("中学校")).toHaveLength(8);
    expect(getProblemTypes("高校")).toHaveLength(2);
  });

  it("存在しないIDは見つからない", () => {
    expect(getProblemTypeById("unknown")).toBeUndefined();
  });
});

describe("問題生成", () => {
  it("全問題タイプで重複しない10問を生成する", () => {
    for (const type of getProblemTypes()) {
      const problems = generateProblems(type.id, 10);
      expect(problems, type.id).toHaveLength(10);
      expect(
        new Set(problems.map((problem) => problem.question)).size,
        type.id,
      ).toBe(10);

      for (const problem of problems) {
        expect(problem.question.length, type.id).toBeGreaterThan(0);
        expect(problem.answer.length, type.id).toBeGreaterThan(0);
      }
    }
  });

  it.each([0, 201, 1.5])("問題数%sを拒否する", (count) => {
    expect(() => generateProblems("e1-add-sub", count)).toThrow(
      "問題数は1〜200の整数で指定してください",
    );
  });
});

describe("多項式の表示", () => {
  it("係数1・0・負数を数学の表記へ整える", () => {
    expect(quadratic(3, -4)).toBe("x² + 3x - 4");
    expect(quadratic(-1, 0)).toBe("x² - x");
    expect(factor(-5)).toBe("(x - 5)");
    expect(withVariable(1, "x")).toBe("x");
    expect(signedTerm(-1, "y")).toBe(" - y");
  });
});
