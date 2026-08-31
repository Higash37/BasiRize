import { Component, type ReactNode } from "react";
import * as Sentry from "@sentry/react";
import ErrorPage from "./ErrorPage";

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

// ページはApp.tsx側でlazy()にしているため、再デプロイ後もタブを開いたままの人が
// 遷移すると、古いチャンクのURLが404になって読み込みに失敗することがある
// （コード分割しているSPAに共通する問題）。ブラウザによってエラーメッセージの
// 文言が違うため、いくつかのパターンに部分一致させている
function isChunkLoadError(error: Error): boolean {
  return /dynamically imported module|Importing a module script failed|Failed to fetch dynamically imported module/i.test(
    error.message,
  );
}

// Reactのエラーバウンダリは、現状クラスコンポーネントでしか書けない
class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error): void {
    // 今まではSentry.init()だけで、実際に描画エラーを拾って送る仕組みが無かった
    Sentry.captureException(error);
  }

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    if (isChunkLoadError(error)) {
      return (
        <ErrorPage
          reason="chunk-load-failed"
          title="新しいバージョンが公開されました"
          message="このタブを開いたままだと読み込めないことがあります。再読み込みしてください。"
          backLabel="再読み込みする"
          onBackClick={() => window.location.reload()}
        />
      );
    }

    return (
      <ErrorPage
        reason="render-error"
        title="うまく表示できませんでした"
        message="予期しないエラーが発生しました。トップからやり直してください。"
        backLabel="トップに戻る"
        onBackClick={() => {
          window.location.href = "/";
        }}
      />
    );
  }
}

export default RouteErrorBoundary;
