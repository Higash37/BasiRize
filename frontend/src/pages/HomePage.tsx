import {useNavigate} from "react-router-dom";
import SubjectCard from "../components/SubjectCard";

function HomePage(){
    const navigate = useNavigate();
    return (
        <div className="subject-grid">
            <SubjectCard title="算数/数学" icon="🔢" onClick={() => navigate("/grade-select")}/>
            <SubjectCard title="英語" icon="🔤" disabled />
            <SubjectCard title="AI作成" icon="🤖" disabled />
        </div>
    )
}

export default HomePage;