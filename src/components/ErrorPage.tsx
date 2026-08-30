import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { trackErrorPageShown } from "../analytics";
import { useNoIndex } from "../hooks/useNoIndex";
import "./ErrorPage.css";

type ErrorPageProps = {
  // 集計用の短い識別子（例: "missing-level"）。画面には出さない
  reason: string;
  title: string;
  message: string;
  backTo?: string;
  backLabel?: string;
};

function ErrorPage({
  reason,
  title,
  message,
  backTo = "/grade-select",
  backLabel = "学年区分を選び直す",
}: ErrorPageProps) {
  const location = useLocation();

  useEffect(() => {
    trackErrorPageShown({
      reason,
      path: `${location.pathname}${location.search}`,
    });
  }, [reason, location.pathname, location.search]);

  // 存在しないURLや壊れたパラメータのページを検索結果から除外する
  // （Renderの書き換えルールにより、これらのページもHTTP 200を返すため）
  useNoIndex();

  return (
    <div className="error-page">
      <div className="error-page-card">
        <span className="error-page-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="32" height="32">
            <path
              fill="currentColor"
              d="M12 2 1 21h22L12 2Zm0 5 7.5 12h-15L12 7Zm-1 4v4h2v-4h-2Zm0 5.5v2h2v-2h-2Z"
            />
          </svg>
        </span>
        <h2 className="error-page-title">{title}</h2>
        <p className="error-page-message">{message}</p>
        <Link to={backTo} className="error-page-back">
          {backLabel}
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
