import { useParams, useSearchParams } from "react-router-dom";
import ProblemTypeCard from "../components/ProblemTypeCard";
import ErrorPage from "../components/ErrorPage";
import FlowStepper from "../components/FlowStepper";
import {
  getProblemTypes,
  type Level,
  type ProblemTypeSummary,
} from "../problem-generation";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";
import { getLevelFromSlug, getLevelPath } from "../seoRoutes";
import "./ContentSelectionPage.css";

function ContentSelectionPage() {
  const [searchParams] = useSearchParams();
  const { levelSlug } = useParams();
  // /content-select?level=... は既存URLとの互換用。正規URLは /math/:levelSlug。
  const level = getLevelFromSlug(levelSlug) ?? searchParams.get("level");
  const types = level ? getProblemTypes(level) : [];

  useDocumentMetadata(
    level && types.length > 0
      ? {
          title: `${level}の算数・数学 問題プリント一覧 | math²ドリル`,
          description: `${level}向けの算数・数学の問題プリントを単元ごとに選んで作成できます。`,
          canonicalPath: getLevelPath(level as Level),
          breadcrumbs: [
            { name: "数学", path: "/" },
            { name: level, path: getLevelPath(level as Level) },
          ],
        }
      : undefined,
  );

  if (!level) {
    return (
      <ErrorPage
        reason="missing-level"
        title="学年区分が指定されていません"
        message="学年区分を選び直してください。"
      />
    );
  }

  if (types.length === 0) {
    return (
      <ErrorPage
        reason="no-types-for-level"
        title="該当する内容がありません"
        message={`「${level}」に対応する問題がまだ用意されていません。`}
      />
    );
  }

  const groups = groupByGrade(types);

  return (
    <>
      <div className="sticky-page-header">
        <FlowStepper level={level as Level} current="level" />
        <h1 className="visually-hidden">
          内容を選んでください（{level}／{types.length}種類）
        </h1>
      </div>

      <div className="problem-type-groups">
        {groups.map(([grade, gradeTypes]) => (
          <section key={grade} className="problem-type-group">
            <h2>{grade}</h2>
            <div className="problem-type-grid">
              {gradeTypes.map((type) => (
                <ProblemTypeCard key={type.id} problemType={type} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function groupByGrade(
  types: ProblemTypeSummary[],
): [string, ProblemTypeSummary[]][] {
  const groups = new Map<string, ProblemTypeSummary[]>();

  for (const type of types) {
    const gradeTypes = groups.get(type.grade) ?? [];
    gradeTypes.push(type);
    groups.set(type.grade, gradeTypes);
  }

  return [...groups.entries()];
}

export default ContentSelectionPage;
