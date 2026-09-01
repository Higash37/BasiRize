import { Link, useNavigate } from "react-router-dom";
import {
  FaGraduationCap,
  FaRandom,
  FaPrint,
  FaGift,
  FaLanguage,
  FaBook,
  FaFlask,
  FaLandmark,
  FaRobot,
  FaBolt,
  FaLayerGroup,
  FaClipboardList,
} from "react-icons/fa";

// 自作
import SubjectCard from "../components/SubjectCard";
import FlowStepper from "../components/FlowStepper";
import { subjectCardImages, gradeCardImages } from "../data/cardImages.ts";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";
import { getProblemTypes } from "../problem-generation";
import type { Level } from "../problem-generation";
import { SEO_LEVELS, getLevelPath } from "../seoRoutes";
import "./HomePage.css";

// 対応している学年・単元セクションで、学年区分選択ページと同じ校舎イラストを使い回す
const LEVEL_IMAGES: Record<Level, string> = {
  小学校: gradeCardImages.elementary,
  中学校: gradeCardImages.juniorHigh,
  高校: gradeCardImages.highSchool,
};

// 数学以外は準備中。大きな箱を6枚並べると使えない機能が目立つので、
// アイコン付きの小さなチップで「対応予定」だけ軽く示す
const MORE_SUBJECTS = [
  {
    title: "英語",
    icon: <FaLanguage aria-hidden="true" />,
    color: "var(--subject-english)",
  },
  {
    title: "国語",
    icon: <FaBook aria-hidden="true" />,
    color: "var(--subject-japanese)",
  },
  {
    title: "理科",
    icon: <FaFlask aria-hidden="true" />,
    color: "var(--subject-science)",
  },
  {
    title: "社会",
    icon: <FaLandmark aria-hidden="true" />,
    color: "var(--subject-social)",
  },
  {
    title: "AI作成",
    icon: <FaRobot aria-hidden="true" />,
    color: "var(--subject-ai)",
  },
];

const HOME_FEATURES = [
  {
    icon: <FaGraduationCap aria-hidden="true" />,
    title: "学年別に選べる",
    description:
      "小学校から高校まで、学年と単元を選ぶだけで問題を絞り込めます。",
  },
  {
    icon: <FaRandom aria-hidden="true" />,
    title: "毎回ちがう問題",
    description:
      "生成のたびに数値が変わるので、同じプリントを繰り返し使えます。",
  },
  {
    icon: <FaPrint aria-hidden="true" />,
    title: "解答つきで印刷・PDF保存",
    description: "採点用の解答をまとめて出力し、そのまま印刷やPDF保存ができます。",
  },
  {
    icon: <FaGift aria-hidden="true" />,
    title: "無料・登録不要",
    description: "アカウント登録なしで、ブラウザだけで今すぐ使えます。",
  },
];

// 「教材を選ぶ手間」「類題を探し回る手間」をなくす、という価値を具体的な場面で示す
const HOME_USE_CASES = [
  {
    icon: <FaBolt aria-hidden="true" />,
    title: "「あと5問足りない」をその場で解決",
    description:
      "演習中に問題が足りなくなっても、他の教材をめくって似た問題を探す代わりに、その場で必要な数だけ新しく作れます。",
  },
  {
    icon: <FaLayerGroup aria-hidden="true" />,
    title: "教材を何冊も見比べる手間をなくす",
    description:
      "類題を増やすために複数の教材を探し回らなくても、単元を選ぶだけで何問でも生成できます。",
  },
  {
    icon: <FaClipboardList aria-hidden="true" />,
    title: "小テスト・宿題をすぐ用意",
    description:
      "教材から問題を書き写したりコピーしたりせず、単元と問題数を選ぶだけで新しいプリントを作れます。",
  },
];

const HOME_PRINT_TIPS = [
  {
    title: "両面印刷で紙を節約",
    description:
      "「解答をセットにする」をオンにすると、問題ページのあとに解答ページが続けて出力されます。ブラウザの印刷ダイアログで両面印刷を選べば、配る紙の枚数を減らせます。",
  },
  {
    title: "倍率は既定のままで",
    description:
      "プリントはA4サイズを想定してレイアウトしています。印刷ダイアログの倍率を変更すると、行の折り返しがずれることがあるため、既定のままの印刷をおすすめします。",
  },
  {
    title: "「はみ出している問題があります」と出たら",
    description:
      "1ページに収まりきらないと印刷ボタンが押せなくなります。ページ数を増やして問題を分割するか、問題数を減らしてください。",
  },
  {
    title: "問題だけ配りたいとき",
    description:
      "「解答をセットにする」のチェックを外せば、問題だけのプリントになります。採点用に解答が必要なときだけチェックを入れてください。",
  },
];

const HOME_STEPS = [
  {
    title: "学年を選ぶ",
    description: "小学校・中学校・高校から学年区分を選びます。",
  },
  {
    title: "単元と条件を選ぶ",
    description: "単元、問題数、ページ数などの条件を指定します。",
  },
  {
    title: "印刷・PDF保存",
    description: "プレビューを確認して、そのまま印刷またはPDFで保存します。",
  },
];

const HOME_FAQ = [
  {
    question: "無料で使えますか？",
    answer: "はい。会員登録なしで、無料でお使いいただけます。",
  },
  {
    question: "塾の授業や宿題で配布してもいいですか？",
    answer: "はい。生成したプリントは印刷して、授業や宿題としてお使いいただけます。",
  },
  {
    question: "同じ問題が続けて出ないようにできますか？",
    answer: "生成のたびに数値をランダムに変えているので、毎回ちがう問題になります。",
  },
  {
    question: "印刷以外にPDFで保存できますか？",
    answer: "はい。プレビュー画面の印刷から、PDFとして保存できます。",
  },
  {
    question: "対応している学年を教えてください",
    answer:
      "小学校・中学校・高校の算数・数学に対応しています。学年ごとの単元は上の一覧からご確認いただけます。",
  },
];

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
    alternates: [
      { hreflang: "ja", path: "/" },
      { hreflang: "en", path: "/en" },
      { hreflang: "x-default", path: "/" },
    ],
    faq: HOME_FAQ,
  });

  return (
    <>
      {/* このページだけはLPとして下に長いので、FlowStepperは固定せず一緒にスクロールさせる */}
      <FlowStepper current="subject" />
      <div className="page-intro">
        <h1>教科を選んでください</h1>
        <p>
          学年・単元・問題数を選ぶだけで、毎回新しい算数・数学プリントを自動生成。解答つきでそのまま印刷・PDF保存できます。
        </p>
      </div>
      <div className="home-subject-single">
        <SubjectCard
          title="数学"
          color="var(--subject-math)"
          imageSrc={subjectCardImages.math}
          onClick={() => navigate("/grade-select")}
        />
      </div>
      <p className="home-more-subjects-note">他の教科は準備中です</p>
      <ul className="home-more-subjects-list">
        {MORE_SUBJECTS.map((subject) => (
          <li key={subject.title} className="home-more-subjects-chip">
            <span
              className="home-more-subjects-icon"
              style={{ background: subject.color }}
            >
              {subject.icon}
            </span>
            {subject.title}
          </li>
        ))}
      </ul>

      <section className="home-section" aria-labelledby="home-features-heading">
        <h2 id="home-features-heading">BasiRizeでできること</h2>
        <ul className="home-feature-list">
          {HOME_FEATURES.map((feature) => (
            <li key={feature.title} className="home-feature-card">
              <span className="home-feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section home-section-muted" aria-labelledby="home-usecases-heading">
        <h2 id="home-usecases-heading">こんな場面で使えます</h2>
        <ul className="home-usecase-list">
          {HOME_USE_CASES.map((item) => (
            <li key={item.title} className="home-usecase-item">
              <h3>
                <span className="home-usecase-icon" aria-hidden="true">
                  {item.icon}
                </span>
                {item.title}
              </h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section" aria-labelledby="home-steps-heading">
        <h2 id="home-steps-heading">使い方</h2>
        <ol className="home-step-list">
          {HOME_STEPS.map((step, index) => (
            <li key={step.title} className="home-step">
              {index === 0 ? (
                // 最初のステップだけ、数字の代わりに数学キャラを案内役として置く
                <img
                  className="home-step-avatar"
                  src={subjectCardImages.math}
                  alt=""
                />
              ) : (
                <span className="home-step-number" aria-hidden="true">
                  {index + 1}
                </span>
              )}
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-section home-section-muted" aria-labelledby="home-coverage-heading">
        <h2 id="home-coverage-heading">対応している学年・単元</h2>
        <div className="home-coverage-list">
          {SEO_LEVELS.map((level) => {
            const grades = [
              ...new Set(getProblemTypes(level).map((type) => type.grade)),
            ];
            return (
              <div key={level} className="home-coverage-item">
                <img className="home-coverage-image" src={LEVEL_IMAGES[level]} alt="" />
                <div className="home-coverage-body">
                  <h3>
                    <Link to={getLevelPath(level)}>{level}</Link>
                  </h3>
                  <p>{grades.join("・")}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="home-section" aria-labelledby="home-tips-heading">
        <h2 id="home-tips-heading">印刷のコツ</h2>
        <ul className="home-tips-list">
          {HOME_PRINT_TIPS.map((tip) => (
            <li key={tip.title} className="home-tips-item">
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section home-section-muted" aria-labelledby="home-faq-heading">
        <h2 id="home-faq-heading">よくある質問</h2>
        <div className="home-faq-list">
          {HOME_FAQ.map((item) => (
            <details key={item.question} className="home-faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

export default HomePage;
