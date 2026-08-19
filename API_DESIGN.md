# API_DESIGN

フロントエンド（React）とバックエンド（Java）の受け渡し仕様。

**現時点では未実装。** バックエンドに Spring Boot が入っておらず、HTTP の入り口がない。
この文書は「どう渡すか」を先に決めておくためのもの。

---

## 現状

| 層 | 状態 |
|---|---|
| 問題を作るロジック（Java） | 完成。21種類 |
| id・学年などのメタ情報 | 無い |
| HTTP の入り口 | 無い |
| フロントの受け取り画面 | 無い（`problemGenerator.ts` はどこからも import されていない） |

フロントの `src/utils/problemGenerator.ts` は、バックエンドが繋がるまでの暫定実装。
繋がった時点で捨てる。

---

## エンドポイント

### 問題タイプの一覧

```
GET /api/problem-types
GET /api/problem-types?level=小学校
```

`level` は任意。省略すると全件返す。

```json
[
  {
    "id": "e1-add-sub",
    "level": "小学校",
    "grade": "小1",
    "title": "たし算・ひき算（くり上がりなし）",
    "description": "1桁どうしのたし算・ひき算"
  }
]
```

### 問題の生成

```
GET /api/problems?typeId=e1-add-sub&count=20
```

```json
[
  { "question": "3 + 5 = ", "answer": "8" },
  { "question": "7 - 2 = ", "answer": "5" }
]
```

---

## 決めたこと

- **答えはクライアントに返す。** 利用者は講師であり、答えを隠す相手がいない。
  再検討する条件：生徒が直接アクセスする機能を追加するとき。
- **`count` は合計問題数。** ページ分割は印刷レイアウトの都合なので画面側の責務。
- **アイコン（絵文字）はサーバーが持たない。** 表示の都合なので画面側の責務。
  `problemTypes` の `icon` はフロント側に残す。
- **`answer` は文字列。** `x = 2, y = 3` や `(x + 3)(x - 5)` のように数値で表せない答えがある。
- **`level` / `grade` は日本語のまま。** 表示にそのまま使えるので変換の手間がない。
  多言語対応が必要になったら再検討する。

---

## 問題タイプの対応表

フロントの id と、Java 側の生成器の対応。
**移行中は id をフロントと完全に一致させる。** 一覧はフロント、生成はサーバー、
という混在状態でも矛盾なく動かせるようにするため。

| id | 学年 | タイトル | Java 側 |
|---|---|---|---|
| `e1-add-sub` | 小1 | たし算・ひき算（くり上がりなし） | `ArithmeticGenerator` + `Curriculum.grade1AddSubtract()` |
| `e2-add-sub-carry` | 小2 | たし算・ひき算（くり上がりあり） | `ArithmeticGenerator` + `grade2AddSubtract()` |
| `e2-multiplication-table` | 小2 | かけ算九九 | `ArithmeticGenerator` + `grade2MultiplicationTable()` |
| `e3-multiplication-division` | 小3 | かけ算・わり算 | **要検討**（下記） |
| `e4-mixed` | 小4 | 四則混合（3口の計算） | `ArithmeticGenerator` + `grade4Mixed()` |
| `e5-mixed-advanced` | 小5 | 四則混合（発展） | `ArithmeticGenerator` + `grade5Mixed()` |
| `e6-mixed-final` | 小6 | 四則混合（総まとめ） | `ArithmeticGenerator` + `grade6Mixed()` |
| `j1-signed-numbers` | 中1 | 正負の数の計算 | `ArithmeticGenerator` + `juniorHigh1SignedNumbers()` |
| `j1-like-terms` | 中1 | 文字式（同類項をまとめる） | `LikeTermsGenerator` |
| `j1-linear-equation` | 中1 | 一次方程式 | `LinearEquationGenerator` |
| `j2-simultaneous-equations` | 中2 | 連立方程式 | `SimultaneousEquationGenerator` |
| `j3-expansion` | 中3 | 式の展開 | `ExpansionGenerator` |
| `j3-factoring` | 中3 | 因数分解 | `FactoringGenerator(maxRoot=9)` |
| `j3-quadratic-equation` | 中3 | 二次方程式 | `QuadraticEquationGenerator(maxRoot=9)` |
| `j3-square-root` | 中3 | 平方根の計算 | `SquareRootGenerator` |
| `h1-factoring-advanced` | 高1 | 因数分解（発展） | `FactoringGenerator(maxRoot=15)` |
| `h1-quadratic-equation` | 高1 | 二次方程式 | `QuadraticEquationGenerator(maxRoot=15)` |

### フロントにまだ無い問題タイプ

Java 側だけにあるもの。フロントに追加するときに id を決める。

| 学年 | 内容 | Java 側 | id 案 |
|---|---|---|---|
| 小3 | わり算（九九の逆） | `ExactDivisionGenerator` | `e3-division` |
| 小3 | あまりのあるわり算 | `RemainderDivisionGenerator` | `e3-division-remainder` |
| 小4 | 同分母の分数の加減 | `FractionGenerator(sameDenominator=true)` | `e4-fraction-add-subtract` |
| 小5 | 異分母の分数の加減 | `FractionGenerator(sameDenominator=false)` | `e5-fraction-add-subtract` |
| 小6 | 分数のかけ算・わり算 | `FractionGenerator([MULTIPLY, DIVIDE])` | `e6-fraction-multiply-divide` |

### 要検討：`e3-multiplication-division`

フロントは「かけ算・わり算」を1つの問題タイプにしているが、Java 側は
`ArithmeticGenerator`（かけ算）と `ExactDivisionGenerator`（わり算）に分かれている。

理由：`ArithmeticSetting` の `min`/`max` が式中のすべての数に一律で効くため、
「割られる数は81まで、割る数は9まで」という九九の逆が作れない。

選択肢：

- **A. フロント側を2つに分ける**（`e3-multiplication` と `e3-division`）
  → サーバーの構造がそのまま出る。分かりやすい
- **B. サーバー側で2つの生成器の結果を混ぜて返す**
  → フロントの id を変えずに済む。ただし混ぜる比率を決める必要がある

未決定。

---

## TypeScript 側の型

繋いだあと `problemGenerator.ts` の型はこう変わる想定。
`generate` と `icon` が消え、サーバーから受け取る形になる。

```ts
export type Problem = {
  question: string;
  answer: string;
};

export type Level = "小学校" | "中学校" | "高校";

export type ProblemType = {
  id: string;
  level: Level;
  grade: string;
  title: string;
  description: string;
};
```

`icon` はフロント側で id から引く。

```ts
const ICONS: Record<string, string> = {
  "e1-add-sub": "➕",
  "e2-multiplication-table": "✖️",
};
```

---

## 未決定

- **エラーレスポンスの形式。**
  不正な `count` で 400、存在しない `typeId` で 404 までは決まっているが、
  本文の形（`{ "message": "..." }` など）は未定。
- **CORS の設定範囲。** 開発中は `localhost:5173` のみ許可する想定。
- **`count` の上限。** 大きすぎる値を弾く必要がある。100問程度が妥当か。
- **問題の再現性。** 同じプリントをもう一度出したい要求があるなら、
  シード値をリクエストに含めて返す形が要る。`Random` は既に外から受け取る形になっている。

---

## 実装順序

**リスクが高いのは Java を書くことではなく、画面とサーバーが繋がるかどうか。**
先に通信経路を通しておけば、後の作業は「ブラウザを更新すれば結果が見える」状態で進められる。

1. **Spring Initializr でプロジェクトを立て直す**
   いまの `backend` は `gradle init` で作ったコンソールアプリで、Spring Boot ではない
2. **ハードコードした数問を JSON で返す入り口を1本作る**
   ここで本物の生成器を繋がない。繋がらなかったときに、
   原因が通信なのかロジックなのか分からなくなるため
3. **フロントから叩く**（CORS にぶつかる）
4. **`ProblemType` / `ProblemTypeRegistry` を入れて本物に差し替える**
5. Docker

`org.springframework` を import してよいのは Controller だけ。
生成ロジックに Spring の型が混ざった時点で設計を誤っている。
