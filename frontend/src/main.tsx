// Reactアプリの入り口
// Javaでいう public static void mainのような位置付け
// main.tsxの役割は作ったAppという部品をHTMLに差し込むこと
// アプリ全体で1回だけ読み込まれる

import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import * as Sentry from "@sentry/react";
import App from "./App";
import "./index.css";
import { initializeAnalytics } from "./analytics";


initializeAnalytics();
// エラーを検知するための追加設定
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  dataCollection: {
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#dataCollection
    // 個人情報とHTTP本文は収集しない
    userInfo: false,
    httpBodies: [],
  },
});
// 関数: createRoot(...) → 単独で存在する
// メソッド: obj.render(...) → 何かのオブジェクトに属している

// createRoot()が返したオブジェクトのメソッドがrender()

// createRoot() はreact-dom/clientパッケージからインポートしないといけない
// documentはブラウザ本体（DOM API）が持っているのでインポート不要
createRoot(document.getElementById("root")!).render(
<StrictMode>  
  <BrowserRouter>
  <App />
  </BrowserRouter>
  </StrictMode>
  );