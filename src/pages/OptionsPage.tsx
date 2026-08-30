// useState: 画面に値を覚えさせるReactフック
import { useState } from "react";
// Link: <Link to="...">と書く。押すと画面を再読み込みせずに移動する（HTMLの<link>とは別物）
// useNavigate: 別ページに移動する関数をもらう
// useSearchParams: URLの?以降を読むフック
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

// 自作
import { getProblemTypeById } from "../problem-generation";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";
import { enFlagshipTypes } from "../data/enFlagshipTypes";
import { trackOptionsSubmitted } from "../analytics";
import ErrorPage from "../components/ErrorPage";
import FlowStepper from "../components/FlowStepper";
// CSSスタイル
import "./OptionsPage.css";

function OptionsPage() {
  const navigate = useNavigate();
  // []から取り出す書き方
  // useSearchParams(): [URLを読む道具, URLを書き換える関数]
  // useSearchParams() は2つ入った配列を返すので、その1つ目だけを取り出してsearchParamsと名付ける
  // なぜ[searchParams]なのか?: []を左辺に書かないと配列まるごとが入ってしまい、getメソッドが使えないため
  const [searchParams] = useSearchParams();
  const { typeId: pathTypeId } = useParams();
  // .get(...)はキーがtypeIdの値を返す。無ければ null
  // /options?typeId=e1-add-subであれば、typeIdがキー・e1-add-subが値
  const typeId = pathTypeId ?? searchParams.get("typeId");
  // useState(初期値) が [今の値, 変える関数] を返す。それを2つに分けて受け取る
  const [pageCount, setPageCount] = useState(1);
  // 解答を用意するかどうかデフォルトを設定
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const problemType = typeId ? getProblemTypeById(typeId) : undefined;
  const questionsPerPage = problemType?.recommendedQuestionsPerPage ?? 10;

  const enFlagship = problemType
    ? enFlagshipTypes.find((type) => type.typeId === problemType.id)
    : undefined;

  useDocumentMetadata(
    problemType
      ? {
          // 学年をタイトルタグの先頭に含める。表示上のh1やカードの見出しは
          // problemType.titleのままで変えず、検索結果に出るtitleタグだけを
          // 学年つきにして区別する（同じ単元名を複数学年で使う場合の重複防止）
          title: `${problemType.grade}・${problemType.title}の無料問題プリント | BasiRize`,
          description: problemType.description,
          canonicalPath: `/problems/${problemType.id}`,
          alternates: enFlagship
            ? [
                {
                  hreflang: "en",
                  path: `/en/worksheets/${enFlagship.slug}`,
                },
              ]
            : undefined,
          breadcrumbs: [
            { name: "数学", path: "/" },
            {
              name: problemType.level,
              path: `/content-select?level=${problemType.level}`,
            },
            { name: problemType.title, path: `/problems/${problemType.id}` },
          ],
        }
      : undefined,
  );

  // 早期リターン（ガード節）
  // typeIdがなければ/grade-selectへ戻らせる
  if (!typeId) {
    return (
      <ErrorPage
        reason="missing-type"
        title="内容が指定されていません"
        message="学年区分を選び直してください。"
      />
    );
  }

  if (!problemType) {
    return (
      <ErrorPage
        reason="type-not-found"
        title="内容を取得できませんでした"
        message="URLが古いか、問題タイプが削除された可能性があります。"
      />
    );
  }

  return (
    // <>: フラグメント。関数が返せる値は1つだけなので、フラグメントで包む
    <>
      <div className="sticky-page-header">
        <FlowStepper
          level={problemType.level}
          current="options"
          problemType={{ id: problemType.id, title: problemType.title }}
        />

        <div className="page-intro">
          <h1>{problemType.title}の設定</h1>
        </div>
      </div>

      <form
        className="options-form"
        onSubmit={(event) => {
          // ブラウザの再読み込み規定動作を消す
          event.preventDefault();
          trackOptionsSubmitted({
            typeId: problemType.id,
            pageCount,
            questionsPerPage,
            includeAnswers,
          });
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

        <p className="options-summary">
          1ページにつき{questionsPerPage}問、合計
          {pageCount * questionsPerPage}問を作成します。
        </p>

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
