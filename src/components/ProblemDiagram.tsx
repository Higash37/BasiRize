import type { ProblemDiagram as ProblemDiagramData } from "../problem-generation";
import "./ProblemDiagram.css";

type ProblemDiagramProps = {
  diagram: ProblemDiagramData;
};

function ProblemDiagram({ diagram }: ProblemDiagramProps) {
  switch (diagram.kind) {
    case "clock":
      return <ClockDiagram hour={diagram.hour} minute={diagram.minute} />;
    case "shape":
      return <ShapeDiagram shape={diagram.shape} rotation={diagram.rotation} />;
    case "bar-chart":
      return (
        <BarChartDiagram labels={diagram.labels} values={diagram.values} />
      );
    case "circle":
      return <CircleDiagram radius={diagram.radius} unit={diagram.unit} />;
    case "tape":
      return <TapeDiagram diagram={diagram} />;
    case "point-line":
      return <PointLineDiagram diagram={diagram} />;
    case "angle":
      return <AngleDiagram degrees={diagram.degrees} />;
    case "rectangle":
      return <RectangleDiagram diagram={diagram} />;
    case "line-chart":
      return <LineChartDiagram diagram={diagram} />;
    case "cuboid":
      return <CuboidDiagram diagram={diagram} />;
    case "symmetry":
      return <SymmetryDiagram mode={diagram.mode} variant={diagram.variant} />;
    case "proportion-graph":
      return <ProportionGraph slope={diagram.slope} maxX={diagram.maxX} />;
  }
}

function ClockDiagram({ hour, minute }: { hour: number; minute: number }) {
  const hourHand = handEnd((hour % 12) * 30 + minute * 0.5, 24);
  const minuteHand = handEnd(minute * 6, 34);

  return (
    <svg
      className="problem-diagram problem-clock"
      viewBox="0 0 100 100"
      role="img"
      aria-label="時刻を示す時計"
    >
      <circle className="problem-clock-face" cx="50" cy="50" r="46" />
      {Array.from({ length: 12 }, (_, index) => {
        const outer = handEnd(index * 30, 42);
        const inner = handEnd(index * 30, index % 3 === 0 ? 36 : 38);
        return (
          <line
            key={index}
            className="problem-clock-tick"
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
          />
        );
      })}
      <text x="50" y="18">
        12
      </text>
      <text x="84" y="54">
        3
      </text>
      <text x="50" y="89">
        6
      </text>
      <text x="16" y="54">
        9
      </text>
      <line
        className="problem-clock-hour"
        x1="50"
        y1="50"
        x2={hourHand.x}
        y2={hourHand.y}
      />
      <line
        className="problem-clock-minute"
        x1="50"
        y1="50"
        x2={minuteHand.x}
        y2={minuteHand.y}
      />
      <circle className="problem-clock-center" cx="50" cy="50" r="2.5" />
    </svg>
  );
}

function handEnd(degrees: number, length: number): { x: number; y: number } {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: 50 + Math.sin(radians) * length,
    y: 50 - Math.cos(radians) * length,
  };
}

type ShapeDiagramProps = {
  shape: Extract<ProblemDiagramData, { kind: "shape" }>["shape"];
  rotation: number;
};

const shapePoints: Record<ShapeDiagramProps["shape"], string> = {
  triangle: "50,14 87,82 13,82",
  quadrilateral: "21,20 82,13 88,74 14,84",
  rectangle: "13,26 87,26 87,74 13,74",
  square: "22,22 78,22 78,78 22,78",
};

function ShapeDiagram({ shape, rotation }: ShapeDiagramProps) {
  const labels: Record<ShapeDiagramProps["shape"], string> = {
    triangle: "三角形",
    quadrilateral: "四角形",
    rectangle: "長方形",
    square: "正方形",
  };

  return (
    <svg
      className="problem-diagram problem-shape"
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${labels[shape]}の図`}
    >
      <polygon
        className="problem-shape-polygon"
        points={shapePoints[shape]}
        transform={`rotate(${rotation} 50 50)`}
      />
    </svg>
  );
}

function BarChartDiagram({
  labels,
  values,
}: {
  labels: string[];
  values: number[];
}) {
  const maxValue = Math.max(5, ...values);
  const chartTop = 10;
  const chartBottom = 78;
  const chartHeight = chartBottom - chartTop;
  const barWidth = 12;
  const gap = 8;
  const startX = 27;

  return (
    <svg
      className="problem-diagram problem-bar-chart"
      viewBox="0 0 130 100"
      role="img"
      aria-label="数を表す棒グラフ"
    >
      {Array.from({ length: maxValue + 1 }, (_, value) => {
        const y = chartBottom - (value / maxValue) * chartHeight;
        return (
          <g key={value}>
            <line
              className="problem-chart-grid"
              x1="20"
              y1={y}
              x2="124"
              y2={y}
            />
            <text className="problem-chart-axis-label" x="16" y={y + 2}>
              {value}
            </text>
          </g>
        );
      })}
      <line
        className="problem-chart-axis"
        x1="20"
        y1={chartTop}
        x2="20"
        y2={chartBottom}
      />
      <line
        className="problem-chart-axis"
        x1="20"
        y1={chartBottom}
        x2="124"
        y2={chartBottom}
      />
      {values.map((value, index) => {
        const x = startX + index * (barWidth + gap);
        const height = (value / maxValue) * chartHeight;
        return (
          <g key={`${labels[index]}-${index}`}>
            <rect
              className="problem-chart-bar"
              x={x}
              y={chartBottom - height}
              width={barWidth}
              height={height}
            />
            <text className="problem-chart-label" x={x + barWidth / 2} y="91">
              {labels[index]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function CircleDiagram({ radius, unit }: { radius: number; unit: "cm" }) {
  return (
    <svg
      className="problem-diagram problem-circle"
      viewBox="0 0 120 100"
      role="img"
      aria-label={`半径${radius}${unit}の円`}
    >
      <circle className="problem-circle-line" cx="55" cy="50" r="40" />
      <circle className="problem-circle-center" cx="55" cy="50" r="2" />
      <line className="problem-circle-radius" x1="55" y1="50" x2="95" y2="50" />
      <text className="problem-circle-label" x="75" y="44">
        {radius}
        {unit}
      </text>
    </svg>
  );
}

function TapeDiagram({
  diagram,
}: {
  diagram: Extract<ProblemDiagramData, { kind: "tape" }>;
}) {
  const maxRatio = Math.max(diagram.upperRatio, diagram.lowerRatio);
  const upperWidth = 80 * (diagram.upperRatio / maxRatio);
  const lowerWidth = 80 * (diagram.lowerRatio / maxRatio);

  return (
    <svg
      className="problem-diagram problem-tape"
      viewBox="0 0 130 78"
      role="img"
      aria-label={`${diagram.upperLabel}と${diagram.lowerLabel}の関係を表す線分図`}
    >
      <text className="problem-tape-name" x="22" y="20">
        {diagram.upperLabel}
      </text>
      <rect
        className="problem-tape-bar"
        x="42"
        y="9"
        width={upperWidth}
        height="18"
      />
      <text className="problem-tape-name" x="22" y="48">
        {diagram.lowerLabel}
      </text>
      <rect
        className="problem-tape-bar"
        x="42"
        y="37"
        width={lowerWidth}
        height="18"
      />
      {diagram.totalLabel && (
        <text className="problem-tape-note" x="82" y="71">
          合計 {diagram.totalLabel}
        </text>
      )}
      {diagram.differenceLabel && (
        <text className="problem-tape-note" x="108" y="35">
          差 {diagram.differenceLabel}
        </text>
      )}
    </svg>
  );
}

// 実際の点の数(答えの手がかりになりうる)は描かず、｢…｣で続きを示す
// 決まった見本だけを表示する。同じ間隔で並んでいるイメージだけを伝える
function PointLineDiagram({
  diagram,
}: {
  diagram: Extract<ProblemDiagramData, { kind: "point-line" }>;
}) {
  if (diagram.closed) {
    const dotAngles = [0, 0.16, 0.32].map(
      (turn) => turn * Math.PI * 2 - Math.PI / 2,
    );
    const ellipsisAngle = 0.62 * Math.PI * 2 - Math.PI / 2;
    return (
      <svg
        className="problem-diagram problem-point-line"
        viewBox="0 0 120 90"
        role="img"
        aria-label="同じ間隔で点を置いた輪（点の数は答えとは無関係です）"
      >
        <circle className="problem-point-path" cx="60" cy="43" r="32" />
        {dotAngles.map((angle, index) => (
          <circle
            key={index}
            className="problem-point-dot"
            cx={60 + Math.cos(angle) * 32}
            cy={43 + Math.sin(angle) * 32}
            r="3"
          />
        ))}
        <text
          className="problem-point-ellipsis"
          x={60 + Math.cos(ellipsisAngle) * 32}
          y={43 + Math.sin(ellipsisAngle) * 32 + 3}
        >
          ⋯
        </text>
        <text className="problem-point-label" x="60" y="86">
          間隔 {diagram.intervalLabel}
        </text>
      </svg>
    );
  }

  return (
    <svg
      className="problem-diagram problem-point-line"
      viewBox="0 0 120 58"
      role="img"
      aria-label="同じ間隔で点を置いた直線（点の数は答えとは無関係です）"
    >
      <line className="problem-point-path" x1="12" y1="25" x2="108" y2="25" />
      <circle className="problem-point-dot" cx="12" cy="25" r="3" />
      <circle className="problem-point-dot" cx="36" cy="25" r="3" />
      <text className="problem-point-ellipsis" x="66" y="29">
        ⋯
      </text>
      <circle className="problem-point-dot" cx="108" cy="25" r="3" />
      <text className="problem-point-label" x="60" y="51">
        間隔 {diagram.intervalLabel}
      </text>
    </svg>
  );
}

function AngleDiagram({ degrees }: { degrees: number }) {
  const radians = (degrees * Math.PI) / 180;
  const endX = 24 + Math.cos(-radians) * 70;
  const endY = 76 + Math.sin(-radians) * 70;

  return (
    <svg
      className="problem-diagram problem-angle"
      viewBox="0 0 120 90"
      role="img"
      aria-label="角度を求める角の図"
    >
      <line className="problem-angle-line" x1="24" y1="76" x2="106" y2="76" />
      <line
        className="problem-angle-line"
        x1="24"
        y1="76"
        x2={endX}
        y2={endY}
      />
      <path
        className="problem-angle-arc"
        d={`M 47 76 A 23 23 0 0 0 ${24 + Math.cos(-radians) * 23} ${76 + Math.sin(-radians) * 23}`}
      />
      <text className="problem-angle-label" x="49" y="62">
        ?°
      </text>
    </svg>
  );
}

function RectangleDiagram({
  diagram,
}: {
  diagram: Extract<ProblemDiagramData, { kind: "rectangle" }>;
}) {
  const scale = Math.min(88 / diagram.width, 58 / diagram.height);
  const renderedWidth = diagram.width * scale;
  const renderedHeight = diagram.height * scale;
  const x = 66 - renderedWidth / 2;
  const y = 43 - renderedHeight / 2;

  return (
    <svg
      className="problem-diagram problem-rectangle"
      viewBox="0 0 130 90"
      role="img"
      aria-label={`たて${diagram.height}${diagram.unit}、横${diagram.width}${diagram.unit}の長方形`}
    >
      <rect
        className="problem-rectangle-shape"
        x={x}
        y={y}
        width={renderedWidth}
        height={renderedHeight}
      />
      <text className="problem-rectangle-label" x="66" y="86">
        {diagram.width}
        {diagram.unit}
      </text>
      <text
        className="problem-rectangle-label"
        x="12"
        y="43"
        transform="rotate(-90 12 43)"
      >
        {diagram.height}
        {diagram.unit}
      </text>
    </svg>
  );
}

function LineChartDiagram({
  diagram,
}: {
  diagram: Extract<ProblemDiagramData, { kind: "line-chart" }>;
}) {
  const maxValue = Math.max(1, ...diagram.values);
  const points = diagram.values
    .map((value, index) => {
      const x = 24 + (index * 88) / Math.max(1, diagram.values.length - 1);
      const y = 72 - (value / maxValue) * 54;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      className="problem-diagram problem-line-chart"
      viewBox="0 0 130 95"
      role="img"
      aria-label="値の変化を表す折れ線グラフ"
    >
      <line className="problem-chart-axis" x1="20" y1="12" x2="20" y2="72" />
      <line className="problem-chart-axis" x1="20" y1="72" x2="118" y2="72" />
      <polyline className="problem-line-chart-line" points={points} />
      {diagram.values.map((value, index) => {
        const x = 24 + (index * 88) / Math.max(1, diagram.values.length - 1);
        const y = 72 - (value / maxValue) * 54;
        return (
          <g key={`${diagram.labels[index]}-${index}`}>
            <circle
              className="problem-line-chart-point"
              cx={x}
              cy={y}
              r="2.5"
            />
            <text className="problem-chart-label" x={x} y="85">
              {diagram.labels[index]}
            </text>
            <text className="problem-chart-axis-label" x={x} y={y - 5}>
              {value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function CuboidDiagram({
  diagram,
}: {
  diagram: Extract<ProblemDiagramData, { kind: "cuboid" }>;
}) {
  return (
    <svg
      className="problem-diagram problem-cuboid"
      viewBox="0 0 140 105"
      role="img"
      aria-label={`縦${diagram.height}${diagram.unit}、横${diagram.width}${diagram.unit}、奥行き${diagram.depth}${diagram.unit}の直方体`}
    >
      <rect
        className="problem-cuboid-line"
        x="20"
        y="31"
        width="78"
        height="52"
      />
      <path
        className="problem-cuboid-line"
        d="M20 31 L43 14 H121 V66 L98 83 M98 31 L121 14 M98 83 L121 66"
      />
      <text className="problem-cuboid-label" x="59" y="98">
        横 {diagram.width}
        {diagram.unit}
      </text>
      <text
        className="problem-cuboid-label"
        x="14"
        y="58"
        transform="rotate(-90 14 58)"
      >
        縦 {diagram.height}
        {diagram.unit}
      </text>
      <text className="problem-cuboid-label" x="115" y="82">
        奥行 {diagram.depth}
        {diagram.unit}
      </text>
    </svg>
  );
}

function SymmetryDiagram({
  mode,
  variant,
}: {
  mode: "line" | "point";
  variant: number;
}) {
  const inset = 8 + (variant % 4) * 3;
  const points =
    mode === "line"
      ? `60,10 ${100 - inset},34 91,80 60,68 29,80 ${inset},34`
      : `25,14 61,14 61,38 101,38 95,80 59,80 59,56 19,56`;
  return (
    <svg
      className="problem-diagram problem-symmetry"
      viewBox="0 0 120 92"
      role="img"
      aria-label="対称性を調べる図形"
    >
      <polygon
        className="problem-symmetry-shape"
        points={points}
        transform={
          mode === "point" ? `rotate(${(variant % 3) * 15} 60 47)` : undefined
        }
      />
      {mode === "line" && (
        <line
          className="problem-symmetry-axis"
          x1="60"
          y1="5"
          x2="60"
          y2="87"
        />
      )}
      {mode === "point" && (
        <circle className="problem-symmetry-center" cx="60" cy="47" r="2.5" />
      )}
    </svg>
  );
}

function ProportionGraph({ slope, maxX }: { slope: number; maxX: number }) {
  const endX = 108;
  const endY = 76 - 58;
  return (
    <svg
      className="problem-diagram problem-proportion-graph"
      viewBox="0 0 125 95"
      role="img"
      aria-label={`yがxの${slope}倍になる比例のグラフ`}
    >
      <line className="problem-chart-axis" x1="18" y1="76" x2="115" y2="76" />
      <line className="problem-chart-axis" x1="18" y1="82" x2="18" y2="10" />
      <line
        className="problem-proportion-line"
        x1="18"
        y1="76"
        x2={endX}
        y2={endY}
      />
      <text className="problem-chart-label" x="110" y="89">
        x
      </text>
      <text className="problem-chart-label" x="8" y="14">
        y
      </text>
      <text className="problem-chart-label" x="108" y="72">
        {maxX}
      </text>
      <text className="problem-chart-label" x="12" y="20">
        {slope * maxX}
      </text>
      <text className="problem-chart-label" x="30" y="18">
        y={slope}x
      </text>
    </svg>
  );
}

export default ProblemDiagram;
