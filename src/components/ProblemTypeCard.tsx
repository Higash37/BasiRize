import { Link } from "react-router-dom";
import type { Level, ProblemTypeSummary } from "../problem-generation";
import { trackProblemTypeSelected } from "../analytics";
import { gradeCardImages } from "../data/cardImages.ts";
import "./ProblemTypeCard.css";

const gradeImageByLevel: Record<Level, string> = {
  小学校: gradeCardImages.elementary,
  中学校: gradeCardImages.juniorHigh,
  高校: gradeCardImages.highSchool,
};

type ProblemTypeCardProps = {
  problemType: ProblemTypeSummary;
};

function ProblemTypeCard({ problemType }: ProblemTypeCardProps) {
  return (
    <Link
      className="problem-type-card"
      to={`/problems/${problemType.id}`}
      onClick={() =>
        trackProblemTypeSelected({
          typeId: problemType.id,
          title: problemType.title,
          level: problemType.level,
          grade: problemType.grade,
        })
      }
    >
      <span className="problem-type-card-thumb">
        {/* 装飾画像。学年ごとの共通イラストなので alt は空 */}
        <img
          className="problem-type-card-image"
          src={gradeImageByLevel[problemType.level]}
          alt=""
        />
      </span>

      <span className="problem-type-card-body">
        <span className="problem-type-card-grade">{problemType.grade}</span>
        <h3 className="problem-type-card-title">{problemType.title}</h3>
      </span>
    </Link>
  );
}

export default ProblemTypeCard;
