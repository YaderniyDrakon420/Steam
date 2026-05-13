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
  .play-icon { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); }

  .side-card { position: sticky; top: 20px; }
  .side-desc { color: #aaa; font-size: 14px; line-height: 1.5; margin-bottom: 20px; }
  .info-row { display: flex; justify-content: space-between; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #222; }
  .info-label { color: #666; }
  
  .add-btn { width: 100%; background: #23d18b; color: #000; border: none; padding: 12px; border-radius: 4px; font-weight: bold; margin-top: 20px; cursor: pointer; transition: opacity 0.2s; }
  .add-btn:disabled { background: #555; cursor: not-allowed; }
  .add-btn:hover:not(:disabled) { opacity: 0.8; }
  
  .wish-btn { width: 100%; background: transparent; color: #fff; border: 1px solid #444; padding: 12px; border-radius: 4px; margin-top: 10px; cursor: pointer; }

  .achievements-sec { margin-top: 50px; grid-column: 1 / -1; }
  .ach-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 20px; }
  .ach-card { background: #1e1e1e; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #333; }
  .ach-icon { width: 64px; height: 64px; margin-bottom: 10px; border-radius: 4px; }
  .ach-title { font-size: 12px; font-weight: bold; margin-bottom: 5px; }
  .ach-rarity { font-size: 10px; color: #23d18b; }
  
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
  const [isAdding, setIsAdding] = useState(false);
  const [cartStatus, setCartStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Games/${id}`);
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        const data = await response.json();
        setGame(data);
        setAchievements(data.achievements || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGameData();
  }, [id]);

  const handleAddToCart = async () => {
    const currentUserId = getUserId();
    setIsAdding(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/Cart/${currentUserId}/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setCartStatus("Game added to cart!");
        setTimeout(() => navigate('/cart'), 1500); 
      } else {
        const errorData = await response.text();
        setCartStatus(errorData || "Already in cart or error");
      }
    } catch (err) {
      setCartStatus("Connection error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToWishlist = () => {
    if (!game) return;

    const currentUserId = getUserId();
    // Створюємо унікальний ключ для кожного користувача
    const wishlistKey = `wishlist_${currentUserId}`; 
    
    const savedWishlist = JSON.parse(localStorage.getItem(wishlistKey) || "[]");
    
    const finalCover = game.headerImageUrl || game.headerImage || game.coverImageUrl || game.imageUrl || game.image;

    const gameToSave = {
      id: game.id,
      title: game.title,
      price: game.price,
      coverUrl: finalCover, 
      reviews: game.reviews || "Positive",
      releaseDate: game.releaseDate,
      platforms: game.platforms || ["windows"],
      discountPct: game.discountPercentage || 0
    };
    
    const updatedWishlist = [...savedWishlist.filter((g: any) => g.id !== game.id), gameToSave];
    localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
    
    navigate("/wishlist");
  };

  if (loading) return <div className="game-bg">Loading...</div>;
  if (error) return <div className="game-bg">Error: {error}</div>;
  if (!game) return <div className="game-bg">Game not found</div>;

  const displayImage = game.headerImageUrl || game.headerImage || game.coverImageUrl || game.imageUrl || game.image;

  return (
    <div className="game-bg">
      <style>{css}</style>
      <div className="container">
        
        <div>
          <img 
            src={displayImage} 
            className="main-img" 
            alt={game.title} 
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x300?text=No+Image'; }}
          />
          <div className="thumbs">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="thumb-item">
                <div className="play-icon">▶</div>
              </div>
            ))}
          </div>
          
          <h3>About this game</h3>
          <p className="side-desc" style={{ marginTop: 15 }}>{game.description}</p>
        </div>

        <div className="side-card">
          <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{game.title}</div>
          <p className="side-desc">{game.description?.substring(0, 150)}...</p>
          
          <div className="info-row">
            <span className="info-label">Release Date</span>
            <span>{new Date(game.releaseDate).toLocaleDateString()}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Developer</span>
            <span style={{ color: '#23d18b' }}>pixyda, inc.</span>
          </div>

          <button 
            className="add-btn" 
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add to cart"}
          </button>
          
          {cartStatus && (
            <div className="status-msg" style={{ color: cartStatus.includes("added") ? "#23d18b" : "#ff4d4d" }}>
              {cartStatus}
            </div>
          )}

          <button onClick={handleAddToWishlist} className="wish-btn">
            Add to Wishlist
          </button>
          
          <div style={{ marginTop: 30, padding: 15, background: '#1e1e1e', borderRadius: 8 }}>
            <span style={{ fontSize: 20 }}>16+</span>
            <span style={{ marginLeft: 15, color: '#aaa' }}>Mild Violence</span>
          </div>
        </div>

        <div className="achievements-sec">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>Achievements ({achievements.length})</h3>
            <span style={{ color: '#23d18b', cursor: 'pointer' }}>Show more →</span>
          </div>
          
          <div className="ach-grid">
            {achievements.length > 0 ? (
              achievements.map((ach) => (
                <div key={ach.id} className="ach-card">
                  <img src={ach.iconUrl} className="ach-icon" alt={ach.title} />
                  <div className="ach-title">{ach.title}</div>
                  <div className="ach-rarity">{ach.rarityPercentage}% players have this</div>
                </div>
              ))
            ) : (
              <div style={{ color: '#666', fontSize: 14 }}>No achievements found for this game.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}