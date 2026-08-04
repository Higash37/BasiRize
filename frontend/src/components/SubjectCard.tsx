import "./SubjectCard.css";

type SubjectCardProps = {
    title: string;
    disabled?: boolean;
    onClick?: () => void;
}

// SubjectCardPropsからタイトルという部分だけを分割代入
function SubjectCard({title, disabled, onClick}: SubjectCardProps){
    return(
         <div className={disabled ? "subject-card disabled" : "subject-card"}
         onClick={disabled ? undefined : onClick}>
            <h2>{title}</h2>
        </div>
    )
}

export default SubjectCard;