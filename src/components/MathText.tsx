import { Fragment, type ReactNode } from "react";
import "./MathText.css";

type MathTextProps = { text: string };
const mathPattern = /(-?\d+)\/(\d+)|\^(-?\d+)/g;

function MathText({ text }: MathTextProps) {
  return text.split("\n").map((line, lineIndex) => (
    <Fragment key={`${line}-${lineIndex}`}>
      {lineIndex > 0 && <br />}
      {renderLine(line)}
    </Fragment>
  ));
}

function renderLine(line: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  for (const match of line.matchAll(mathPattern)) {
    const index = match.index;
    if (index > cursor) nodes.push(line.slice(cursor, index));
    if (match[1] !== undefined && match[2] !== undefined) {
      nodes.push(
        <span className="math-fraction" key={`${index}-${match[0]}`}>
          <span>{match[1]}</span>
          <span>{match[2]}</span>
        </span>,
      );
    } else {
      nodes.push(<sup key={`${index}-${match[0]}`}>{match[3]}</sup>);
    }
    cursor = index + match[0].length;
  }
  if (cursor < line.length) nodes.push(line.slice(cursor));
  return nodes;
}

export default MathText;
