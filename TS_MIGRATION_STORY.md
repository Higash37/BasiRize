# バックエンドがいなくなった日 ― JavaからTypeScriptへの引き継ぎ物語

これは 2026-08-12、`refactor/50-typescript-problem-generation` ブランチで
Codex が進めている作業を、リアルタイムで覗き見しながら書いたメモ。

**注意：これは「移行が完了した記録」ではない。移行が始まった瞬間の
スナップショットを読み解いたもの。** まだ `backend/` は消えていないし、
コミットもまだ1つも無い。あとで答え合わせが必要。

---

## 第0章：そもそも、なぜ2つの国があったのか

このアプリには、これまで2つの国があった。

```
バックエンド国（Java / Spring Boot）    問題を作る頭脳
フロントエンド国（TypeScript / React）  画面を見せる顔
```

2つに分けた理由は、あなたが Java で「式を木構造で表す設計」を自分で組んで、
Spring Boot でAPIを立てて、というのを**学びたかったから**だった
（このプロジェクトの目的の1つが「就活で見せられるものを作る」だったのを覚えているはず）。

2つの国の間には、いつも国境検問（HTTP通信）があった。

```
ブラウザ → fetch → ネットワーク → Spring Boot → Java → JSON → ネットワーク → ブラウザ
```

この検問所のせいで、面倒なことがいくつも起きていた。

- サーバーを起動していないと何も動かない（`CLAUDE.md` に書いてある通り）
- 学年区分の文字列（`"小学校"`）を**両方の国で別々に**手書きしていた（Issue #21）
- デプロイするときサーバーが2つ要る（Docker化の課題、Issue #29）
- CORS の設定で一度詰まった経験、あれも国境の関所そのもの

**今回の作業は、2つの国を1つにする話。** 頭脳（問題生成ロジック）を
フロントエンド国に引っ越しさせて、国境検問そのものを無くす。

---

## 第1章：Javaの頭脳は、どんな部品でできていたか

覚えていると思うけど、Javaの頭脳はこういう形をしていた。

```
Expression (interface)      「式である」という約束
  ├ Num                     葉。ただの数
  └ Calculation             枝。左の式・演算子・右の式を持つ

Operator (enum)              + - × ÷

ProblemGenerator (abstract)  「10問集める」流れを1回だけ書いた親
  └ 11個の Generator         「1問だけ作る」やり方だけを書いた子
```

この設計、実はJavaの文化に強く依存している部分がある。それが今回、
TypeScriptに移すときに**そのまま持っていけた部分**と、**持っていけなかった部分**
に分かれた。ここが物語の本題。

---

## 第2章：`interface` が、実は2つの別の意味だったと気づく話

Javaでこう書いていた。

```java
interface Expression {
    int value();
    String text();
    boolean isComputable();
    int precedence();
}
```

「これができるクラスを作りたければ、必ず `implements Expression` と書け」
というのがJavaの約束だった。**宣言しないと、たとえ形が同じでも別物として扱われる。**

いま `src/problem-generation/expression.ts` にはこう書いてある。

```typescript
export type Expression = {
  value(): number;
  text(): string;
  isComputable(): boolean;
  precedence(): number;
};

export class Num implements Expression {
  ...
}
```

**見た目はほぼ同じ。** `interface` が `type` に変わって、`implements` はそのまま残った。

でも中身の考え方は、実はまったく違う。TypeScriptにはこういう性質がある。

```typescript
const something = {
  value: () => 42,
  text: () => "42",
  isComputable: () => true,
  precedence: () => 3,
};

// これは Expression 型として通る。implements なんて一度も書いていないのに。
const asExpression: Expression = something;
```

**「形が合っていれば、それでいい」。** これを構造的型付け（structural typing）と呼ぶ。
Javaは逆で、**「これです」と宣言したものだけが、そのグループの一員**（名前的型付け）。

`Num` クラスに `implements Expression` と書いてあるのは、**書かなくても動くのに
あえて書いている。** 読む人に「これはExpressionの一員のつもりです」と伝えるための、
いわば**注釈**。Javaでは強制だったものが、TypeScriptでは**親切心**に変わった。

これが「超概念」その1。**型が「名前」で決まるか「形」で決まるか。**
言語を跨いで一番効いてくる違いは、実はここ。

---

## 第3章：`enum` が消えて、ただのオブジェクトになった話

Javaの演算子はこうだった。

```java
enum Operator {
    ADD, SUBTRACT, MULTIPLY, DIVIDE;
}
```

`operator.ts` を覗くと、こうなっている。

```typescript
export const Operator = {
  ADD: "add",
  SUBTRACT: "subtract",
  MULTIPLY: "multiply",
  DIVIDE: "divide",
} as const;

export type Operator = (typeof Operator)[keyof typeof Operator];
```

**最初に見ると面食らう書き方。** 何が起きているか、順番に見る。

1. `const Operator = { ADD: "add", ... }` ― まず、ただのJavaScriptオブジェクトを作る
2. `as const` ― 「この中身は絶対に変わらない。`"add"` という**文字列そのもの**として扱え」
   という念押し。これが無いと、TypeScriptは `ADD` の型をただの `string` だと
   ぼかしてしまう
3. `type Operator = (typeof Operator)[keyof typeof Operator]` ― さっき作った
   オブジェクトの**値だけを集めて型にする**。結果は `"add" | "subtract" | "multiply" | "divide"`
   という**4つの文字列のどれか**という型になる

つまり最終的にできあがるのは、こういう型。

```typescript
type Operator = "add" | "subtract" | "multiply" | "divide";
```

**これがTypeScriptの enum の書き方（の、今どき推奨される方）。**
TypeScript自体にも `enum` というキーワードは存在するけど、
実行時に余計なコードを生成してしまう欠点があって、最近は
「文字列そのものを型として使う（リテラル型のユニオン）」ほうが好まれる。

これが超概念その2。**「値の集合」を型として表現できる。**
Javaは `enum` という専用の道具が要ったけど、TypeScriptは
**ただの文字列を並べるだけ**でこれができる。

### この考え方が、Issue #21 を消していた

前に立てた [Issue #21](https://github.com/Higash37/BasiRize/issues/21) を覚えてる？
「学年区分の文字列がフロントとサーバーで二重管理」というやつ。

`types.ts` を見ると：

```typescript
export type Level = "小学校" | "中学校" | "高校";
```

**これがまさに、さっきの `Operator` と同じ書き方。** 3つの文字列だけが許される型。

前は「小学校」という文字列を Java と TypeScript の**両方に**手で書いていて、
片方だけ `"小学生"` と誤字っても、コンパイラは気づけなかった
（サーバーは0件を正常な結果として返すので、実行するまで分からない）。

今は**書く場所が1つしかない。** 誤字はここで即座に赤くなる。
「フロント一本化」で一番実利があるのは、実は見た目の派手さより
**こういう地味な二重管理の消滅**だったりする。

---

## 第4章：`Random` が、ただの関数になった話

Javaはこうだった。

```java
protected final Random random;

protected ProblemGenerator(Random random) {
    this.random = random;
}

protected int randomNumber(int min, int max) {
    return random.nextInt(max - min + 1) + min;
}
```

`generator.ts` はこう。

```typescript
export type RandomSource = () => number;

export abstract class ProblemGenerator implements ProblemGeneratorType {
  private readonly random: RandomSource;

  protected constructor(random: RandomSource) {
    this.random = random;
  }

  protected randomNumber(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }
}
```

`Random` という**オブジェクト**を受け取っていたのが、
`RandomSource`（`() => number` という**関数そのもの**）を受け取る形に変わっている。

これが超概念その3。**「何かをしてくれるモノ」を、オブジェクトではなく
関数1個として渡せる。**

Javaでは「乱数を出す係」が欲しければ、`nextInt()` というメソッドを持った
`Random` オブジェクトが必要だった。TypeScript（というかJavaScript）では、
**関数それ自体が「値」として扱える**ので、わざわざオブジェクトに包まなくていい。

```typescript
const random: RandomSource = () => Math.random();      // 本番用
const random: RandomSource = () => 0.5;                  // テスト用。常に真ん中
```

`backend/CLAUDE.md` に書いてあった「Random はコンストラクタで外から受け取る
（テストで結果を固定するため）」というルールは、**まったく同じ理由で
そのまま生きている。** 手段（オブジェクトか関数か）は変わったけど、
「外から差し替えられるようにする」という設計思想は1ミリも変わっていない。

---

## 第5章：`generate()` の中身が、ほぼ1文字も変わっていない話

一番びっくりするのはここ。Javaの `generate()`：

```java
List<Problem> generate(int count) {
    List<Problem> problems = new ArrayList<>();
    Set<String> seen = new HashSet<>();
    int limit = count * 100;

    for (int attempt = 0; attempt < limit && problems.size() < count; attempt++) {
        Problem p = generateProblem();
        if (seen.add(p.question())) {
            problems.add(p);
        }
    }

    if (problems.size() < count) {
        throw new IllegalStateException(...);
    }
    return problems;
}
```

TypeScriptの `generate()`：

```typescript
generate(count: number): Problem[] {
  const problems: Problem[] = [];
  const seen = new Set<string>();
  const limit = count * 100;

  for (let attempt = 0; attempt < limit && problems.length < count; attempt += 1) {
    const problem = this.generateProblem();
    if (!seen.has(problem.question)) {
      seen.add(problem.question);
      problems.push(problem);
    }
  }

  if (problems.length < count) {
    throw new Error(...);
  }
  return problems;
}
```

**構造が完全に同じ。** `List` → 配列、`Set` → `Set`（そのまま）、
`for` の書き方もほぼ同じ。「abstract な親が流れを決めて、
子が1箇所だけ埋める」という設計もそのまま。

ここで分かる超概念その4。**「重複しないものをN個集めて、
無理なら諦めて例外を投げる」というアルゴリズムには、
言語は関係ない。** これはJavaの知識でもTypeScriptの知識でもなく、
**プログラミングそのものの知識**。1回ちゃんと設計を組めば、
言語が変わっても資産として持ち運べる。

唯一違うのは `seen.add(p.question())` が1行でできていたのが、
TypeScriptだと `seen.has(...)` と `seen.add(...)` の2行に分かれていること。
Javaの `Set.add()` は「新規なら true」を返してくれる親切設計だったけど、
JavaScriptの `Set.add()` は`Set`自身を返すだけで、追加できたかを教えてくれない。
だから先に `has()` で確認してから `add()` している。**小さな言語差だけど、
「1行でできていたことが2行になった」という実例として面白い。**

---

## 第6章：もし面接で聞かれたら ― 「なぜフロントだけにしたの？」

ここまでの話を踏まえて、**正直な損得**を整理しておく。
片方だけ話すと嘘っぽくなるので、両方言えるようにしておくのがいい。

### 一本化のメリット

| 観点 | 内容 |
|---|---|
| **デプロイが1つになる** | サーバー2つ立てる必要がなくなる。Java実行環境も要らない |
| **通信が消える** | `fetch` して `.then()` で待つ、という非同期の複雑さがまるごと不要に。同期関数として呼べる |
| **二重管理が消える** | 学年区分の文字列のような「両方に書く」ものが物理的に無くなる（第3章） |
| **型が国境を跨げる** | 今までは「JavaのProblemTypeSummaryとTypeScriptのProblemTypeSummaryが同じ形であることを、人間が目で確認する」しかなかった。1つの言語なら、コンパイラが保証してくれる |
| **開発サイクルが速くなる** | サーバーの再起動を待たずに、画面の変更がそのまま反映される |

### 一本化のデメリット（ここも言えると強い）

| 観点 | 内容 |
|---|---|
| **計算がブラウザ任せになる** | 問題生成がユーザーのPCで動く。重い処理を増やすと、ユーザーの端末次第で遅くなる |
| **ロジックが丸見えになる** | サーバー側にあった生成ロジックが、ブラウザに配信するJSに含まれる。今回は「答えを隠す相手がいない」設計だったので実害は無いが、将来もし「先生には見せるが生徒には見せない」機能を作るなら、この前提が崩れる |
| **Javaの資産が使われなくなる** | 式を木構造で表現する設計、record、abstract class ― 学んだこと自体は資産だが、動いているコードとしては眠る |
| **サーバーサイドの経験値が積みにくい** | 「バックエンドとフロントエンドを両方書ける」というアピールが、「TypeScriptだけ書ける」に変わる |

### 一番大事な1行

**「最初はJavaとSpring Bootで分離することで設計の勉強をしたが、
実際にプロダクトとして動かす段階で、疎通のコストが学びのコストを
上回ったので統合した」** ― これが言えれば、単なる手抜きではなく
**判断として一本化した**という話になる。

（ただしこれは今の時点での仮説。実際にどう感じたかは、
移行が終わったあとで自分の言葉に直すこと。**まだ移行の途中でこれを
断定するのは早い。**）

---

## 終章：いま何が起きていないか

物語なので、最後に現実を書いておく。

- `backend/` は**まだ削除されていない**
- Issue #23〜#29（帯分数・分数と整数の混在・筆算・JUnit・高2以降・Docker）は
  **フロント移行後もそのまま残る課題。** 言語を変えても、機能が無いことは変わらない
- `src/problem-generation/` はまだ7ファイルだけで、
  `ArithmeticGenerator` や `SimultaneousEquationGenerator` に相当するものは
  まだ出てきていない（2026-08-12 時点）

続きはまた覗きに行く。
