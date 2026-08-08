// どのページを表示するかの交通整理役
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import  HomePage  from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
