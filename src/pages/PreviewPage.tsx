import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  generateProblems,
  getProblemTypeById,
  type Problem,
  type ProblemTypeSummary,
} from "../problem-generation";
import "./PreviewPage.css";
import {
  trackGenerationError,
  trackPrintClicked,
  trackWorksheetGenerated,
} from "../analytics";
import PrintableProblemList from "../components/PrintableProblemList";
import ErrorPage from "../components/ErrorPage";
import FlowStepper from "../components/FlowStepper";
import { useNoIndex } from "../hooks/useNoIndex";

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

function printWorksheet(): void {
  if (document.querySelector(".sheet-overflowing")) {
    window.alert(
      "用紙に収まっていない問題があります。1枚あたりの問題数を減らしてください。",
    );
    return;
  }

  window.print();
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
      trackGenerationError({
        typeId: typeId ?? "",
        message:
          generation.error instanceof Error
            ? generation.error.message
            : String(generation.error),
      });
    }
  }, [generation, typeId]);

  // pages/perPage/answersの組み合わせで無限にURLができ、
  // しかも問題はランダム生成で毎回内容が変わるため検索対象から外す
  useNoIndex();

  const pages = useMemo(
    () =>
      generation.status === "ready"
        ? splitIntoPages(generation.problems, perPage)
        : [],
    [generation, perPage],
  );

  if (!typeId) {
    return (
      <ErrorPage
        reason="missing-type"
        title="内容が指定されていません"
        message="学年区分を選び直してください。"
      />
    );
  }

  if (generation.status !== "ready") {
    return (
      <ErrorPage
        reason="generation-failed"
        title="問題を作成できませんでした"
        message="問題タイプと問題数が作成できる範囲か確認してください（詳しい内容は開発者ツールのConsoleに出ています）。"
        backLabel="条件を選び直す"
      />
    );
  }

  const problemType: ProblemTypeSummary = generation.problemType;

  // 中学以降は式が長くなりやすいため、同じ問題数でも少し小さく始める
  const compactProblems = problemType.level !== "小学校";

  return (
    <>
      <div className="no-print sticky-page-header">
        <FlowStepper
          level={problemType.level}
          current="preview"
          problemType={{ id: problemType.id, title: problemType.title }}
        />

        <div className="page-intro">
          <h1>できあがりを確認してください</h1>
          <p>
            {problemType.grade}／{problemType.title}／{pages.length}枚
            {includeAnswers && "（解答つき）"}
          </p>
        </div>

        <div className="preview-toolbar">
          <button
            className="preview-print"
            onClick={() => {
              trackPrintClicked({
                typeId: problemType.id,
                pageCount,
                questionsPerPage: perPage,
                totalQuestions: pageCount * perPage,
                includeAnswers,
              });
              printWorksheet();
            }}
          >
            印刷 / PDF保存
          </button>
          <Link to="/grade-select">条件を選び直す</Link>
        </div>
      </div>

      <div className="preview-sheets">
        <div className="sheet-frame">
          {pages.map((pageProblems, pageIndex) => (
            <section key={`question-${pageIndex}`} className="sheet">
              <div className="sheet-header">
                <h3 className="sheet-title">
                  {problemType.title}
                  {pages.length > 1 && `（${pageIndex + 1}/${pages.length}）`}
                </h3>

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

              <PrintableProblemList
                problems={pageProblems}
                field="question"
                compact={compactProblems}
              />
            </section>
          ))}

          {includeAnswers &&
            pages.map((pageProblems, pageIndex) => (
              <section key={`answer-${pageIndex}`} className="sheet">
                <div className="sheet-header">
                  <h3 className="sheet-title">
                    解答
                    {pages.length > 1 && `（${pageIndex + 1}/${pages.length}）`}
                  </h3>
                </div>

                <PrintableProblemList
                  problems={pageProblems}
                  field="answer"
                  compact={compactProblems}
                />
              </section>
            ))}
        </div>
      </div>
    </>
  );
}

export default PreviewPage;
