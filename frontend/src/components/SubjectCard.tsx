import "./SubjectCard.css";

type SubjectCardProps = {
    title: string;
    disabled?: boolean;
}

// SubjectCardPropsからタイトルという部分だけを分割代入
function SubjectCard({title, disabled}: SubjectCardProps){
    return(
         <div className={disabled ? "subject-card disabled" : "subject-card"}>
            <h2>{title}</h2>
        </div>
    )
}

export default SubjectCard;