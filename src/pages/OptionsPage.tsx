// useState: 画面に値を覚えさせるReactフック
import { useState } from "react";
// Link: <Link to="...">と書く。押すと画面を再読み込みせずに移動する（HTMLの<link>とは別物）
// useNavigate: 別ページに移動する関数をもらう
// useSearchParams: URLの?以降を読むフック
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// 自作
import { getProblemTypeById } from "../problem-generation";
// CSSスタイル
import "./OptionsPage.css";

function OptionsPage() {
  const navigate = useNavigate();
  // []から取り出す書き方
  // useSearchParams(): [URLを読む道具, URLを書き換える関数]
  // useSearchParams() は2つ入った配列を返すので、その1つ目だけを取り出してsearchParamsと名付ける
  // なぜ[searchParams]なのか?: []を左辺に書かないと配列まるごとが入ってしまい、getメソッドが使えないため
  const [searchParams] = useSearchParams();
  // .get(...)はキーがtypeIdの値を返す。無ければ null
  // /options?typeId=e1-add-subであれば、typeIdがキー・e1-add-subが値
  const typeId = searchParams.get("typeId");
  // useState(初期値) が [今の値, 変える関数] を返す。それを2つに分けて受け取る
  const [pageCount, setPageCount] = useState(1);
  // 問題数のデフォルトを設定
  const [questionsPerPage, setQuestionsPerPage] = useState(10);
  // 解答を用意するかどうかデフォルトを設定
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const problemType = typeId ? getProblemTypeById(typeId) : undefined;

  // 早期リターン（ガード節）
  // typeIdがなければ/grade-selectへ戻らせる
  if (!typeId) {
    return (
      <div className="page-intro">
        <h1>内容が指定されていません</h1>
        <p>
          <Link to="/grade-select">学年区分を選び直す</Link>
        </p>
      </div>
    );
  }

  if (!problemType) {
    return (
      <div className="page-intro">
        <h1>内容を取得できませんでした</h1>
        <p>URLが古いか、問題タイプが削除された可能性があります。</p>
        <p>
          <Link to="/grade-select">学年区分を選び直す</Link>
        </p>
      </div>
    );
  }

  return (
    // <>: フラグメント。関数が返せる値は1つだけなので、フラグメントで包む
    <>
      <div className="page-intro">
        <h1>プリントの内容を決定</h1>
        <p>
          {problemType.level}／{problemType.grade}／{problemType.title}
        </p>
      </div>

      <form
        className="options-form"
        onSubmit={(event) => {
          // ブラウザの再読み込み規定動作を消す
          event.preventDefault();
          // 自分でページへ飛ぶ
          navigate(
            `/preview?typeId=${problemType.id}&pages=${pageCount}&perPage=${questionsPerPage}&answers=${includeAnswers}`,
          );
        }}
      >
        <label className="options-field">
          ページ数
          <input
            type="number"
            min={1}
            max={10}
            value={pageCount}
            onChange={(event) => setPageCount(Number(event.target.value))}
          />
        </label>

        <label className="options-field">
          1枚あたりの問題数
          <input
            type="number"
            min={1}
            max={50}
            value={questionsPerPage}
            onChange={(event) =>
              setQuestionsPerPage(Number(event.target.value))
            }
          />
        </label>

        <label className="options-check">
          <input
            type="checkbox"
            checked={includeAnswers}
            onChange={(event) => setIncludeAnswers(event.target.checked)}
          />
          解答をセットにする
        </label>

        <button type="submit" className="options-submit">
          プレビューを見る
        </button>
      </form>
    </>
  );
}

export default OptionsPage;
