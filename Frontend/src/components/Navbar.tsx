import { Link, useLocation } from "react-router-dom";

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
  
  .nav-signin { 
    font-size: 12px; 
    color: #66c0f4; 
    text-decoration: none; 
  }
  .nav-signin:hover { text-decoration: underline; }

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
          <Link 
            to="/profile" 
            className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
          >
            Profile
          </Link>
        </div>

        <input className="nav-search" placeholder="Search store" />

        <div className="nav-right">
          <div className="nav-icons">
            <span>⚙</span>
            <span>♡</span>
            <span>🛒</span>
          </div>
          <Link to="/auth" className="nav-signin">Sign in</Link>
          <button className="nav-download">Download</button>
        </div>
      </nav>
    </>
  );
}