// どのページを表示するかの交通整理役
import {Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import GradeSelectionPage from "./pages/GradeSelectionPage";
import ContentSelectionPage from "./pages/ContentSelectionPage";

function App(){
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/grade-select" element={<GradeSelectionPage />} />
      <Route path="/content-select" element={<ContentSelectionPage />} />
    </Routes>
  )
}

export default App