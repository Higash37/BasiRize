import { FaGithub } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <p>© 2026 BasiRize</p>
      <nav className="footer-links" aria-label="外部リンク">
        <a target="_blank" href="https://github.com/Higash37/BasiRize">
          <FaGithub />
        </a>
        <a target="_blank" href="https://forms.gle/aQtBaYdcyHXPDixk8">
          <CiMail />
        </a>
      </nav>
    </footer>
  );
}

export default Footer;
