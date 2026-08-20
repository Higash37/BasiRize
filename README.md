# BasiRize

Teacher Worksheet Generation Platform

BasiRize is a web service that helps teachers create printable worksheets by specifying conditions such as topic, difficulty, and number of questions.

The long-term goal is to reduce the time teachers spend preparing materials and allow them to focus more on teaching.

# BasiRize（ベーシライズ）

教師向け教材作成Webサービス

BasiRizeは、学年・単元・難易度・問題数などの条件を指定することで、印刷可能な演習プリントを作成できるWebサービスです。

将来的には、教材作成にかかる時間を減らし、教師がより生徒と向き合える時間を増やすことを目指します。

## Current architecture

BasiRize is a client-side React application. Problem types and worksheets are generated locally in the browser with TypeScript, so no application backend is required.

```text
React pages → TypeScript problem generators → printable worksheet
```

## ローカル起動

```bash
npm install
npm run dev
```

## 確認

```bash
npm test
npm run build
npm run lint
```

問題生成の設計は [`PROBLEM_GENERATION_DESIGN.md`](./PROBLEM_GENERATION_DESIGN.md) を参照してください。

## Render設定

Reactアプリはリポジトリのルートに配置している。

| 項目 | 設定値 |
| --- | --- |
| Root Directory | 空欄 |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

React Routerの画面を直接開いた場合にも `index.html` を返すため、
`/*` から `/index.html` へのRewriteルールを設定する。
