import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-header-logo">
        BasiRize
      </Link>
    </header>
  );
}

export default Header;
