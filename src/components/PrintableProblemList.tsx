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

function PrintableProblemList({
  problems,
  field,
  compact = false,
  onOverflowChange,
}: PrintableProblemListProps) {
  const listRef = useRef<HTMLOListElement>(null);
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
  }, [field, initialLayout, problems]);

  const style: ProblemListStyle = {
    "--problem-columns": layout.columns,
    "--problem-font-size": `${layout.fontSize}px`,
    "--problem-line-height": layout.lineHeight,
    "--problem-diagram-height": `${layout.diagramHeight}px`,
  };

  return (
    <ol
      ref={listRef}
      className={`sheet-problems${hasDiagrams ? " sheet-problems-with-diagrams" : ""}`}
      style={style}
    >
      {problems.map((problem, index) => (
        <li key={index}>
          <span className="sheet-problem-content">
            <MathText text={problem[field]} />
            {field === "question" && problem.diagram && (
              <ProblemDiagram diagram={problem.diagram} />
            )}
          </span>
        </li>
      ))}
    </ol>
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
  list: HTMLOListElement,
  layout: Layout,
): { layout: Layout; overflowing: boolean } {
  const sheet = list.closest<HTMLElement>(".sheet");
  if (!sheet) {
    return { layout, overflowing: false };
  }

  let fitted = layout;
  while (
    sheet.scrollHeight > sheet.clientHeight + 1 &&
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

  const overflowing = sheet.scrollHeight > sheet.clientHeight + 1;
  sheet.classList.toggle("sheet-overflowing", overflowing);
  return { layout: fitted, overflowing };
}

function applyLayoutVariables(list: HTMLOListElement, layout: Layout): void {
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
