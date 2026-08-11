import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchProblemTypes, type ProblemTypeSummary } from "../api";
import "./OptionsPage.css";

function OptionsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeId = searchParams.get("typeId");

  const [pageCount, setPageCount] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(10);
  const [includeAnswers, setIncludeAnswers] = useState(true);

  const [problemType, setProblemType] = useState<ProblemTypeSummary>();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!typeId) return;

    setStatus("loading");
    fetchProblemTypes()
      .then((types) => {
        const found = types.find((type) => type.id === typeId);
        if (!found) {
          throw new Error(`該当する問題タイプがありません: ${typeId}`);
        }
        setProblemType(found);
        setStatus("ready");
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
      });
  }, [typeId]);

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
        <h1>読み込んでいます…</h1>
      </div>
    );
  }

  if (status === "error" || !problemType) {
    return (
      <div className="page-intro">
        <h1>内容を取得できませんでした</h1>
        <p>URLが古いか、サーバーが起動していない可能性があります。</p>
        <p>
          <Link to="/grade-select">学年区分を選び直す</Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="page-intro">
        <h1>プリントの内容を決めてください</h1>
        <p>
          {problemType.level}／{problemType.grade}／{problemType.title}
        </p>
      </div>

      <form
        className="options-form"
        onSubmit={(event) => {
          event.preventDefault();
          navigate(
            `/preview?typeId=${problemType.id}&pages=${pageCount}&perPage=${questionsPerPage}&answers=${includeAnswers}`
          );
        }}
      >
        <label className="options-field">
          ページ数
          <input
            type="number"
            min={1}
            max={10}
            value={pageCount}
            onChange={(event) => setPageCount(Number(event.target.value))}
          />
        </label>

        <label className="options-field">
          1枚あたりの問題数
          <input
            type="number"
            min={1}
            max={50}
            value={questionsPerPage}
            onChange={(event) => setQuestionsPerPage(Number(event.target.value))}
          />
        </label>

        <label className="options-check">
          <input
            type="checkbox"
            checked={includeAnswers}
            onChange={(event) => setIncludeAnswers(event.target.checked)}
          />
          解答をセットにする
        </label>

        <button type="submit" className="options-submit">
          プレビューを見る
        </button>
      </form>
    </>
  );
}

export default OptionsPage;
