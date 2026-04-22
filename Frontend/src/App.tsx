import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Оставляем только этот импорт
import ProfilePage from "./pages/ProfilePage";
import NewsPage from "./pages/News";
import SupportPage from "./pages/SupportPage";
import SteamAuth from "./components/SteamAuth";

function App() {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Только один экземпляр здесь! */}
        <Navbar /> 
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<NewsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/auth" element={<SteamAuth />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;