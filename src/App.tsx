// どのページを表示するかの交通整理役
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Page
import HomePage from "./pages/HomePage";
import GradeSelectionPage from "./pages/GradeSelectionPage";
import ContentSelectionPage from "./pages/ContentSelectionPage";
import OptionsPage from "./pages/OptionsPage";
import PreviewPage from "./pages/PreviewPage";
import EnHomePage from "./pages/EnHomePage";
import EnWorksheetPage from "./pages/EnWorksheetPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      {/* レイアウトルート */}
      {/* 中のどれかが選ばれたら必ず<Layout />で囲む書き方 */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/grade-select" element={<GradeSelectionPage />} />
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
