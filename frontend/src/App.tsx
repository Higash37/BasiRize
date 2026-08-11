// どのページを表示するかの交通整理役
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Page
import  HomePage  from "./pages/HomePage";
import GradeSelectionPage from "./pages/GradeSelectionPage";
import ContentSelectionPage from "./pages/ContentSelectionPage";
import OptionsPage from "./pages/OptionsPage";
import PreviewPage from "./pages/PreviewPage";

function App() {
  return (
    <Routes>
      {/* レイアウトルート */}
      {/* 中のどれかが選ばれたら必ず<Layout />で囲む書き方 */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/grade-select" element={<GradeSelectionPage />} />
        <Route path="/content-select" element={<ContentSelectionPage />} />
        <Route path="/options" element={<OptionsPage />} />
        <Route path="/preview" element={<PreviewPage />} /> 
      </Route>
    </Routes>
  );
}

export default App;
