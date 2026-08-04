import {useState} from "react";
import {useNavigate} from "react-router-dom";
import SubjectCard from "../components/SubjectCard"

function GradeSelectionPage(){
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const navigate = useNavigate();
    return (
        <div>
            <h1>学年区分を選んでください</h1>
            <div className="subject-grid">
                <SubjectCard title="小学校" onClick={() => navigate("/content-select", {state: {level: "小学校"}})} />
                <SubjectCard title="中学校" disabled/>
                <SubjectCard title="高校" disabled />
                <SubjectCard title="大学受験" disabled />
            </div>
            <p>選択中：{selectedLevel}</p>
        </div>
    )
}

export default GradeSelectionPage