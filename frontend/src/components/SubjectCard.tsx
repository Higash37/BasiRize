import "./SubjectCard.css";
// props（propertiesの略）
// 部品が外から受け取るデータのまとまり
type SubjectCardProps = {
    title: string;
    icon: string;
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
  style={{ borderColor: props.color }}
  onClick={props.onClick}
  disabled={props.disabled}
>
  <span className="subject-card-thumb" aria-hidden="true">
    {props.icon}
  </span>
  <span className="subject-card-title">{props.title}</span>
</button>

    )
    
}

export default SubjectCard;