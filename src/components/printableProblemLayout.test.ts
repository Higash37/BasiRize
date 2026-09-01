import { describe, expect, it } from "vitest";
import { splitIntoPrintableColumns } from "./printableProblemLayout";

describe("印刷用の列分割", () => {
  it("10問を読み順を保ったまま5問ずつ2列に分ける", () => {
    const columns = splitIntoPrintableColumns(
      Array.from({ length: 10 }, (_, index) => index + 1),
      2,
    );

    expect(columns).toEqual([
      { items: [1, 2, 3, 4, 5], startIndex: 0 },
      { items: [6, 7, 8, 9, 10], startIndex: 5 },
    ]);
  });

  it("端数がある場合は左側の列を1問多くする", () => {
    const columns = splitIntoPrintableColumns([1, 2, 3, 4, 5], 2);

    expect(columns).toEqual([
      { items: [1, 2, 3], startIndex: 0 },
      { items: [4, 5], startIndex: 3 },
    ]);
  });

  it("3列でも全問題を重複なく分割する", () => {
    const items = Array.from({ length: 41 }, (_, index) => index + 1);
    const columns = splitIntoPrintableColumns(items, 3);

    expect(columns.map((column) => column.items.length)).toEqual([14, 14, 13]);
    expect(columns.flatMap((column) => column.items)).toEqual(items);
    expect(columns.map((column) => column.startIndex)).toEqual([0, 14, 28]);
  });
});
