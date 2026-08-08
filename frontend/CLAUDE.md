# CLAUDE.md（frontend）

ルートの `CLAUDE.md` を継承する。ここには**フロントエンド固有のルール**だけを書く。

---

## このディレクトリの役割

利用者が条件を選び、プリントをプレビューして印刷するまでの**画面**を担当する。

問題生成ロジックは将来バックエンド（Java / Spring Boot）へ移す。
`src/utils/problemGenerator.ts` は移行までの暫定実装であり、**捨てる前提のコード**として扱う。

---

## 技術構成

- TypeScript
- React
- Vite
- react-router-dom
- CSS（プレーンなCSS。フレームワークもCSS-in-JSも導入しない）

UIコンポーネントライブラリ（MUIなど）は**導入しない**。
理由：本人がHTML / CSS / TypeScriptを理解しながら書くことが目的であり、
ライブラリを入れると学ぶ対象が「そのライブラリの書き方」に変わるため。
部品が増えて自力で管理できなくなった時点で再検討する。

---

## ディレクトリ構成

```
src/
  components/   複数ページで使い回す部品（SubjectCard, Header, Footer, Layout）
  pages/        1つのURLに対応する画面
  utils/        画面に依存しない処理
  index.css     デザイントークンと全体に効くスタイル
  App.tsx       ルーティング
  main.tsx      アプリの入り口
```

CSSはコンポーネントと同じ名前で隣に置き、そのコンポーネントの `.tsx` から `import` する。

---

## デザイントークン

色・余白・文字サイズ・角丸・影・教科色は、すべて `src/index.css` の `:root` に定義してある。

**コンポーネントのCSSに値を直接書かない。** 必ず `var(--...)` で参照する。

新しい値が必要になったときは、まず既存のトークンで足りないかを検討する。
足りない場合のみ `:root` に追加し、**役割で命名する**（`--blue` ではなく `--color-accent`）。

主なトークン：

| 種類 | 変数 |
|---|---|
| 色 | `--color-bg` `--color-surface` `--color-muted` `--color-border` `--color-text` `--color-text-muted` `--color-accent` |
| 教科色 | `--subject-japanese` `--subject-math` `--subject-science` `--subject-social` `--subject-english` ほか |
| 余白 | `--space-2` `--space-3` `--space-4` `--space-6` `--space-8`（4の倍数） |
| 文字 | `--font-size-base` `--font-size-lg` `--font-size-xl` `--font-size-2xl`（rem、1.25倍ずつ） |
| 角丸 | `--radius` `--radius-sm` |
| 影 | `--shadow-1` `--shadow-2` |
| 変化 | `--transition` |

---

## アクセシビリティ（必須要件）

想定利用者は**大学生から高齢者までの塾講師**。以下は「できれば」ではなく**必須**とする。

1. **押せるものはネイティブ要素を使う。** `<div>` + `onClick` は禁止。
   `<button>` `<a>` を使えば、フォーカス・キーボード操作・支援技術への通知が自動で得られる。
2. **状態を色だけで伝えない。** 必ず「色 + 形（影・枠線・アイコン・位置）」の2つで表す。
   加齢により青と緑、白と黄の識別が落ちるため。
3. **文字の最小サイズは 16px。** かつ `rem` で指定し、ブラウザのフォント設定に追従させる。
4. **コントラストは WCAG AA（通常文字 4.5:1、大きい文字 3:1）以上。**
5. **フォーカスリングを `outline: none` で消さない。**
   `index.css` の `:focus-visible` で全体に適用済み。個別に上書きしない。
6. **タップ領域は最小 44×44px。**
7. **装飾のアイコン・画像には `aria-hidden="true"` か `alt=""` を付ける。**
   意味はテキストが持つ。絵文字がそのまま読み上げられると邪魔になる。

### 作業後に毎回確認すること

- **マウスを触らずTabキーだけ**で、目的の操作が最後まで到達できるか
- **Ctrl + `+` で200%**に拡大して、レイアウトが壊れないか
- 押せない要素がTab順から外れているか

---

## デザイン方針

**freee と デジタル庁の中間**。厳格さはデジタル庁寄り、トーンはfreee寄り。

| 項目 | 方針 |
|---|---|
| ベース | 白。余白を主役にする |
| アクセント | 青 `--color-accent`（押せるもの・フォーカス） |
| 立体表現 | Material Design の考え方。**影は装飾ではなく「押せる」という情報** |
| 装飾 | ミニマル。ただし**押せる手がかりは削らない** |
| イラスト・キャラクター | 使わない |
| 情報密度 | 低い。1画面1タスク |

参照先：

- デジタル庁デザインシステム https://design.digital.go.jp/dads/
- freeeアクセシビリティー・ガイドライン https://a11y-guidelines.freee.co.jp/
- SmartHR Design System https://smarthr.design/

---

## 命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| コンポーネント | PascalCase。ファイル名も一致させる | `SubjectCard.tsx` |
| propsの型 | コンポーネント名 + `Props` | `SubjectCardProps` |
| CSSクラス | kebab-case。コンポーネント名を接頭辞に | `.subject-card` `.subject-card-title` |
| 型のimport | 型だけなら `import type` を使う | `import type { ReactNode } from "react"` |

---

## コンポーネント設計の原則

- **部品は「何が起きるか」を知らない。** 遷移や処理は `onClick` などで外から受け取る。
  そうしないと同じ部品を複数の画面で使い回せなくなる。
- **propsは「渡されないケースが実際に存在するか」で必須/任意を決める。**
  念のため任意にしない。使われない分岐が増えるだけ。
- **将来のために先回りしない。** 実際の要求が出た時点で追加する。

---

## 教え方の補足

ルートの `CLAUDE.md` の教え方に加えて、**TypeScript / React は Java との比較で説明しない。**

その言語を直接説明し、「こう書く」と具体的に伝え、書き方や命名の慣習は補足として添える。
比較は翻訳の手間を増やすだけで、理解の助けにならない。
