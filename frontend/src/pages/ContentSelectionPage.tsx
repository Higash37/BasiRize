import { useLocation, useNavigate } from "react-router-dom";
import SubjectCard from "../components/SubjectCard";
import { getProblemTypesForLevel, type Level } from "../utils/problemGenerator";

function ContentSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const level = location.state?.level as Level | undefined;

  if (!level) {
    return (
      <div>
        <h1>学年区分が選択されていません</h1>
        <button onClick={() => navigate("/grade-select")}>学年区分選択に戻る</button>
      </div>
    );
  }

  const problemTypes = getProblemTypesForLevel(level);

  return (
    <div>
      <h1>内容を選んでください（{level}）</h1>
      <div className="subject-grid">
        {problemTypes.map((type) => (
          <SubjectCard
            key={type.id}
            title={`${type.grade}：${type.title}`}
            icon={type.icon}
            onClick={() => navigate("/options", { state: { level, problemTypeId: type.id } })}
          />
        ))}
      </div>
    </div>
  );
}

export default ContentSelectionPage;
