import { Link, useLocation } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import "./Header.css";

function Header() {
  // /en配下かどうかで、切り替え先と表示文言を反転させる
  const { pathname } = useLocation();
  const isEnglishPage = pathname.startsWith("/en");

  return (
    <header className="site-header">
      <Link to="/" className="site-header-logo">
        {/* 隣にmath²ドリルの文字があるので装飾扱い。alt はつけない */}
        <img className="site-header-icon" src="/basirize-favicon.png" alt="" />
        <span className="site-header-name">math²ドリル</span>
        <span className="site-header-reading">（マスマスドリル）</span>
        <span className="site-header-tagline">ランダム生成、今すぐ印刷</span>
      </Link>

      <nav className="site-header-links" aria-label="外部リンク">
        <Link
          to={isEnglishPage ? "/" : "/en"}
          lang={isEnglishPage ? "ja" : "en"}
          className="site-header-lang-link"
        >
          {isEnglishPage ? "日本語" : "EN"}
        </Link>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/Higash37/BasiRize"
          aria-label="GitHubリポジトリ"
        >
          <FaGithub aria-hidden="true" />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://forms.gle/aQtBaYdcyHXPDixk8"
          aria-label="お問い合わせフォーム"
        >
          <CiMail aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
}

export default Header;
