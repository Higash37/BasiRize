import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SubjectCard from "../components/SubjectCard";
import { fetchProblemTypes, type ProblemTypeSummary } from "../api";

function ContentSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const level = searchParams.get("level");

  const [types, setTypes] = useState<ProblemTypeSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!level) return;

    setStatus("loading");
    fetchProblemTypes(level)
      .then((data) => {
        setTypes(data);
        setStatus("ready");
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
      });
  }, [level]);

  if (!level) {
    return (
      <div className="page-intro">
        <h1>学年区分が指定されていません</h1>
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

  if (status === "error") {
    return (
      <div className="page-intro">
        <h1>内容の一覧を取得できませんでした</h1>
        <p>サーバーが起動しているか確認してください。</p>
        <p>
          <Link to="/grade-select">学年区分を選び直す</Link>
        </p>
      </div>
    );
  }

  if (types.length === 0) {
    return (
      <div className="page-intro">
        <h1>該当する内容がありません</h1>
        <p>「{level}」に対応する問題がまだ用意されていません。</p>
        <p>
          <Link to="/grade-select">学年区分を選び直す</Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="page-intro">
        <h1>内容を選んでください</h1>
        <p>
          {level}／{types.length}種類
        </p>
      </div>

      <div className="subject-grid">
        {types.map((type) => (
          <SubjectCard
            key={type.id}
            title={`${type.grade}：${type.title}`}
            onClick={() => navigate(`/options?typeId=${type.id}`)}
          />
        ))}
      </div>
    </>
  );
}

export default ContentSelectionPage;
