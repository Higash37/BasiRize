import { useNavigate } from "react-router-dom";

// 自作
import SubjectCard from "../components/SubjectCard";
import FlowStepper from "../components/FlowStepper";
import { subjectCardImages } from "../data/cardImages.ts";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";

function HomePage() {
  // onClick{() => navigate(/...)}で移動を実行する関数を設定
  // <a href></a>だとブラウザがページ全体を作り直してしまう
  // useNavigateだとサーバには何も聞かず、Outletの中身だけ入れ替えられる
  const navigate = useNavigate();

  // index.htmlの既定値と同じ内容を、英語版へのhreflang付きで明示する
  useDocumentMetadata({
    title: "算数・数学プリントを今すぐ自動生成【小学校〜高校】| BasiRize",
    description:
      "「あと5分で欲しい」に応える算数・数学プリント生成サイト。学年と単元を選ぶだけで、毎回新しい問題をランダム生成。小学校から高校まで対応、今すぐ印刷・PDF保存できます。",
    canonicalPath: "/",
    alternates: [{ hreflang: "en", path: "/en" }],
  });

  return (
    <>
      <div className="sticky-page-header">
        <FlowStepper current="subject" />
      </div>
      <div className="page-intro">
        <h1>教科を選んでください</h1>
        <p>条件を選ぶだけでプリントを作成・印刷</p>
      </div>
      <div className="subject-grid">
        <SubjectCard
          title="数学"
          color="var(--subject-math)"
          imageSrc={subjectCardImages.math}
          onClick={() => navigate("/grade-select")}
        />
        <SubjectCard
          title="英語"
          color="var(--subject-english)"
          imageSrc={subjectCardImages.english}
          disabled
        />
        <SubjectCard
          title="国語"
          color="var(--subject-japanese)"
          imageSrc={subjectCardImages.japanese}
          disabled
        />
        <SubjectCard
          title="理科"
          color="var(--subject-science)"
          imageSrc={subjectCardImages.science}
          disabled
        />
        <SubjectCard
          title="社会"
          color="var(--subject-social)"
          imageSrc={subjectCardImages.socialStudies}
          disabled
        />
        <SubjectCard
          title="AI作成"
          color="var(--subject-ai)"
          imageSrc={subjectCardImages.ai}
          disabled
        />
      </div>
    </>
  );
}

export default HomePage;
