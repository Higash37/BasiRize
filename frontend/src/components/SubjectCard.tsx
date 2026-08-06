import "./SubjectCard.css";

type SubjectCardProps = {
    title: string;
    disabled?: boolean;
    onClick?: () => void;
    image?: string;
    icon?: string;
}

// SubjectCardPropsからタイトルという部分だけを分割代入
function SubjectCard({title, disabled, onClick, image, icon}: SubjectCardProps){
    return(
         <div className={disabled ? "subject-card disabled" : "subject-card"}
         onClick={disabled ? undefined : onClick}>
            <div className="subject-card-image">
                {image ? (
                    <img src={image} alt={title} />
                ) : icon ? (
                    <span className="subject-card-icon">{icon}</span>
                ) : (
                    <span className="subject-card-placeholder">画像</span>
                )}
            </div>
            <h2>{title}</h2>
        </div>
    )
}

export default SubjectCard;