import { Outlet } from "react-router-dom";

// 自作
import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css";

// 全ページ共通のヘッダー/フッターを持つ枠組み。
// <Outlet /> の場所に、今のURLに対応するページの中身が差し込まれる。
function Layout() {
  return (
    // ヘッダーやフッター含めたレイアウト全体
    <div className="site-layout">
      <Header />
      <div className="site-scroll-area">
        <main className="site-main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
