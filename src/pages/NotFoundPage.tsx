import ErrorPage from "../components/ErrorPage";

function NotFoundPage() {
  return (
    <ErrorPage
      reason="not-found"
      title="ページが見つかりません"
      message="URLが間違っているか、ページが移動・削除された可能性があります。"
      backTo="/"
      backLabel="トップに戻る"
    />
  );
}

export default NotFoundPage;
