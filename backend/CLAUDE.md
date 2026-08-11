# CLAUDE.md（backend）

ルートの `CLAUDE.md` を継承する。ここには**バックエンド固有のルール**だけを書く。

---

## このディレクトリの役割

問題生成ロジックを持ち、REST API として画面に提供する。

`gradle init` で作ったコンソールアプリに **Spring Boot を後から足した**構成。
Spring Initializr で立て直してはいない（ドメインモデルが先に完成していたため、
プロジェクトごと作り直すとクラスの引っ越しになるだけだった）。

`./gradlew run` で `Main`（目視確認用）、`./gradlew bootRun` でサーバーが起動する。

---

## 技術構成

- Java
- Spring Boot
- Gradle
- JUnit 5

DB・Docker・認証・AI連携は導入しない。必要になった時点で改めて判断する。

---

## 最重要ルール：生成ロジックと Web API を分離する

**`org.springframework` を import してよいのは Controller だけ。**

問題生成のクラスに Spring の型が混ざった時点で設計を誤っている。

理由：

- 生成ロジックが HTTP を知らなければ、サーバーを起動せず JUnit だけでテストできる
- 「REST をやめる」と「問題を追加する」は無関係な変更なので、同じファイルを触るべきではない

---

## クラス設計

### 値（データを持つだけ）

```
Problem              問題文と答えをセットで持つ（分けない）
Fraction             分数。作られた時点で約分され、符号は分子側に寄る
ArithmeticSetting    四則演算の設定。範囲 / 項数 / 演算子 / 負数 / 答えの上限
```

### 式（木構造）

```
Expression           interface。value() / text() / isComputable() / precedence()
  ├ Num              葉。数を1つ持つ
  └ Calculation      枝。左の式・演算子・右の式を持つ
Operator             enum。+ - × ÷。記号 / 計算 / 優先順位を持つ
```

`Calculation` の左右が `Expression` なので、木が自分自身を含められる。
これで項数を増やしても、かっこや計算の順序が木の形だけで正しく表せる。

### 生成器

```
ProblemGenerator            abstract。重複排除・試行上限・乱数を共通で持つ
  ├ ArithmeticGenerator     整数の四則。木を組み立てる。設定違いで小1〜中1
  ├ ExactDivisionGenerator  割り切れるわり算（九九の逆）
  ├ RemainderDivisionGenerator あまりのあるわり算
  ├ FractionGenerator       分数の四則
  ├ LikeTermsGenerator      同類項
  ├ LinearEquationGenerator 一次方程式
  ├ SimultaneousEquationGenerator 連立方程式
  ├ ExpansionGenerator      式の展開
  ├ FactoringGenerator      因数分解（高1発展も同じクラス）
  ├ QuadraticEquationGenerator 二次方程式（高1発展も同じクラス）
  └ SquareRootGenerator     平方根
```

### 補助

```
Polynomial           文字式の表示。1x を x に、+ -4 を - 4 にする判断を1か所に
Curriculum           学年ごとの ArithmeticSetting を並べた場所
Main                 動作確認用。bootRun とは別の入口として残してある
```

### 問題タイプと Web 層

```
ProblemType          record。id / level / grade / title / generator を束ねる
ProblemTypeSummary   record。API が返す形。generator を外に出さないため別に持つ
ProblemTypeRegistry  22タイプを保持し、id で引く / 学年区分で絞る
ProblemController    HTTP の入り口。@RestController
BasirizeApplication  起動クラス。@Bean で Registry を組み立てる
```

**`ProblemType` を interface にしなかった理由。** 1つの生成器が複数の問題タイプを
担うため（`FactoringGenerator` は中3と高1の両方、`ArithmeticGenerator` は8タイプ）。
生成器側に id やタイトルを持たせると、この1対多が表現できない。
「生成器 + 説明情報」を組み合わせる record にすることで、クラスを増やさずに
タイプを増やせる。

**`org.springframework` を import しているのは `ProblemController` と
`BasirizeApplication` の2つだけ。** Registry に `@Component` を付けず
`BasirizeApplication` の `@Bean` で組み立てているのは、生成ロジック側に
Spring を一切入れないため。

### 判断基準

- **問題文と答えは1つの型にまとめる。** 別々のリストにすると対応がズレても検知できない。
- **クラスを分けるかどうかは「アルゴリズムが同じか」だけで決める。**
  範囲や係数が違うだけなら、設定を持つ1クラスをインスタンス違いで使う。
  例：因数分解は中3も高1も `FactoringGenerator`。範囲だけ変える。
- **Random はコンストラクタで外から受け取る。** テストで結果を固定できるようにするため。
- **式に生成条件を持たせない。**
  「0で割っていないか・割り切れるか」は式そのものの性質なので `Expression.isComputable()`。
  「マイナス禁止・答えの上限」は生成側の都合なので `ArithmeticGenerator.isAcceptable()`。
  分けておくと `Calculation` を他の問題タイプでも使い回せる。
- **答えが数値にならないものは木に載せない。**
  `Expression.value()` は `int` を返す約束。「3 あまり 2」や `1/2` は収まらない。
  無理に載せると `Num`・`Calculation`・`Operator` まで作り直しになるので、独立した生成器にする。
- **Controller は実装クラスを知らない。** Registry 経由で ProblemType を取得する。

### 作り方の2パターン

| 方式 | 使う場面 | 例 |
|---|---|---|
| **作る → 検査 → ダメなら作り直す** | 条件が絡み合って逆算できない | 四則混合（`ArithmeticGenerator`） |
| **答えから逆算する** | 答えを先に決められる | わり算・方程式・因数分解 |

逆算できるなら逆算する方が速く確実。方程式は「解く処理」を書かずに済む。

---

## 命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| クラス・interface・record | PascalCase | `Expression` `Calculation` |
| メソッド・変数 | camelCase | `generateProblems` `minValue` |
| 定数 | UPPER_SNAKE_CASE | `MAX_TERM_COUNT` |
| enum の値 | UPPER_SNAKE_CASE | `ADD` `SUBTRACT` |
| パッケージ | 全部小文字 | `com.basirize` |
| `boolean` を返すメソッド | `is` / `has` / `can` で始める | `isNegative()` |

### 判断基準

- **略さない。** ただし分野で定着している略語（`id` `url`）は使ってよい。
  `Expr` ではなく `Expression`。Java の文化は略さない側（`ArrayList` `InputStreamReader`）。
- **`java.lang` にある名前は使わない。** `Number` `String` `Object` など。
  同名のクラスを自分で作ると、標準のものと紛らわしくなる。
- **1文字違いの名前を並べない。** `Operation` と `Operator` は読む人が必ず間違える。

---

## 用語集（日本語 → クラス名）

| 日本語 | 名前 |
|---|---|
| 式 | `Expression` |
| 数 | `Num` |
| 計算（左・演算子・右） | `Calculation` |
| 演算子 | `Operator` |
| 分数 | `Fraction` |
| 問題（問題文と答え） | `Problem` |
| 問題タイプ | `ProblemType` |
| 四則演算の設定 | `ArithmeticSetting` |
| 学年ごとの設定集 | `Curriculum` |
| 文字式の表示 | `Polynomial` |
| 生成器の共通部分 | `ProblemGenerator` |
| 割り切れるわり算 | `ExactDivisionGenerator` |
| あまりのあるわり算 | `RemainderDivisionGenerator` |

生成器のクラス名は `〜Generator` で統一する。

新しい概念が出たら、まずここに日本語と名前の対を追加してから実装する。
「式って結局どのクラスだっけ」を後から調べ直さずに済む。

---

## API の方針

```
GET /api/problem-types            → 全22件
GET /api/problem-types?level=小学校 → その学年区分だけ
  → [{ id, level, grade, title }]

GET /api/problems?typeId=...&count=20
  → [{ question, answer }]
```

エラーの返し方：

| 状況 | ステータス |
|---|---|
| `count` が 1〜200 の外 | 400 |
| 存在しない `typeId` | 404 |
| 範囲内で作れる数より多く要求された | 400（`IllegalStateException` を変換） |

**送り手の間違いを 500 で返さない。** 500 は「こちらが壊れている」の意味なので、
要求内容の問題は 400 か 404 にする。

- `count` は**合計問題数**を渡す。ページ分割は印刷レイアウトの都合なので画面側の責務。
- **答えはクライアントに返してよい。** 利用者は講師であり、答えを隠す相手が存在しない。
  再検討する条件：生徒が直接アクセスする機能を追加するとき。
- **アイコン（絵文字）はサーバーが持たない。** 表示の都合なので画面側の責務。

---

## テスト観点

各 `ProblemType` について：

- 指定範囲内の数値だけが使われる
- 指定された問題数が生成される
- 正答が正しい
- 負数を許可しない設定で負数が出ない
- 重複した問題が生成されない
- 境界値（最小値 = 最大値）で正しく動く

`ProblemTypeRegistry` について：

- 全 id が一意である
- 存在しない id を渡したときの挙動が定義されている

`ProblemController` について：

- 正常なリクエストで 200 が返る
- 不正な `count` で 400 が返る

---

## 既知の課題

### 解決済み

- ~~範囲内で作れる問題数より多く要求すると無限ループする~~
  → `ProblemGenerator.generate()` が試行回数を `count × 100` で切り、
  作れなければ `IllegalStateException` で止める
- ~~四則混合に `÷` がほとんど出ない~~
  → 割る数を「左の値の約数」から選ぶ方式に変更（`ArithmeticGenerator.randomDivisorOf`）
- ~~問題文に余計なかっこが付く（`(3 + 5) = ?`）~~
  → `precedence()` で必要なときだけ付ける

### 未解決

- **数ごとに範囲を分けられない。** `ArithmeticSetting` の `min`/`max` が式中の全数に一律で効く。
  「2位数×1位数」のような指定ができず、小3のかけ算に `3 × 13` と `17 × 6` が混ざる。
  わり算はこの制約を避けるため専用クラスに分けてある。
- **帯分数が出せない。** 答えが `23/20` のまま。小5以降は `1と3/20` が普通。
- **分数と整数を混ぜられない。** `2 + 1/3` や3項以上の分数計算。
  `Fraction` が `Expression` ではないため。対応するなら `value()` の戻り値を
  `Fraction` に変える大改修になるので、必要になってから判断する。
- **筆算形式が無い。** 指導要領は筆算が中心だが、いまは横書きの式のみ。
- **テストが1本も無い。** JUnit 未着手。
- **高2以降が未着手。** 三角関数・指数対数・微積分など。

---

## 実装の進め方（動かしながら作る）

**部品を1つ作るたびに `Main` から `println` で出力し、目で見て確かめてから次へ進む。**

理由：動いているものを見ないと、その部品が何をしているのか腹に落ちない。
まとめて書いてから動かすと、どこが原因か分からなくなる。

```
部品を1つ書く
  ↓
Main に println を足す
  ↓
.\gradlew run で見る
  ↓
想像どおりなら次の部品へ
```

- **テストは後回しでよい。** まず動くものを見る。JUnit は形が固まってから書く。
- `Main.java` は確認専用の使い捨て。`println` は書き換えても消してもよい。
- 実行コマンドは `backend` で `.\gradlew run`。
- `app/build.gradle` の `mainClass` は `com.basirize.Main` を指すこと。

Spring Boot をかぶせた後は `Main` は不要になる。それまでの足場として使う。

---

## 進め方

**17種類の問題タイプを一度に移植しない。** 縦串を1本通してから広げる。

1. ~~Spring Boot を足す~~ 完了
2. ~~エンドポイントを1本作る~~ 完了
3. ~~画面を API 経由に切り替える（CORS にぶつかった）~~ 完了
4. ~~問題タイプの一覧もサーバーへ移す~~ 完了。`problemGenerator.ts` は削除済み
5. Docker でコンテナ化する
6. JUnit を書く

理由：リスクが高いのは Java を書くことではなく、**画面とサーバーが繋がるかどうか**。
先に通信経路を通しておけば、後の作業は「ブラウザを更新すれば結果が見える」状態で進められる。

**id をフロントと一致させる作業は発生しなかった。** 一覧もサーバーへ移したため、
問題タイプの出どころがサーバー1つになっている。id を変えると画面のURLが壊れるので、
一度決めた id は変えない。

---

## 環境メモ

- `build.gradle` に `tasks.withType(JavaCompile) { options.encoding = 'UTF-8' }` が必要。
  これがないと日本語が文字化けする（Gradle が標準で UTF-8 として読まないため）。
- 詳細はリポジトリルートの `TROUBLESHOOTING.md` を参照。

### Spring Boot 4 系での注意

**ネット上の記事はほぼ3系なので、そのまま写すと動かない。**

```
spring-boot-starter-web         → spring-boot-starter-webmvc
spring-boot-starter-test        → spring-boot-starter-webmvc-test
```

バージョンや依存名を確認するときは、記事ではなく https://start.spring.io で
同じ条件（Gradle - Groovy / Java 21 / Spring Web）を選び、生成される
`build.gradle` を見る。それが常に最新の正解。

### `bootRun` が `Main` を起動してしまうとき

`application` プラグインが入っていると、`bootRun` は `springBoot { mainClass }`
ではなく `application { mainClass }` を見る。タスクに直接指定して上書きする。

```gradle
tasks.named('bootRun') {
    mainClass = 'com.basirize.BasirizeApplication'
}
```
