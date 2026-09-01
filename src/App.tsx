// どのページを表示するかの交通整理役
import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Page
// ページ単位で分割し、今開いていないページの分まで最初にダウンロードしなくて済むようにする
// （Suspenseの受け皿はLayout.tsxの<Outlet />側に用意している）
const HomePage = lazy(() => import("./pages/HomePage"));
const GradeSelectionPage = lazy(() => import("./pages/GradeSelectionPage"));
const ContentSelectionPage = lazy(() => import("./pages/ContentSelectionPage"));
const OptionsPage = lazy(() => import("./pages/OptionsPage"));
const PreviewPage = lazy(() => import("./pages/PreviewPage"));
const EnHomePage = lazy(() => import("./pages/EnHomePage"));
const EnWorksheetPage = lazy(() => import("./pages/EnWorksheetPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <Routes>
      {/* レイアウトルート */}
      {/* 中のどれかが選ばれたら必ず<Layout />で囲む書き方 */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/grade-select" element={<GradeSelectionPage />} />
        <Route path="/math/:levelSlug" element={<ContentSelectionPage />} />
        {/* 既存のブックマークとの互換用。SEO上は/math/:levelSlugを正規URLにする */}
        <Route path="/content-select" element={<ContentSelectionPage />} />
        <Route path="/problems/:typeId" element={<OptionsPage />} />
        <Route path="/options" element={<OptionsPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/en" element={<EnHomePage />} />
        <Route path="/en/worksheets/:slug" element={<EnWorksheetPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
