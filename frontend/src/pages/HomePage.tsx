import {useNavigate} from "react-router-dom";

// 自作
import SubjectCard from "../components/SubjectCard";

function HomePage(){
    // onClick{() => navigate(/...)}で移動を実行する関数を設定
    // <a href></a>だとブラウザがページ全体を作り直してしまう
    // useNavigateだとサーバには何も聞かず、Outletの中身だけ入れ替えられる
    const navigate = useNavigate();
    return (
        <>
        <div className="page-intro">
            <h1>教科を選んでください</h1>
            <p>条件を選ぶだけでプリントを作成・印刷</p>
        </div>
        <div className="subject-grid">
            <SubjectCard title="数学" color="var(--subject-math)"  onClick={() => navigate("/grade-select")}/>
            <SubjectCard title="英語" color="var(--subject-english)" disabled />
            <SubjectCard title="国語"  color="var(--subject-japanese)" disabled />
            <SubjectCard title="理科"  color="var(--subject-science)" disabled />
            <SubjectCard title="社会" color="var(--subject-social)" disabled />
            <SubjectCard title="AI作成" color="var(--subject-ai)" disabled />
        </div>
        </>
    )
}

export default HomePage;