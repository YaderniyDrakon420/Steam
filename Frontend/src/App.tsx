import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import ProfilePage from "./pages/ProfilePage";
import NewsPage from "./pages/News";
import SupportPage from "./pages/SupportPage";
import SteamAuth from "./components/SteamAuth";
import StorePage from "./pages/StorePage";
import CartPage from "./pages/CartPage";
import GameDetailsPage from "./pages/GameDetailsPage"; // Импортируем страницу игры
import { ProtectedRoute } from "./components/ProtectedRoute";

// Компонент Футера
function Footer() {
  return (
    <footer style={{ 
      background: "#171a21", 
      borderTop: "1px solid rgba(255,255,255,0.05)", 
      padding: "24px 20px",
      marginTop: "auto" 
    }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
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
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#121212" }}>
        {/* Навигация всегда сверху */}
        <Navbar /> 
        
        <main style={{ flex: 1 }}>
          <Routes>
            {/* ГЛАВНАЯ СТРАНИЦА МАГАЗИНА */}
            <Route path="/" element={<StorePage />} />

            {/* СТРАНИЦА КОНКРЕТНОЙ ИГРЫ (публичная) */}
            <Route path="/game/:id" element={<GameDetailsPage />} />
            
            {/* Публичные маршруты */}
            <Route path="/news" element={<NewsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/auth" element={<SteamAuth />} />
            
            {/* ЗАЩИЩЕННЫЕ МАРШРУТЫ (только для авторизованных) */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <CartPage />
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