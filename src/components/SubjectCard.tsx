import "./SubjectCard.css";
import noImage from "../assets/no-image.webp";
type SubjectCardProps = {
  title: string;
  // 画像の下線につける教科色。未指定なら --color-border のグレー
  color?: string;
  imageSrc?: string;
  onClick?: () => void;
  disabled?: boolean;
};

function SubjectCard(props: SubjectCardProps) {
  return (
    // 遷移先を知らず disabled も要るので、<a> ではなく <button>
    <button
      className="subject-card"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {/* borderColor は4辺に効くが、太さがあるのは border-bottom だけ */}
      <span
        className="subject-card-thumb"
        style={{ borderColor: props.disabled ? undefined : props.color }}
      >
        {/* 仮画像。title を seed にして絵を固定している。210/297 は A4 比。装飾なので alt は空 */}
        <img
          className="subject-card-image"
          src={props.imageSrc ?? noImage}
          alt=""
        />
        {props.disabled && <span className="subject-card-badge">準備中</span>}
      </span>

      <span className="subject-card-title">{props.title}</span>
    </button>
  );
}

export default SubjectCard;
