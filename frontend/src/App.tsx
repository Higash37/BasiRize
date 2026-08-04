// どのページを表示するかの交通整理役
import {Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import GradeSelectionPage from "./pages/GradeSelectionPage";

function App(){
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/grade-select" element={<GradeSelectionPage />} />
    </Routes>
  )
}

export default App