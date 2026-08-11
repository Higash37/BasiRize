import "./SubjectCard.css";
// props（propertiesの略）
// 部品が外から受け取るデータのまとまり
type SubjectCardProps = {
    title: string;
    // カードの枠につける教科ごとの色（渡さなければ標準のグレー）
    color?: string;
    onClick?: () => void;
    disabled?: boolean;
};

// サブジェクトカード
function SubjectCard(props: SubjectCardProps) {
    return (
        // buttonタグはキーボード操作とスクリーンリーダー対応をブラウザに任せるため
<button
  className="subject-card"
  onClick={props.onClick}
  disabled={props.disabled}
>
  <span 
  className="subject-card-thumb" 
  style={{ borderColor: props.disabled? undefined : props.color }}
  >
    <img 
    className="subject-card-image" 
    src={`https://picsum.photos/seed/${props.title}/210/297`}
    alt="" 
    />
    {props.disabled && <span className="subject-card-badge">準備中</span>}
  </span>
  <span className="subject-card-title">{props.title}</span>
</button>

    )
    
}

export default SubjectCard;