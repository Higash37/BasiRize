import { Suspense } from "react";
import { Outlet } from "react-router-dom";

// 自作
import Header from "./Header";
import Footer from "./Footer";
import RouteErrorBoundary from "./RouteErrorBoundary";
import "./Layout.css";

// 全ページ共通のヘッダー/フッターを持つ枠組み。
// <Outlet /> の場所に、今のURLに対応するページの中身が差し込まれる。
// ページはApp.tsx側でlazy()にしているため、切り替わり中はSuspenseの
// fallbackが一瞬映る。読み込みに失敗した場合はRouteErrorBoundaryが拾う。
// ヘッダー/フッターごと消えないよう、どちらも<Outlet />だけを囲む
function Layout() {
  return (
    // ヘッダーやフッター含めたレイアウト全体
    <div className="site-layout">
      <Header />
      <div className="site-scroll-area">
        <main className="site-main">
          <RouteErrorBoundary>
            <Suspense fallback={<RouteLoading />}>
              <Outlet />
            </Suspense>
          </RouteErrorBoundary>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function RouteLoading() {
  return (
    <p className="route-loading" role="status">
      読み込み中…
    </p>
  );
}

export default Layout;
