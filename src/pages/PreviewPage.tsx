import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  generateProblems,
  getProblemTypeById,
  type Problem,
  type ProblemTypeSummary,
} from "../problem-generation";
import "./PreviewPage.css";
import { trackWorksheetGenerated } from "../analytics";

// URLから来た文字列を正の整数に直す。おかしければ既定値を返す
function toPositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

// 問題の配列を、1枚あたりの問題数で区切る
function splitIntoPages(problems: Problem[], perPage: number): Problem[][] {
  const pages: Problem[][] = [];
  for (let i = 0; i < problems.length; i += perPage) {
    pages.push(problems.slice(i, i + perPage));
  }
  return pages;
}

function PreviewPage() {
  const [searchParams] = useSearchParams();

  const typeId = searchParams.get("typeId");
  const pageCount = toPositiveInt(searchParams.get("pages"), 1);
  const perPage = toPositiveInt(searchParams.get("perPage"), 10);
  const includeAnswers = searchParams.get("answers") === "true";

  const generation = useMemo(() => {
    if (!typeId) {
      return { status: "missing" } as const;
    }
    try {
      const found = getProblemTypeById(typeId);
      if (!found) {
        throw new Error(`該当する問題タイプがありません: ${typeId}`);
      }

      const data = generateProblems(typeId, pageCount * perPage);
      return {
        status: "ready",
        problemType: found,
        problems: data,
      } as const;
    } catch (error) {
      return { status: "error", error } as const;
    }
  }, [typeId, pageCount, perPage]);

  useEffect(() => {
    if (generation.status === "ready") {
      trackWorksheetGenerated();
    } else if (generation.status === "error") {
      console.error(generation.error);
    }
  }, [generation]);

  const pages = useMemo(
    () =>
      generation.status === "ready"
        ? splitIntoPages(generation.problems, perPage)
        : [],
    [generation, perPage],
  );

  if (!typeId) {
    return (
      <div className="page-intro">
        <h1>内容が指定されていません</h1>
        <p>
          <Link to="/grade-select">学年区分を選び直す</Link>
        </p>
      </div>
    );
  }

  if (generation.status !== "ready") {
    return (
      <div className="page-intro">
        <h1>問題を作成できませんでした</h1>
        <p>
          問題タイプと問題数が作成できる範囲か確認してください
          （詳しい内容は開発者ツールのConsoleに出ています）。
        </p>
        <p>
          <Link to="/grade-select">条件を選び直す</Link>
        </p>
      </div>
    );
  }

  const problemType: ProblemTypeSummary = generation.problemType;

  // 小学校は低学年でも読めるように大きく、中学以降は式が長いので小さくする
  const problemClass =
    problemType.level === "小学校"
      ? "sheet-problems"
      : "sheet-problems sheet-problems-small";

  return (
    <>
      <div className="page-intro no-print">
        <h1>できあがりを確認してください</h1>
        <p>
          {problemType.grade}／{problemType.title}／{pages.length}枚
          {includeAnswers && "（解答つき）"}
        </p>
      </div>

      <div className="preview-toolbar no-print">
        <button className="preview-print" onClick={() => window.print()}>
          印刷 / PDF保存
        </button>
        <Link to="/grade-select">条件を選び直す</Link>
      </div>

      <div className="preview-sheets">
        <div className="sheet-frame">
          {pages.map((pageProblems, pageIndex) => (
            <section key={`question-${pageIndex}`} className="sheet">
              <div className="sheet-header">
                <h2 className="sheet-title">
                  {problemType.title}
                  {pages.length > 1 && `（${pageIndex + 1}/${pages.length}）`}
                </h2>

                <div className="sheet-meta">
                  <div className="sheet-meta-row">
                    <span className="sheet-meta-label">日付</span>
                    <span className="sheet-meta-line" />
                  </div>
                  <div className="sheet-meta-row">
                    <span className="sheet-meta-label">なまえ</span>
                    <span className="sheet-meta-line" />
                  </div>
                  <div className="sheet-meta-row">
                    <span className="sheet-meta-label">とくてん</span>
                    <span className="sheet-meta-line">
                      ／ {pageProblems.length}もん
                    </span>
                  </div>
                </div>
              </div>

              <ol className={problemClass}>
                {pageProblems.map((problem, index) => (
                  <li key={index}>{problem.question}</li>
                ))}
              </ol>
            </section>
          ))}

          {includeAnswers &&
            pages.map((pageProblems, pageIndex) => (
              <section key={`answer-${pageIndex}`} className="sheet">
                <div className="sheet-header">
                  <h2 className="sheet-title">
                    解答
                    {pages.length > 1 && `（${pageIndex + 1}/${pages.length}）`}
                  </h2>
                </div>

                <ol className={problemClass}>
                  {pageProblems.map((problem, index) => (
                    <li key={index}>{problem.answer}</li>
                  ))}
                </ol>
              </section>
            ))}
        </div>
      </div>
    </>
  );
}

export default PreviewPage;
