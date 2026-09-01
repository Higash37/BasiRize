import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { Problem } from "../problem-generation";
import ProblemDiagram from "./ProblemDiagram";
import MathText from "./MathText";
import { splitIntoPrintableColumns } from "./printableProblemLayout";

type PrintableProblemListProps = {
  problems: Problem[];
  field: "question" | "answer";
  compact?: boolean;
  // 用紙からはみ出しているかどうかが変わったときに呼ばれる
  onOverflowChange?: (overflowing: boolean) => void;
};

type ProblemListStyle = CSSProperties & {
  "--problem-columns": number;
  "--problem-font-size": string;
  "--problem-line-height": number;
  "--problem-diagram-height": string;
};

type Layout = {
  columns: number;
  fontSize: number;
  lineHeight: number;
  diagramHeight: number;
};

const MIN_FONT_SIZE = 16;
const MIN_DIAGRAM_HEIGHT = 52;
const COLUMN_GAP_MM = 16;
// 画面表示(高さ297mm指定)と実際の印刷(@pageのmarginで余白を作る方式)は
// 余白の作り方が違うため、フォントのレンダリング誤差で数px分ズレることがある。
// ぴったりで判定すると、列の最後の1問だけが次ページにあふれて白紙同然の
// ページができてしまうため、少し余裕を持たせて早めに縮小する。
const PRINT_FIT_SAFETY_MARGIN_PX = millimetersToPixels(2);

function PrintableProblemList({
  problems,
  field,
  compact = false,
  onOverflowChange,
}: PrintableProblemListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const hasDiagrams =
    field === "question" && problems.some((problem) => problem.diagram);
  const initialLayout = useMemo(
    () => getDensityLayout(problems.length, compact, hasDiagrams),
    [compact, hasDiagrams, problems.length],
  );
  const [layout, setLayout] = useState(initialLayout);

  // onOverflowChangeは親の再描画のたびに新しい関数になりうるため、依存配列には
  // 入れずrefで最新のものを参照する（毎回ResizeObserverを作り直さないため）
  const onOverflowChangeRef = useRef(onOverflowChange);
  useEffect(() => {
    onOverflowChangeRef.current = onOverflowChange;
  });
  const lastOverflowingRef = useRef<boolean | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    const updateLayout = () => {
      const measured = calculateLayout(
        list.clientWidth,
        problems.map((problem) => problem[field]),
        getComputedStyle(list).fontFamily,
        initialLayout,
      );
      applyLayoutVariables(list, measured);

      // 列数が変わる場合は、先にReactで列のDOMを組み直してから高さを測る。
      // 古い列構造のまま測ると、一時的な縦積みをはみ出しと誤判定してしまう。
      if (measured.columns !== layout.columns) {
        setLayout(measured);
        return;
      }

      const { layout: fitted, overflowing } = fitWithinSheet(list, measured);

      setLayout((current) =>
        isSameLayout(current, fitted) ? current : fitted,
      );

      if (lastOverflowingRef.current !== overflowing) {
        lastOverflowingRef.current = overflowing;
        onOverflowChangeRef.current?.(overflowing);
      }
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(list);
    return () => observer.disconnect();
  }, [field, initialLayout, layout.columns, problems]);

  const style: ProblemListStyle = {
    "--problem-columns": layout.columns,
    "--problem-font-size": `${layout.fontSize}px`,
    "--problem-line-height": layout.lineHeight,
    "--problem-diagram-height": `${layout.diagramHeight}px`,
  };

  const columns = splitIntoPrintableColumns(problems, layout.columns);

  return (
    <div
      ref={listRef}
      className={`sheet-problems${hasDiagrams ? " sheet-problems-with-diagrams" : ""}`}
      style={style}
    >
      {columns.map((column, columnIndex) => (
        <ol
          key={columnIndex}
          className="sheet-problems-column"
          start={column.startIndex + 1}
        >
          {column.items.map((problem, itemIndex) => {
            const problemNumber = column.startIndex + itemIndex + 1;
            return (
              <li key={problemNumber} data-problem-number={problemNumber}>
                <span className="sheet-problem-content">
                  <MathText text={problem[field]} />
                  {field === "question" && problem.diagram && (
                    <ProblemDiagram diagram={problem.diagram} />
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      ))}
    </div>
  );
}

function getDensityLayout(
  problemCount: number,
  compact: boolean,
  hasDiagrams: boolean,
): Layout {
  const adjustment = compact ? 2 : 0;
  const diagramHeight = hasDiagrams
    ? problemCount <= 10
      ? 120
      : problemCount <= 20
        ? 82
        : 62
    : 0;

  if (problemCount <= 10) {
    return {
      columns: 2,
      fontSize: 30 - adjustment,
      lineHeight: hasDiagrams ? 1.5 : 2.6,
      diagramHeight,
    };
  }
  if (problemCount <= 20) {
    return {
      columns: 2,
      fontSize: 26 - adjustment,
      lineHeight: hasDiagrams ? 1.4 : 2.1,
      diagramHeight,
    };
  }
  if (problemCount <= 30) {
    return {
      columns: 2,
      fontSize: 22 - adjustment,
      lineHeight: hasDiagrams ? 1.4 : 1.8,
      diagramHeight,
    };
  }
  if (problemCount <= 40) {
    return {
      columns: 2,
      fontSize: 18 - adjustment,
      lineHeight: hasDiagrams ? 1.4 : 1.65,
      diagramHeight,
    };
  }
  return {
    columns: 3,
    fontSize: MIN_FONT_SIZE,
    lineHeight: hasDiagrams ? 1.4 : 1.5,
    diagramHeight,
  };
}

function calculateLayout(
  availableWidth: number,
  texts: string[],
  fontFamily: string,
  density: Layout,
): Layout {
  if (availableWidth <= 0) {
    return density;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return density;
  }

  const gap = millimetersToPixels(COLUMN_GAP_MM);

  for (let columns = density.columns; columns >= 1; columns -= 1) {
    const columnWidth =
      (availableWidth - gap * Math.max(0, columns - 1)) / columns;

    for (
      let fontSize = density.fontSize;
      fontSize >= MIN_FONT_SIZE;
      fontSize -= 1
    ) {
      context.font = `${fontSize}px ${fontFamily}`;
      const markerWidth = fontSize * 2;
      const longestLine = getLongestLineWidth(context, texts);

      if (longestLine + markerWidth <= columnWidth) {
        return { ...density, columns, fontSize };
      }
    }
  }

  return { ...density, columns: 1, fontSize: MIN_FONT_SIZE };
}

function fitWithinSheet(
  list: HTMLElement,
  layout: Layout,
): { layout: Layout; overflowing: boolean } {
  const sheet = list.closest<HTMLElement>(".sheet");
  if (!sheet) {
    return { layout, overflowing: false };
  }

  // .sheetは画面表示用に高さを固定している(297mm)ため、中身がそれより
  // 短い間は sheet.scrollHeight が実寸ではなく.sheet自身の固定高をそのまま
  // 返してしまい(中身が箱より小さいときのブラウザの仕様)、あとどれだけ
  // 余裕があるか測れない。高さを固定していないlist自身の実寸(scrollHeight)を、
  // listの開始位置からsheet下端の余白を除いた残り高さと比べて判定する。
  const sheetBottomPadding = parseFloat(getComputedStyle(sheet).paddingBottom) || 0;
  const fitBudget =
    sheet.clientHeight -
    list.offsetTop -
    sheetBottomPadding -
    PRINT_FIT_SAFETY_MARGIN_PX;

  let fitted = layout;
  while (
    list.scrollHeight > fitBudget &&
    (fitted.fontSize > MIN_FONT_SIZE ||
      fitted.lineHeight > 1.4 ||
      fitted.diagramHeight > MIN_DIAGRAM_HEIGHT)
  ) {
    fitted = {
      ...fitted,
      fontSize: Math.max(MIN_FONT_SIZE, fitted.fontSize - 1),
      lineHeight: Math.max(1.4, fitted.lineHeight - 0.05),
      diagramHeight: Math.max(
        fitted.diagramHeight === 0 ? 0 : MIN_DIAGRAM_HEIGHT,
        fitted.diagramHeight - 4,
      ),
    };
    applyLayoutVariables(list, fitted);
  }

  const overflowing = list.scrollHeight > fitBudget;
  sheet.classList.toggle("sheet-overflowing", overflowing);
  return { layout: fitted, overflowing };
}

function applyLayoutVariables(list: HTMLElement, layout: Layout): void {
  list.style.setProperty("--problem-columns", String(layout.columns));
  list.style.setProperty("--problem-font-size", `${layout.fontSize}px`);
  list.style.setProperty("--problem-line-height", String(layout.lineHeight));
  list.style.setProperty(
    "--problem-diagram-height",
    `${layout.diagramHeight}px`,
  );
}

function getLongestLineWidth(
  context: CanvasRenderingContext2D,
  texts: string[],
): number {
  let longest = 0;

  for (const text of texts) {
    for (const line of text.split("\n")) {
      longest = Math.max(longest, context.measureText(line).width);
    }
  }

  return longest;
}

function millimetersToPixels(millimeters: number): number {
  return (millimeters * 96) / 25.4;
}

function isSameLayout(first: Layout, second: Layout): boolean {
  return (
    first.columns === second.columns &&
    first.fontSize === second.fontSize &&
    first.lineHeight === second.lineHeight &&
    first.diagramHeight === second.diagramHeight
  );
}

export default PrintableProblemList;
