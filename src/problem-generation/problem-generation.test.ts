import { describe, expect, it } from "vitest";
import { generateProblems, getProblemTypeById, getProblemTypes } from "./index";
import { factor, quadratic, signedTerm, withVariable } from "./polynomial";

describe("問題タイプ一覧", () => {
  it("登録済みの100種類を学校区分ごとに取得できる", () => {
    expect(getProblemTypes()).toHaveLength(100);
    expect(getProblemTypes("小学校")).toHaveLength(65);
    expect(getProblemTypes("中学校")).toHaveLength(16);
    expect(getProblemTypes("高校")).toHaveLength(19);
  });

  it("時計問題には有効な時刻の図形データが含まれる", () => {
    const problems = generateProblems("e1-time-reading", 10);

    for (const problem of problems) {
      expect(problem.diagram?.kind).toBe("clock");
      if (problem.diagram?.kind === "clock") {
        expect(problem.diagram.hour).toBeGreaterThanOrEqual(1);
        expect(problem.diagram.hour).toBeLessThanOrEqual(12);
        expect(problem.diagram.minute).toBeGreaterThanOrEqual(0);
        expect(problem.diagram.minute).toBeLessThan(60);
      }
    }
  });

  it("旧URLの小学1年たし算・ひき算も引き続き利用できる", () => {
    expect(getProblemTypeById("e1-add-sub")?.title).toBe(
      "たし算・ひき算（1桁）",
    );
  });

  it("旧URLの小学2年たし算・ひき算も引き続き利用できる", () => {
    expect(getProblemTypeById("e2-add-sub-carry")?.title).toBe(
      "たし算・ひき算（2桁）",
    );
  });

  it("小学2年の図形問題には有効な図形データが含まれる", () => {
    const problems = generateProblems("e2-shapes", 10);

    for (const problem of problems) {
      expect(problem.diagram?.kind).toBe("shape");
      if (problem.diagram?.kind === "shape") {
        expect(problem.diagram.rotation).toBeGreaterThanOrEqual(0);
        expect(problem.diagram.rotation).toBeLessThan(60);
      }
    }
  });

  it("小学2年の棒グラフはラベルと値の個数が一致する", () => {
    const problems = generateProblems("e2-bar-graph", 10);

    for (const problem of problems) {
      expect(problem.diagram?.kind).toBe("bar-chart");
      if (problem.diagram?.kind === "bar-chart") {
        expect(problem.diagram.labels).toHaveLength(4);
        expect(problem.diagram.values).toHaveLength(4);
        expect(problem.diagram.values.every((value) => value >= 1)).toBe(true);
      }
    }
  });

  it("小学2年のたし算は必ず繰り上がり、ひき算は必ず繰り下がる", () => {
    const additions = generateProblems("e2-addition", 20);
    const subtractions = generateProblems("e2-subtraction", 20);

    for (const problem of additions) {
      const [left, right] = problem.question.match(/\d+/g)?.map(Number) ?? [];
      expect(left).toBeDefined();
      expect(right).toBeDefined();
      expect((left! % 10) + (right! % 10)).toBeGreaterThanOrEqual(10);
      expect(problem.answer).toBe(String(left! + right!));
    }

    for (const problem of subtractions) {
      const [left, right] = problem.question.match(/\d+/g)?.map(Number) ?? [];
      expect(left).toBeDefined();
      expect(right).toBeDefined();
      expect(left! % 10).toBeLessThan(right! % 10);
      expect(problem.answer).toBe(String(left! - right!));
    }
  });

  it("小学3年の円は半径の2倍を直径として答える", () => {
    const problems = generateProblems("e3-circle", 10);

    for (const problem of problems) {
      expect(problem.diagram?.kind).toBe("circle");
      if (problem.diagram?.kind === "circle") {
        expect(problem.answer).toBe(`${problem.diagram.radius * 2}cm`);
      }
    }
  });

  it("速さの問題は速さ・道のり・時間の関係が成立する", () => {
    const problems = generateProblems("e5-speed", 30);

    for (const problem of problems) {
      const numbers = problem.question.match(/\d+/g)?.map(Number) ?? [];
      expect(numbers.length).toBeGreaterThanOrEqual(2);
      expect(problem.answer).toMatch(/\d+/);
    }
  });

  it("和差算は和と差の両方を満たす", () => {
    const problems = generateProblems("exam-sum-difference", 20);

    for (const problem of problems) {
      const values = problem.question.match(/和は(\d+)、差は(\d+)/);
      expect(values).not.toBeNull();
      const total = Number(values?.[1]);
      const difference = Number(values?.[2]);
      const larger = Number(problem.answer);
      const smaller = total - larger;
      expect(larger + smaller).toBe(total);
      expect(larger - smaller).toBe(difference);
      expect(problem.diagram?.kind).toBe("tape");
    }
  });

  it("植木算は直線と輪で端の数を区別する", () => {
    const problems = generateProblems("exam-planting-trees", 20);

    for (const problem of problems) {
      expect(problem.diagram?.kind).toBe("point-line");
      if (problem.diagram?.kind === "point-line") {
        expect(problem.answer).toBe(`${problem.diagram.pointCount}本`);
      }
    }
  });

  it("時計算の答えは長針と短針の小さい方の角になる", () => {
    const problems = generateProblems("exam-clock", 20);

    for (const problem of problems) {
      expect(problem.diagram?.kind).toBe("clock");
      if (problem.diagram?.kind === "clock") {
        const rawAngle = Math.abs(
          (problem.diagram.hour % 12) * 30 - problem.diagram.minute * 5.5,
        );
        const expected = Math.min(rawAngle, 360 - rawAngle);
        expect(Number(problem.answer.replace("度", ""))).toBe(expected);
      }
    }
  });

  it("小学4年の面積は図の縦と横の積になる", () => {
    const problems = generateProblems("e4-area", 20);

    for (const problem of problems) {
      expect(problem.diagram?.kind).toBe("rectangle");
      if (problem.diagram?.kind === "rectangle") {
        expect(problem.answer).toBe(
          `${problem.diagram.width * problem.diagram.height}cm²`,
        );
      }
    }
  });

  it("小学6年の比例グラフはyがxの決まった倍数になる", () => {
    const problems = generateProblems("e6-proportion-graph", 20);
    for (const problem of problems) {
      expect(problem.diagram?.kind).toBe("proportion-graph");
      if (problem.diagram?.kind === "proportion-graph") {
        expect(problem.answer).toBe(
          String(problem.diagram.slope * problem.diagram.maxX),
        );
      }
    }
  });

  it("折れ線グラフはラベルと値の個数が一致する", () => {
    const problems = generateProblems("e4-line-graph", 20);
    for (const problem of problems) {
      expect(problem.diagram?.kind).toBe("line-chart");
      if (problem.diagram?.kind === "line-chart") {
        expect(problem.diagram.labels.length).toBe(
          problem.diagram.values.length,
        );
      }
    }
  });

  it("対称図形の答えは図形データの種類と一致する", () => {
    const problems = generateProblems("e6-symmetry", 20);
    for (const problem of problems) {
      expect(problem.diagram?.kind).toBe("symmetry");
      if (problem.diagram?.kind === "symmetry") {
        expect(problem.answer).toBe(
          problem.diagram.mode === "line" ? "線対称" : "点対称",
        );
      }
    }
  });

  it("存在しないIDは見つからない", () => {
    expect(getProblemTypeById("unknown")).toBeUndefined();
  });

  it("図付き単元は1ページ6問、通常単元は10問を推奨する", () => {
    expect(getProblemTypeById("e4-area")?.recommendedQuestionsPerPage).toBe(6);
    expect(getProblemTypeById("e5-speed")?.recommendedQuestionsPerPage).toBe(
      10,
    );
  });

  it("小学4年生までの問題文は学習用のひらがな表記にする", () => {
    const [problem] = generateProblems("e4-area", 1);
    expect(problem?.question).toContain("ず");
    expect(problem?.question).toContain("ちょうほうけい");
    expect(problem?.question).toContain("めんせき");
  });
});

describe("問題生成", () => {
  it("全問題タイプで重複しない10問を生成する", () => {
    for (const type of getProblemTypes()) {
      const problems = generateProblems(type.id, 10);
      expect(problems, type.id).toHaveLength(10);
      expect(
        new Set(
          problems.map((problem) =>
            JSON.stringify({
              question: problem.question,
              diagram: problem.diagram,
            }),
          ),
        ).size,
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
