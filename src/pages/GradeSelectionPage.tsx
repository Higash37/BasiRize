import { useNavigate } from "react-router-dom";
import SubjectCard from "../components/SubjectCard";
import FlowStepper from "../components/FlowStepper";
import { gradeCardImages } from "../data/cardImages.ts";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";

function GradeSelectionPage() {
  const navigate = useNavigate();

  useDocumentMetadata({
    title: "学年を選んで算数・数学の問題プリントを作成 | BasiRize",
    description:
      "小学校・中学校・高校から学年区分を選び、条件に合った算数・数学の問題プリントをすぐに作成できます。",
    canonicalPath: "/grade-select",
  });

  return (
    <>
      <div className="sticky-page-header">
        <FlowStepper current="level" />
      </div>
      <div className="page-intro">
        <h1>学年区分を選択</h1>
      </div>

      <div className="subject-grid">
        <SubjectCard
          title="小学校"
          onClick={() => navigate("/content-select?level=小学校")}
          imageSrc={gradeCardImages.elementary}
        />
        <SubjectCard
          title="中学校"
          onClick={() => navigate("/content-select?level=中学校")}
          imageSrc={gradeCardImages.juniorHigh}
        />
        <SubjectCard
          title="高校"
          onClick={() => navigate("/content-select?level=高校")}
          imageSrc={gradeCardImages.highSchool}
        />
        <SubjectCard
          title="大学受験"
          imageSrc={gradeCardImages.university}
          disabled
        />
      </div>
    </>
  );
}

export default GradeSelectionPage;
