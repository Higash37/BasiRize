import {useNavigate} from "react-router-dom";
import SubjectCard from "../components/SubjectCard";

function HomePage(){
    const navigate = useNavigate();
    return (
        <div className="subject-grid">
            <SubjectCard title="算数/数学" icon="🔢" color="var(--subject-math)" onClick={() => navigate("/grade-select")}/>
            <SubjectCard title="英語" icon="🔤" color="var(--subject-english)" disabled />
            <SubjectCard title="AI作成" icon="🤖" color="var(--subject-ai)" disabled />
        </div>
    )
}

export default HomePage;