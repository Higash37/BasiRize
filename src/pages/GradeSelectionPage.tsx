import SubjectCard from "../components/SubjectCard";
import FlowStepper from "../components/FlowStepper";
import { gradeCardImages } from "../data/cardImages.ts";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";
import { getLevelPath } from "../seoRoutes";

function GradeSelectionPage() {
  useDocumentMetadata({
    title: "学年を選んで算数・数学の問題プリントを作成 | math²ドリル",
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
          to={getLevelPath("小学校")}
          imageSrc={gradeCardImages.elementary}
        />
        <SubjectCard
          title="中学校"
          to={getLevelPath("中学校")}
          imageSrc={gradeCardImages.juniorHigh}
        />
        <SubjectCard
          title="高校"
          to={getLevelPath("高校")}
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
