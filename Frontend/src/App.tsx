import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer"; // Импортируем новый стилизованный футер
import ProfilePage from "./pages/ProfilePage";
import NewsPage from "./pages/News";
import SupportPage from "./pages/SupportPage";
import SteamAuth from "./components/SteamAuth";
import StorePage from "./pages/StorePage";
import CartPage from "./pages/CartPage";
import GameDetailsPage from "./pages/GameDetailsPage";
import UserAchievementsPage from "./pages/UserAchievementsPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh", 
        background: "#1b2838", // Темно-синий оттенок Steam
        color: "#c6d4df" 
      }}>
        {/* Навигация зафиксирована сверху */}
        <Navbar /> 
        
        {/* Контент страницы */}
        <main style={{ flex: 1 }}>
          <Routes>
            {/* ГЛАВНАЯ СТРАНИЦА МАГАЗИНА */}
            <Route path="/" element={<StorePage />} />

            {/* СТРАНИЦА КОНКРЕТНОЙ ИГРЫ */}
            <Route path="/game/:id" element={<GameDetailsPage />} />
            
            {/* Публичные маршруты */}
            <Route path="/news" element={<NewsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/auth" element={<SteamAuth />} />
            <Route path="/profile/:userId/achievements" element={<UserAchievementsPage />} />
            
            {/* ЗАЩИЩЕННЫЕ МАРШРУТЫ */}
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

        {/* Стилизованный футер (теперь с иконками и лого Valve) */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;