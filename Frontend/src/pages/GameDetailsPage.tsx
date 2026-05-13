import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const getUserId = (): number => {
  const savedId = localStorage.getItem("userId");
  return savedId ? parseInt(savedId) : 5; 
};

const css = `
  .game-bg { background: #121212; color: #fff; min-height: 100vh; font-family: sans-serif; padding: 40px 20px; }
  .container { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 320px; gap: 30px; }
  
  .main-img { width: 100%; border-radius: 8px; margin-bottom: 20px; min-height: 300px; background: #1e1e1e; object-fit: cover; }
  .thumbs { display: flex; gap: 10px; margin-bottom: 30px; }
  .thumb-item { width: 120px; height: 70px; background: #2a2a2a; border-radius: 4px; overflow: hidden; position: relative; }

  .side-card { position: sticky; top: 20px; }
  .side-desc { color: #aaa; font-size: 14px; line-height: 1.5; margin-bottom: 20px; }
  .info-row { display: flex; justify-content: space-between; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #222; }
  .info-label { color: #666; }
  
  .add-btn { width: 100%; background: #23d18b; color: #000; border: none; padding: 12px; border-radius: 4px; font-weight: bold; margin-top: 20px; cursor: pointer; transition: opacity 0.2s; }
  .add-btn:disabled { background: #555; cursor: not-allowed; }
  
  .wish-btn { width: 100%; background: transparent; color: #fff; border: 1px solid #444; padding: 12px; border-radius: 4px; margin-top: 10px; cursor: pointer; }
  .wish-btn:disabled { color: #666; border-color: #222; cursor: not-allowed; }

  .owned-badge { background: #3c3d3e; color: #66c0f4; padding: 12px; border-radius: 4px; text-align: center; font-weight: bold; margin-top: 20px; border: 1px solid #66c0f4; }

  .achievements-sec { margin-top: 50px; grid-column: 1 / -1; }
  .ach-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 20px; }
  .ach-card { background: #1e1e1e; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #333; }
  .status-msg { margin-top: 10px; font-size: 12px; text-align: center; }
`;

const API_BASE_URL = "https://localhost:7190/api";

export default function GameDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Стани для кнопок та перевірки бібліотеки
  const [isAdding, setIsAdding] = useState(false);
  const [isWishing, setIsWishing] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string, isError: boolean } | null>(null);

  useEffect(() => {
    const fetchGameAndStatus = async () => {
      try {
        const currentUserId = getUserId();
        
        // 1. Отримуємо дані гри
        const gameRes = await fetch(`${API_BASE_URL}/Games/${id}`);
        if (!gameRes.ok) throw new Error("Game not found");
        const gameData = await gameRes.json();
        setGame(gameData);
        setAchievements(gameData.achievements || []);

        // 2. Перевіряємо чи гра в бібліотеці (через твій ProfileController або подібний)
        // Якщо у тебе немає окремого ендпоінту check-library, можна отримати всі ігри юзера
        const libRes = await fetch(`${API_BASE_URL}/Profile/${currentUserId}/games`);
        if (libRes.ok) {
          const userGames = await libRes.json();
          const owned = userGames.some((g: any) => g.id === parseInt(id || "0"));
          setIsInLibrary(owned);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameAndStatus();
  }, [id]);

  const handleAddToCart = async () => {
    const currentUserId = getUserId();
    setIsAdding(true);
    setStatusMsg(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/Cart/${currentUserId}/${id}`, {
        method: 'POST'
      });

      if (response.ok) {
        setStatusMsg({ text: "Added to cart!", isError: false });
        setTimeout(() => navigate('/cart'), 1200);
      } else {
        const errorText = await response.text();
        setStatusMsg({ text: errorText || "Failed to add", isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: "Connection error", isError: true });
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToWishlist = async () => {
    const currentUserId = getUserId();
    setIsWishing(true);
    setStatusMsg(null);

    try {
      const response = await fetch(`${API_BASE_URL}/Wishlist/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, gameId: parseInt(id || "0") })
      });

      if (response.ok) {
        setStatusMsg({ text: "Added to Wishlist!", isError: false });
        setTimeout(() => navigate("/wishlist"), 1200);
      } else {
        const errorText = await response.text();
        setStatusMsg({ text: errorText || "Already in wishlist", isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: "Connection error", isError: true });
    } finally {
      setIsWishing(false);
    }
  };

  if (loading) return <div className="game-bg">Loading...</div>;
  if (error) return <div className="game-bg">Error: {error}</div>;
  if (!game) return <div className="game-bg">Game not found</div>;

  const displayImage = game.headerImageUrl || game.coverImageUrl || "https://via.placeholder.com/600x300";

  return (
    <div className="game-bg">
      <style>{css}</style>
      <div className="container">
        
        <div>
          <img src={displayImage} className="main-img" alt={game.title} />
          <h3>About this game</h3>
          <p className="side-desc" style={{ marginTop: 15 }}>{game.description}</p>
        </div>

        <div className="side-card">
          <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{game.title}</div>
          
          <div className="info-row">
            <span className="info-label">Price</span>
            <span>{game.price > 0 ? `${game.price} USD` : "Free to Play"}</span>
          </div>

          {/* ЛОГІКА КНОПОК */}
          {isInLibrary ? (
            <div className="owned-badge">
              ✓ In Library
            </div>
          ) : (
            <>
              <button 
                className="add-btn" 
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? "Processing..." : "Add to Cart"}
              </button>

              <button 
                className="wish-btn" 
                onClick={handleAddToWishlist}
                disabled={isWishing}
              >
                {isWishing ? "Adding..." : "Add to Wishlist"}
              </button>
            </>
          )}

          {statusMsg && (
            <div className="status-msg" style={{ color: statusMsg.isError ? "#ff4d4d" : "#23d18b" }}>
              {statusMsg.text}
            </div>
          )}
          
          <div style={{ marginTop: 30, padding: 15, background: '#1e1e1e', borderRadius: 8 }}>
            <div className="info-row" style={{ border: 0 }}>
              <span className="info-label">Release Date</span>
              <span>{new Date(game.releaseDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="achievements-sec">
          <h3>Achievements ({achievements.length})</h3>
          <div className="ach-grid">
            {achievements.map((ach: any) => (
              <div key={ach.id} className="ach-card">
                <img src={ach.iconUrl} style={{ width: 48 }} alt={ach.title} />
                <div style={{ fontSize: 11, marginTop: 5 }}>{ach.title}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}