import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; 

// Імпорт компонентів
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer"; 
import SteamAuth from "./components/SteamAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Імпорт сторінок
import StorePage from "./pages/StorePage";
import ProfilePage from "./pages/ProfilePage";
import NewsPage from "./pages/News";
import SupportPage from "./pages/SupportPage";
import CartPage from "./pages/CartPage";
import GameDetailsPage from "./pages/GameDetailsPage";
import UserAchievementsPage from "./pages/UserAchievementsPage";
import WishlistPage from "./pages/WishlistPage"; 

function App() {
  // Хуки можна використовувати ТІЛЬКИ всередині компонента
  const auth = useContext(AuthContext);
  
  // Отримуємо ID з контексту, або як запасний варіант з localStorage
  const currentUserId = auth?.userId || (localStorage.getItem("userId") ? parseInt(localStorage.getItem("userId")!) : null);

  return (
    <Router>
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh", 
        background: "#1b2838", 
        color: "#c6d4df" 
      }}>
        <Navbar /> 
        
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Публічні маршрути */}
            <Route path="/" element={<StorePage />} />
            <Route path="/game/:id" element={<GameDetailsPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/auth" element={<SteamAuth />} />
            
            {/* Захищені маршрути */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/profile/:userId/achievements" element={<UserAchievementsPage />} />

            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/wishlist" 
              element={
                <ProtectedRoute>
                  {/* Передаємо userId у WishlistPage */}
                  <WishlistPage userId={currentUserId} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;