// バックエンドの場所を保存
// localhost = 自分のpc, 8080: バックエンドの受付番号, const: 後から変更しない変数
// あとで `${BASE_URL}/api/problems`とつなぎ通信先URLをつくる
const BASE_URL = "http://localhost:8080";

// サーバーが返す問題タイプ。Java の ProblemTypeSummary と同じ形
export type ProblemTypeSummary = {
  id: string;
  level: string;
  grade: string;
  title: string;
};

// サーバーが返す問題。Java の Problem と同じ形
export type Problem = {
  question: string;
  answer: string;
};

// getJsonでバックエンドから本文を受け取る。
// 例： 本文：[{"question":"3+5=?","answer":"8"}]
// fetch は 400 や 500 が返ってきても失敗扱いにならない。
// getJson<T>: <T>は呼び出すときに決まる仮の型 <Problem[]>なら T = Problem[]になる
// async function 変数名<型>(引数: 引数型): Promise<型>{処理}で非同期処理を行える
async function getJson<T>(path: string): Promise<T> {

  // ${BASE_URL}と${path}を結合
  // fetch()でバックエンドへGET通信
  // awaitで返事を待つ
  // 結果をresponseへ保存
  // fetch()が取得するResponseオブジェクトとは - 例：
  // 状態：200 OK
  // 本文：[{"question":"3+5=?","answer":"8"}]
  const response = await fetch(`${BASE_URL}${path}`);

  // response.okでfetchした際成功ならtrue
  if (!response.ok) {
    throw new Error(`サーバーが ${response.status} を返しました（${path}）`);
  }

  // response受取成功なら本文をJSONで読む
  return response.json();
}

// 問題のレベルを受け取る
// ProblemTypeSummary[]にある表示要素が返ってくることを期待
export function fetchProblemTypes(level?: string): Promise<ProblemTypeSummary[]> {
  // level = "中学校"などであれば?level=中学校とする
  // encodeURIComponent(): 空白や&、#などがURLの区切り記号として誤解されるのを防ぐ
  // バックエンドでは元の文字に戻って受け取れるので明示的に変換する方が安全
  const query = level ? `?level=${encodeURIComponent(level)}` : "";
  // getJsonへ学校
  return getJson<ProblemTypeSummary[]>(`/api/problem-types${query}`);
}

// fetchProblems("j3-factoring", 10)で問題取得であれば下記でURLを作りバックエンドへGET通信をする
// http://localhost:8080/api/problems?typeId=j3-factoring&count=10
export function fetchProblems(typeId: string, count: number): Promise<Problem[]> {
  return getJson<Problem[]>(
    `/api/problems?typeId=${encodeURIComponent(typeId)}&count=${count}`
  );
}
