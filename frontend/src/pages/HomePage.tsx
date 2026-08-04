import SubjectCard from "../components/SubjectCard";
import "./HomePage.css";

function HomePage(){
    return (
        <div className="subject-grid">
            <SubjectCard title="算数/数学" />
            <SubjectCard title="英語" disabled />
            <SubjectCard title="AI作成" disabled />
        </div>
    )
}

export default HomePage;