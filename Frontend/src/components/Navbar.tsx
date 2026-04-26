import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";

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
    z-index: 1000;
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

  /* СТИЛИ ПОИСКА */
  .search-wrapper { position: relative; flex: 1; max-width: 200px; }
  .nav-search { 
    width: 100%;
    background: #2a3f55; 
    border: none; 
    border-radius: 3px; 
    padding: 6px 10px; 
    color: #c6d4df; 
    font-size: 12px; 
    outline: none; 
  }
  
  .search-results-popup {
    position: absolute;
    top: 38px;
    left: 0;
    width: 400px;
    background: #3d4450;
    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    border-radius: 3px;
    z-index: 2000;
    overflow: hidden;
  }

  .search-result-item {
    display: flex;
    align-items: center;
    padding: 8px;
    gap: 12px;
    cursor: pointer;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    transition: background 0.2s;
  }
  .search-result-item:hover { background: #4e5666; }
  .search-result-item img { width: 120px; height: 45px; object-fit: cover; }
  .search-result-info { display: flex; flex-direction: column; }
  .search-result-name { color: #fff; font-weight: bold; font-size: 14px; }
  .search-result-price { color: #23d18b; font-size: 12px; }

  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 15px; }
  .nav-icons { display: flex; gap: 12px; color: #8f98a0; font-size: 15px; align-items: center; }
  .nav-icon-link { color: inherit; text-decoration: none; transition: color 0.15s; cursor: pointer; display: flex; align-items: center; }
  .nav-icon-link:hover, .nav-icon-link.active { color: #fff; }
  
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
  .nav-logout { color: #e84040; }

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

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`https://localhost:7190/api/Games/search?query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setIsOpen(true);
        })
        .catch(err => console.error("Search error:", err));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <input 
        className="nav-search" 
        placeholder="Search store" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 0 && setIsOpen(true)}
      />
      
      {isOpen && results.length > 0 && (
        <div className="search-results-popup">
          {results.map((game) => (
            <div 
              key={game.id} 
              className="search-result-item"
              onClick={() => {
                navigate(`/game/${game.id}`);
                setIsOpen(false);
                setQuery("");
              }}
            >
              <img src={game.coverImageUrl} alt="" />
              <div className="search-result-info">
                <span className="search-result-name">{game.title}</span>
                <span className="search-result-price">
                  {game.price === 0 ? "Free to Play" : `$${game.price}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleLogout = () => {
    auth?.logout();
    navigate("/");
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
            Store
          </Link>
          <Link 
            to="/news" 
            className={`nav-link ${location.pathname === "/news" ? "active" : ""}`}
          >
            News
          </Link>
          <Link 
            to="/support" 
            className={`nav-link ${location.pathname === "/support" ? "active" : ""}`}
          >
            Support
          </Link>
        </div>

        <SearchBar />

        <div className="nav-right">
          <div className="nav-icons">
            {/* ИКОНКА ПРОФИЛЯ: показывается только если залогинен */}
            {auth?.isAuthenticated && (
              <Link 
                to="/profile" 
                className={`nav-icon-link ${location.pathname === "/profile" ? "active" : ""}`}
                title="Profile"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>
            )}
            
            <span className="nav-icon-link" title="Settings">⚙</span>
            <span className="nav-icon-link" title="Wishlist">♡</span>
            
            <Link 
              to="/cart" 
              className={`nav-icon-link ${location.pathname === "/cart" ? "active" : ""}`}
              title="Cart"
            >
              🛒
            </Link>
          </div>

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