import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  fetchProblems,
  fetchProblemTypes,
  type Problem,
  type ProblemTypeSummary,
} from "../api";
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

  const [problemType, setProblemType] = useState<ProblemTypeSummary>();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // 描画そのものではない処理（外との通信）はここに書く。
  // 結果は描画のあとに届くので、届いた時点で state に入れて描き直させる
  useEffect(() => {
    if (!typeId) return;

    setStatus("loading");

    // 2つの問い合わせを同時に投げ、両方そろってから進む。
    // 順番に待つと2倍の時間がかかる
    Promise.all([fetchProblemTypes(), fetchProblems(typeId, pageCount * perPage)])
      .then(([types, data]) => {
        const found = types.find((type) => type.id === typeId);
        if (!found) {
          throw new Error(`該当する問題タイプがありません: ${typeId}`);
        }

        trackWorksheetGenerated();
        
        setProblemType(found);
        setProblems(data);
        setStatus("ready");
      })
      .catch((error) => {
        // 画面には短く出し、詳しい内容は Console に残す
        console.error(error);
        setStatus("error");
      });
  }, [typeId, pageCount, perPage]);

  const pages = useMemo(
    () => splitIntoPages(problems, perPage),
    [problems, perPage]
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

  if (status === "loading") {
    return (
      <div className="page-intro">
        <h1>問題を作っています…</h1>
      </div>
    );
  }

  if (status === "error" || !problemType) {
    return (
      <div className="page-intro">
        <h1>問題を取得できませんでした</h1>
        <p>
          サーバーが起動しているか、条件が作れる範囲かを確認してください
          （詳しい内容は開発者ツールのConsoleに出ています）。
        </p>
        <p>
          <Link to="/grade-select">条件を選び直す</Link>
        </p>
      </div>
    );
  }

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
                  <span className="sheet-meta-line">／ {pageProblems.length}もん</span>
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
    </>
  );
}

export default PreviewPage;
