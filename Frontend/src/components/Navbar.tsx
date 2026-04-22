import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Импортируем контекст

const navStyles = `
  .navbar {
    background: #171a21;
    height: 52px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    gap: 20px;
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .nav-logo { 
    font-size: 18px; 
    font-weight: 700; 
    color: #fff; 
    display: flex; 
    align-items: center; 
    gap: 6px; 
    text-decoration: none;
  }
  .nav-logo span { font-size: 11px; letter-spacing: 2px; color: #8f98a0; font-weight: 400; }
  
  .nav-links { display: flex; gap: 4px; }
  
  .nav-link { 
    font-size: 12px; 
    color: #8f98a0; 
    padding: 6px 10px; 
    border-radius: 3px; 
    cursor: pointer; 
    text-decoration: none;
    transition: color 0.15s;
  }
  .nav-link:hover { color: #fff; }
  .nav-link.active { color: #fff; background: rgba(255,255,255,0.05); }

  .nav-search { 
    flex: 1; 
    max-width: 200px; 
    background: #2a3f55; 
    border: none; 
    border-radius: 3px; 
    padding: 6px 10px; 
    color: #c6d4df; 
    font-size: 12px; 
    outline: none; 
  }
  
  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 15px; }
  .nav-icons { display: flex; gap: 12px; color: #8f98a0; font-size: 15px; cursor: pointer; }
  
  .nav-signin, .nav-logout { 
    font-size: 12px; 
    color: #66c0f4; 
    text-decoration: none; 
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: inherit;
  }
  .nav-signin:hover, .nav-logout:hover { text-decoration: underline; }
  .nav-logout { color: #e84040; } /* Сделаем выход красным для отличия */

  .nav-download { 
    background: linear-gradient(to bottom, #75b022, #588a1b); 
    color: #d2e885; 
    font-size: 12px; 
    font-weight: 700; 
    border: none; 
    border-radius: 3px; 
    padding: 7px 14px; 
    cursor: pointer; 
  }
`;

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useContext(AuthContext); // Подключаем данные об авторизации

  const handleLogout = () => {
    auth?.logout(); // Вызываем выход из контекста
    navigate("/");  // Уводим на главную
  };

  return (
    <>
      <style>{navStyles}</style>
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          ▼ <span>STORE</span>
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            News
          </Link>
          <Link 
            to="/support" 
            className={`nav-link ${location.pathname === "/support" ? "active" : ""}`}
          >
            Support
          </Link>
          
          {/* Показываем ссылку на Профиль только если вошли */}
          {auth?.isAuthenticated && (
            <Link 
              to="/profile" 
              className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
            >
              Profile
            </Link>
          )}
        </div>

        <input className="nav-search" placeholder="Search store" />

        <div className="nav-right">
          <div className="nav-icons">
            <span>⚙</span>
            <span>♡</span>
            {/* Иконка корзины видна всем, но логику доступа к ней мы добавим позже */}
            <span>🛒</span>
          </div>

          {/* Логика переключения кнопок */}
          {auth?.isAuthenticated ? (
            <button onClick={handleLogout} className="nav-logout">
              Logout
            </button>
          ) : (
            <Link to="/auth" className="nav-signin">
              Sign in
            </Link>
          )}

          <button className="nav-download">Download</button>
        </div>
      </nav>
    </>
  );
}