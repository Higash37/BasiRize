// useState: 画面に値を覚えさせるReactフック
// useEffect: 描画のあとにこれをやれを登録する（サーバーへの問い合わせなど）
import { useState, useEffect } from "react";
// Link: <Link to="...">と書く。押すと画面を再読み込みせずに移動する（HTMLの<link>とは別物）
// useNavigate: 別ページに移動する関数をもらう
// useSearchParams: URLの?以降を読むフック
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// 自作
import { fetchProblemTypes, type ProblemTypeSummary } from "../api";
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

  // 初期値はなし。その代わりジェネリクスを使いどのような型かを宣言
  const [problemType, setProblemType] = useState<ProblemTypeSummary>();
  // 初期値はloading。型としてロード状態か準備完了かエラーを宣言
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");


// useEffect(() => {...}  ,  [typeId]  );
//                  ↑第1引数  ↑第2引数
//                  やること  いつやり直すか

// 画面が読み込まれる & typeIdが変化したときに呼ばれる
  useEffect(() => {
    // typeIdがnullならuseEffectに渡した関数から抜ける
    if (!typeId) return;

    // 2回目以降の通信中にreadyのままになるので、初期値としてloadingを設定
    setStatus("loading");
    fetchProblemTypes()
    // 返事が正常であれば.then((types) =>{})が動く
      .then((types) => {
        // type.id がサーバーから受け取ったtypeIdと一致するかを判定
        const found = types.find((type) => type.id === typeId);
        // 一致しなければエラーを吐く
        // throwを吐くと.catch()に飛ぶ
        if (!found) {
          throw new Error(`該当する問題タイプがありません: ${typeId}`);
        }
        // foundでとれた1件をstateに入れる
        setProblemType(found);
        // 画面を本体表示に変える
        setStatus("ready");
      })
      // 返事に異常があった際に起動する
      .catch((error) => {
        console.error(error);
        setStatus("error");
      });

      // [typeId]: 依存配列
      // 中に入れた値が前回と変わったらもう一度実行
      // 最初 + typeIdが変わったときに描画
  }, [typeId]);

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

  // 読み込み中であれば読み込み状態と返す
  if (status === "loading") {
    return (
      <div className="page-intro">
        <h1>読み込んでいます…</h1>
      </div>
    );
  }
  // エラーが吐かれたら/grade-selectへ戻らせる
  // !problemType: problemTypeが空であれば内容取得ができないとしてエラー画面を出す
  if (status === "error" || !problemType) {
    return (
      <div className="page-intro">
        <h1>内容を取得できませんでした</h1>
        <p>URLが古いか、サーバーが起動していない可能性があります。</p>
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
            `/preview?typeId=${problemType.id}&pages=${pageCount}&perPage=${questionsPerPage}&answers=${includeAnswers}`
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
            onChange={(event) => setQuestionsPerPage(Number(event.target.value))}
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
