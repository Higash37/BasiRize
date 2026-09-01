import { Link, useParams } from "react-router-dom";
import { generateProblems, getProblemTypeById } from "../problem-generation";
import { getEnFlagshipType } from "../data/enFlagshipTypes";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";
import ErrorPage from "../components/ErrorPage";
import "./EnWorksheetPage.css";

const PREVIEW_COUNT = 5;

function EnWorksheetPage() {
  const { slug } = useParams();
  const flagshipType = slug ? getEnFlagshipType(slug) : undefined;
  const problemType = flagshipType
    ? getProblemTypeById(flagshipType.typeId)
    : undefined;

  useDocumentMetadata(
    flagshipType && problemType
      ? {
          title: `${flagshipType.titleEn} | Math² Drill`,
          description: flagshipType.descriptionEn,
          canonicalPath: `/en/worksheets/${flagshipType.slug}`,
          lang: "en",
          alternates: [
            {
              hreflang: "en",
              path: `/en/worksheets/${flagshipType.slug}`,
            },
            { hreflang: "ja", path: `/problems/${problemType.id}` },
          ],
          breadcrumbs: [
            { name: "Math² Drill", path: "/en" },
            {
              name: flagshipType.titleEn,
              path: `/en/worksheets/${flagshipType.slug}`,
            },
          ],
        }
      : undefined,
  );

  if (!flagshipType || !problemType) {
    return (
      <ErrorPage
        reason="en-type-not-found"
        title="Worksheet not found"
        message="This worksheet page doesn't exist. Please choose another one."
        backTo="/en"
        backLabel="Back to worksheet list"
      />
    );
  }

  const previewProblems = generateProblems(problemType.id, PREVIEW_COUNT);

  return (
    <>
      <div className="page-intro">
        <h1>{flagshipType.titleEn}</h1>
        <p>{flagshipType.descriptionEn}</p>
      </div>

      <ol className="en-worksheet-preview">
        {previewProblems.map((problem, index) => (
          <li key={index}>{problem.question}</li>
        ))}
      </ol>

      <Link to={`/problems/${problemType.id}`} className="en-worksheet-cta">
        Generate &amp; print this worksheet →
      </Link>

      <p className="en-worksheet-note">{flagshipType.worksheetNote}</p>
    </>
  );
}

export default EnWorksheetPage;
