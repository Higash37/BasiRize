// ============================================================
// サーバーとのやりとり
// ============================================================
// URLの組み立てとエラー判定を1か所にまとめる。
// 画面ごとに fetch を書くと、サーバーのアドレスが変わったときに
// 全部の画面を直すことになる。
// ============================================================

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

// fetch は 400 や 500 が返ってきても失敗扱いにならない。
// 「通信できた」時点で成功なので、中身が正常かは自分で確かめる必要がある。
async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`サーバーが ${response.status} を返しました（${path}）`);
  }

  return response.json();
}

export function fetchProblemTypes(level?: string): Promise<ProblemTypeSummary[]> {
  const query = level ? `?level=${encodeURIComponent(level)}` : "";
  return getJson<ProblemTypeSummary[]>(`/api/problem-types${query}`);
}

export function fetchProblems(typeId: string, count: number): Promise<Problem[]> {
  return getJson<Problem[]>(
    `/api/problems?typeId=${encodeURIComponent(typeId)}&count=${count}`
  );
}
