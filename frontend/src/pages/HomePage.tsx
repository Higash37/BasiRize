import {useNavigate} from "react-router-dom";
import SubjectCard from "../components/SubjectCard";
import "./HomePage.css";

function HomePage(){
    const navigate = useNavigate();
    return (
        <div className="subject-grid">
            <SubjectCard title="算数/数学" onClick={() => navigate("/grade-select")}/>
            <SubjectCard title="英語" disabled />
            <SubjectCard title="AI作成" disabled />
        </div>
    )
}

export default HomePage;