import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProblemTypeById } from "../utils/problemGenerator";
import "./OptionsPage.css";

function OptionsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const level = location.state?.level;
  const problemTypeId = location.state?.problemTypeId as string | undefined;
  const problemType = problemTypeId ? getProblemTypeById(problemTypeId) : undefined;

  const [pageCount, setPageCount] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(10);
  const [includeAnswers, setIncludeAnswers] = useState(true);

  if (!problemType) {
    return (
      <div>
        <h1>内容が選択されていません</h1>
        <button onClick={() => navigate("/grade-select")}>学年区分選択に戻る</button>
      </div>
    );
  }

  return (
    <div className="options-page">
      <h1>プリントの内容を決めてください</h1>
      <p className="options-summary">
        {level} / {problemType.grade} / {problemType.title}
      </p>

      <div className="options-form">
        <label>
          ページ数：
          <input
            type="number"
            min={1}
            max={10}
            value={pageCount}
            onChange={(event) => setPageCount(Number(event.target.value))}
          />
        </label>

        <label>
          1枚あたりの問題数：
          <input
            type="number"
            min={1}
            max={50}
            value={questionsPerPage}
            onChange={(event) => setQuestionsPerPage(Number(event.target.value))}
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={includeAnswers}
            onChange={(event) => setIncludeAnswers(event.target.checked)}
          />
          解答をセットにする
        </label>

        <button
          onClick={() =>
            navigate("/preview", {
              state: { problemTypeId, pageCount, questionsPerPage, includeAnswers },
            })
          }
        >
          プレビューを見る
        </button>
      </div>
    </div>
  );
}

export default OptionsPage;
