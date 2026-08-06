import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProblemTypeById, type Problem } from "../utils/problemGenerator";
import "./PreviewPage.css";

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const problemTypeId = location.state?.problemTypeId as string | undefined;
  const pageCount = (location.state?.pageCount as number | undefined) ?? 1;
  const questionsPerPage = (location.state?.questionsPerPage as number | undefined) ?? 10;
  const includeAnswers = (location.state?.includeAnswers as boolean | undefined) ?? true;
  const problemType = problemTypeId ? getProblemTypeById(problemTypeId) : undefined;

  // 印刷プレビューを開くたびに毎回違う問題にならないよう、
  // 同じ表示中は同じ問題を保つ(useMemoで固定する)。
  const problems: Problem[] = useMemo(() => {
    if (!problemType) return [];
    return problemType.generate(pageCount * questionsPerPage);
  }, [problemType, pageCount, questionsPerPage]);

  const pages = useMemo(() => chunk(problems, questionsPerPage), [problems, questionsPerPage]);

  if (!problemType) {
    return (
      <div>
        <h1>内容が選択されていません</h1>
        <button onClick={() => navigate("/grade-select")}>学年区分選択に戻る</button>
      </div>
    );
  }

  return (
    <div>
      <div className="preview-toolbar no-print">
        <button onClick={() => window.print()}>印刷 / PDF保存</button>
      </div>

      {pages.map((pageProblems, pageIndex) => (
        <div key={`question-${pageIndex}`} className={pageIndex === 0 ? "page" : "page page-break"}>
          <div className="page-header">
            <div className="page-title">
              {problemType.title}
              {pages.length > 1 ? `（${pageIndex + 1}/${pages.length}）` : ""}
            </div>
            <div className="page-info">
              <div className="page-info-row">
                <span className="page-info-label">日付</span>
                <span className="page-info-line">　　　年　　　月　　　日</span>
              </div>
              <div className="page-info-row">
                <span className="page-info-label">なまえ</span>
                <span className="page-info-line"></span>
              </div>
              <div className="page-info-row">
                <span className="page-info-label">とくてん</span>
                <span className="page-info-line page-info-score">　　　／ {pageProblems.length}もん</span>
              </div>
            </div>
          </div>

          <ol className="problems">
            {pageProblems.map((problem, index) => (
              <li key={index}>{problem.question}</li>
            ))}
          </ol>
        </div>
      ))}

      {includeAnswers &&
        pages.map((pageProblems, pageIndex) => (
          <div key={`answer-${pageIndex}`} className="page page-break">
            <div className="page-header">
              <div className="page-title">
                解答{pages.length > 1 ? `（${pageIndex + 1}/${pages.length}）` : ""}
              </div>
            </div>
            <ol className="problems">
              {pageProblems.map((problem, index) => (
                <li key={index}>{problem.answer}</li>
              ))}
            </ol>
          </div>
        ))}

      <div className="preview-toolbar no-print">
        <button onClick={() => navigate("/")}>最初の画面に戻る</button>
      </div>
    </div>
  );
}

export default PreviewPage;
