import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import ProfilePage from "./pages/ProfilePage";
import NewsPage from "./pages/News";
import SupportPage from "./pages/SupportPage";
import SteamAuth from "./components/SteamAuth";
import { ProtectedRoute } from "./components/ProtectedRoute"; // Импортируем защитника

// Компонент Футера
function Footer() {
  return (
    <footer style={{ 
      background: "#171a21", 
      borderTop: "1px solid rgba(255,255,255,0.05)", 
      padding: "24px 20px",
      marginTop: "auto" 
    }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", color: "#5a6a7a" }}>
          © 2026 Valve Corporation. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Навигация всегда сверху */}
        <Navbar /> 
        
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<NewsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/auth" element={<SteamAuth />} />
            
            {/* Защищенный маршрут для профиля */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>

        {/* Футер всегда снизу */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;