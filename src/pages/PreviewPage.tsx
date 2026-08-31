import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
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
import { useScrolled } from "../hooks/useScrolled";

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
  // フロー表示と同じく、スクロール中は薄く・押せない状態にする
  const scrolled = useScrolled();
  // はみ出している紙のidを集めたもの。1枚でもあれば印刷ボタンを押せなくする
  // （window.alert()で毎回警告すると、連打でブラウザに無視されるようになるため）
  const [overflowingSheetIds, setOverflowingSheetIds] = useState<Set<string>>(
    new Set(),
  );

  function handleOverflowChange(sheetId: string, overflowing: boolean) {
    setOverflowingSheetIds((current) => {
      const next = new Set(current);
      if (overflowing) {
        next.add(sheetId);
      } else {
        next.delete(sheetId);
      }
      return next;
    });
  }

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

        <div
          className={
            scrolled
              ? "preview-toolbar preview-toolbar-scrolled"
              : "preview-toolbar"
          }
        >
          <Link
            to="/grade-select"
            className="preview-back"
            aria-label="条件を選び直す"
          >
            <FaArrowLeft aria-hidden="true" />
          </Link>

          <button
            className="preview-print"
            disabled={overflowingSheetIds.size > 0}
            onClick={() => {
              trackPrintClicked({
                typeId: problemType.id,
                pageCount,
                questionsPerPage: perPage,
                totalQuestions: pageCount * perPage,
                includeAnswers,
              });
              window.print();
            }}
          >
            印刷 / PDF保存
          </button>
        </div>

        {overflowingSheetIds.size > 0 && (
          <p className="preview-overflow-warning" role="alert">
            はみ出している問題があります。1枚あたりの問題数を減らしてください。
          </p>
        )}
      </div>

      {/* 見た目には出さないが、画面の主題としてh1は置いておく */}
      <h1 className="visually-hidden">プレビュー</h1>

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
                onOverflowChange={(overflowing) =>
                  handleOverflowChange(`question-${pageIndex}`, overflowing)
                }
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
                  onOverflowChange={(overflowing) =>
                    handleOverflowChange(`answer-${pageIndex}`, overflowing)
                  }
                />
              </section>
            ))}
        </div>
      </div>
    </>
  );
}

export default PreviewPage;
