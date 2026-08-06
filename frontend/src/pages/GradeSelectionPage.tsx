import {useNavigate} from "react-router-dom";
import SubjectCard from "../components/SubjectCard"

function GradeSelectionPage(){
    const navigate = useNavigate();
    return (
        <div>
            <h1>学年区分を選んでください</h1>
            <div className="subject-grid">
                <SubjectCard title="小学校" icon="🎒" onClick={() => navigate("/content-select", {state: {level: "小学校"}})} />
                <SubjectCard title="中学校" icon="📘" onClick={() => navigate("/content-select", {state: {level: "中学校"}})} />
                <SubjectCard title="高校" icon="🎓" onClick={() => navigate("/content-select", {state: {level: "高校"}})} />
                <SubjectCard title="大学受験" icon="📚" disabled />
            </div>
        </div>
    )
}

export default GradeSelectionPage