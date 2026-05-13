import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  // Закрываем поиск, если кликнули вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Логика запроса к API с задержкой (Debounce)
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
        .catch(err => console.error("Search fetch error:", err));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={searchWrapperRef} style={{ position: "relative" }}>
      {/* Твой инпут из навбара */}
      <input
        type="text"
        className="nav-search" // используй свой существующий класс CSS
        placeholder="Search store"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 0 && setIsOpen(true)}
        style={{
           background: "#316282", // цвет как в Steam
           border: "none",
           borderRadius: "3px",
           padding: "5px 10px",
           color: "#fff",
           outline: "none",
           width: "210px"
        }}
      />

      {/* Выпадающее окно результатов */}
      {isOpen && results.length > 0 && (
        <div style={{
          position: "absolute",
          top: "35px",
          right: 0,
          width: "400px",
          background: "#3d4450", // цвет выпадающего списка Steam
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          borderRadius: "3px",
          zIndex: 9999,
          overflow: "hidden"
        }}>
          {results.map((game) => (
            <div
              key={game.id}
              onClick={() => {
                navigate(`/game/${game.id}`);
                setIsOpen(false);
                setQuery("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#4e5666")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <img 
                src={game.coverImageUrl} 
                style={{ width: "120px", height: "45px", objectFit: "cover", marginRight: "12px" }} 
                alt="" 
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}>{game.title}</span>
                <span style={{ color: "#23d18b", fontSize: "12px" }}>
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