import { Link } from "react-router-dom";
import { enFlagshipTypes } from "../data/enFlagshipTypes";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";
import "./EnHomePage.css";

function EnHomePage() {
  useDocumentMetadata({
    title: "Free Math Worksheet Generator | BasiRize",
    description:
      "Generate free, printable math worksheets instantly. A fresh set of problems every time, from basic arithmetic to junior-high entrance-exam word problems.",
    canonicalPath: "/en",
    lang: "en",
    alternates: [{ hreflang: "ja", path: "/" }],
  });

  return (
    <>
      <div className="page-intro">
        <h1>Free Math Worksheet Generator</h1>
        <p>
          Pick a worksheet below to generate a fresh, printable set of
          problems with an answer key — in seconds.
        </p>
      </div>

      <ul className="en-flagship-list">
        {enFlagshipTypes.map((type) => (
          <li key={type.slug}>
            <Link
              className="en-flagship-card"
              to={`/en/worksheets/${type.slug}`}
            >
              <h3>{type.titleEn}</h3>
              <p>{type.descriptionEn}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default EnHomePage;
