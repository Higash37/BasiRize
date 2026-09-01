import { Link, useParams, useSearchParams } from "react-router-dom";
import ProblemTypeCard from "../components/ProblemTypeCard";
import ErrorPage from "../components/ErrorPage";
import FlowStepper from "../components/FlowStepper";
import {
  getProblemTypes,
  type Level,
  type ProblemTypeSummary,
} from "../problem-generation";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";
import {
  getLevelFromSlug,
  getLevelPath,
  getLevelSeoContent,
  getGradeFromSlug,
  getGradePath,
  getGradeSeoContent,
} from "../seoRoutes";
import "./ContentSelectionPage.css";

function ContentSelectionPage() {
  const [searchParams] = useSearchParams();
  const { levelSlug, gradeSlug } = useParams();
  // /content-select?level=... は既存URLとの互換用。正規URLは /math/:levelSlug。
  const level = getLevelFromSlug(levelSlug) ?? searchParams.get("level");
  const selectedGrade = level
    ? getGradeFromSlug(level as Level, gradeSlug)
    : undefined;
  const allTypes = level ? getProblemTypes(level) : [];
  const types = gradeSlug
    ? selectedGrade
      ? allTypes.filter((type) => type.grade === selectedGrade)
      : []
    : allTypes;
  const seoContent =
    level && types.length > 0
      ? selectedGrade
        ? getGradeSeoContent(
            level as Level,
            selectedGrade,
            types.map((type) => type.title),
          )
        : getLevelSeoContent(level as Level)
      : undefined;

  useDocumentMetadata(
    level && seoContent
      ? {
          title: seoContent.title,
          description: seoContent.description,
          canonicalPath: selectedGrade
            ? getGradePath(level as Level, selectedGrade)
            : getLevelPath(level as Level),
          breadcrumbs: selectedGrade
            ? [
                { name: "数学", path: "/" },
                { name: level, path: getLevelPath(level as Level) },
                {
                  name: selectedGrade,
                  path: getGradePath(level as Level, selectedGrade),
                },
              ]
            : [
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

  if (gradeSlug && !selectedGrade) {
    return (
      <ErrorPage
        reason="grade-not-found"
        title="学年が見つかりません"
        message="学年を選び直してください。"
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
      </div>

      <div className="page-intro">
        <h1>{seoContent?.heading}</h1>
        <p>
          {seoContent?.introduction} 現在{types.length}種類から選べます。
        </p>
      </div>

      <div className="problem-type-groups">
        {groups.map(([grade, gradeTypes]) => (
          <section key={grade} className="problem-type-group">
            <h2>{grade}</h2>
            {!selectedGrade && (
              <Link
                className="problem-type-grade-link"
                to={getGradePath(level as Level, grade)}
              >
                {grade}のプリント一覧を見る
              </Link>
            )}
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
