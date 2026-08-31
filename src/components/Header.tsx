import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import "./Header.css";

function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-header-logo">
        {/* 隣にBasiRizeの文字があるので装飾扱い。alt はつけない */}
        <img className="site-header-icon" src="/basirize-favicon.png" alt="" />
        <span className="site-header-name">BasiRize</span>
        <span className="site-header-tagline">ランダム生成、今すぐ印刷</span>
      </Link>

      <nav className="site-header-links" aria-label="外部リンク">
        <a target="_blank" href="https://github.com/Higash37/BasiRize">
          <FaGithub />
        </a>
        <a target="_blank" href="https://forms.gle/aQtBaYdcyHXPDixk8">
          <CiMail />
        </a>
      </nav>
    </header>
  );
}

export default Header;
