import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/DashboardPage";
import EditorPage from "./pages/EditorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<EditorPage />} />
        <Route path="/:id" element={<EditorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
