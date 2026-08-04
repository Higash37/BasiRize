// Reactアプリの入り口
// Javaでいう public static void mainのような位置付け
// main.tsxの役割は作ったAppという部品をHTMLに差し込むこと

import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
<StrictMode>
  <App />
  </StrictMode>
  );