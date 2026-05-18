import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const css = `
.game-bg { background: radial-gradient(circle at top right, #2d3e35 0%, #121821 45%, #0f141b 100%); color: #fff; min-height: 100vh; font-family: sans-serif; padding: 40px 20px; box-sizing: border-box; }
.container { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 720px 300px; gap: 32px; box-sizing: border-box;}
.left-column { padding-right: 35px; border-right: 1px solid #2a2a2a; overflow: hidden; }
.main-img { width: 100%; height: 360px; object-fit: cover; border-radius: 6px; margin-bottom: 12px; background: #1e1e1e; display: block; }
.thumbs { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin-bottom: 30px; width: 100%; }
.thumb-item { width: 100%; height: 90px; object-fit: cover; border-radius: 3px; cursor: pointer; border: 1px solid #333; transition: 0.2s; box-sizing: border-box; }
.thumb-item:hover { border-color: #66c0f4; transform: scale(1.02); }
.side-card { position: sticky; top: 100px; height: fit-content; box-sizing: border-box;}
.side-desc { color: #aaa; font-size: 13px; line-height: 1.5; margin-bottom: 18px; text-align: left; }
.info-row { display: flex; justify-content: space-between; font-size: 12px; padding: 8px 0; border-bottom: 1px solid #222; }
.info-label { color: #666; }
.add-btn { width: 100%; background: #8bc53f; color: #000; border: none; padding: 11px; border-radius: 2px; font-weight: bold; margin-top: 20px; cursor: pointer; }
.add-btn:disabled { background: #555; cursor: not-allowed; }
.wish-btn { width: 100%; background: #3a3f4a; color: #fff; border: none; padding: 11px; border-radius: 2px; margin-top: 10px; cursor: pointer; }
.wish-btn:disabled { color: #666; border-color: #222; cursor: not-allowed; }
.owned-badge { background: #3c3d3e; color: #66c0f4; padding: 12px; border-radius: 4px; text-align: center; font-weight: bold; margin-top: 20px; border: 1px solid #66c0f4; }
.achievements-sec { width: 100%; margin-top: 50px; }
.ach-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-top: 20px; }
.ach-card { background: transparent; border-radius: 6px; transition: 0.2s; cursor: pointer; padding: 5px; box-sizing: border-box; }
.ach-card:hover { transform: translateY(-2px); }
.ach-card img { border: 1px solid #2a2a2a; width: 100%; display: block; }
.ach-card div { line-height: 1.2; }
.status-msg { margin-top: 10px; font-size: 12px; text-align: center; }
.reviews-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px; }
.review-card { background: #2a2f3a; border-radius: 4px; overflow: hidden; border: 1px solid #3a3f4a; display: flex; flex-direction: column; }
.review-top { display: flex; align-items: center; gap: 12px; padding: 12px; border-bottom: 1px solid #3f454f; background: rgba(255,255,255,0.02); }
.review-icon { width: 42px; height: 42px; border-radius: 4px; flex-shrink: 0; }
.review-meta { flex: 1; }
.review-user-row { display: flex; justify-content: space-between; font-size: 11px; color: #9fa6ad; margin-bottom: 4px; }
.review-recommend { font-size: 14px; font-weight: 600; text-align: left; }
.review-bottom { padding: 14px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.review-text { font-size: 14px; color: #d0d0d0; line-height: 1.5; margin-bottom: 16px; text-align: left; }
.review-helpful { font-size: 12px; color: #8f98a0; display: flex; align-items: center; gap: 8px; }
.review-vote { width: 18px; height: 18px; border: 1px solid #5c6268; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 11px; }
.review-vote:hover { border-color: #66c0f4; color: #66c0f4; }
.action-buttons { display: flex; gap: 10px; margin-top: 20px; width: 100%; }
.action-buttons button { flex: 1; margin-top: 0; }
.bottom-content { max-width: 1100px; margin: 0 auto; padding: 0; box-sizing: border-box; }
h2 { text-align: left; font-size: 24px; margin: 30px 0 15px 0; font-weight: 600; letter-spacing: 1px; }
h3 { text-align: left; font-size: 18px; margin: 0 0 10px 0; }
.no-reviews { color: #8f98a0; font-size: 14px; text-align: left; padding: 20px 0; }

/* =========================================================================
   МОБИЛЬНЫЙ АДАПТИВ (Для iPhone 16 Pro Max / 440px)
   ========================================================================= */
@media (max-width: 768px) {
  .game-bg { padding: 16px 12px; }
  
  /* Разворачиваем сетку в одну полноценную вертикальную колонку */
  .container { 
    grid-template-columns: 1fr; 
    gap: 24px; 
  }
  
  .left-column { 
    padding-right: 0; 
    border-right: none; 
  }
  
  /* Сжимаем высоту главного экрана, чтобы он не съедал полезную площадь */
  .main-img { 
    height: 210px; 
    margin-bottom: 8px;
  }
  
  /* На мобилках выстраиваем скриншоты в горизонтальный прокручиваемый ряд (как в App Store/Epic Games) */
  .thumbs { 
    display: flex;
    gap: 8px;
    overflow-x: auto;
    margin-bottom: 20px;
    padding-bottom: 4px;
    /* Скрываем нативный скроллбар для красоты */
    -webkit-overflow-scrolling: touch;
  }
  .thumbs::-webkit-scrollbar { display: none; }
  
  .thumb-item {
    width: 120px;
    height: 70px;
    flex-shrink: 0;
  }
  
  /* Боковая карточка идет вниз под медиа-файлы и теряет фиксированную позицию */
  .side-card { 
    position: static; 
    background: rgba(255, 255, 255, 0.03);
    padding: 16px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  /* Системные требования: складываем блоки друг под друга */
  .left-column > div:nth-of-type(2) > div {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
  }
  
  /* Достижения: перестраиваем сетку 3x2 вместо 6 в ряд */
  .ach-grid { 
    grid-template-columns: repeat(3, 1fr); 
    gap: 8px;
  }
  
  /* Отзывы: превращаем в красивую вертикальную стопку карточек */
  .reviews-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  h2 { font-size: 18px; margin: 24px 0 12px 0; }
  h3 { font-size: 15px; }
}
`;
const API_BASE_URL = "https://localhost:7190/api";

export default function GameDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const auth = useContext(AuthContext); 
    const userId = auth?.userId;
    const isAuthenticated = auth?.isAuthenticated;

    const [game, setGame] = useState<any>(null);
    const [achievements, setAchievements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isAdding, setIsAdding] = useState(false);
    const [isWishing, setIsWishing] = useState(false);
    const [isInLibrary, setIsInLibrary] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ text: string, isError: boolean } | null>(null);
    const [showAllAchievements, setShowAllAchievements] = useState(false);

    // Состояние для отображения выбранного скриншота в основном блоке
    const [activeImage, setActiveImage] = useState<string>("");

    useEffect(() => {
        const fetchGameAndStatus = async () => {
            try {
                setLoading(true);
                
                const gameRes = await fetch(`${API_BASE_URL}/Games/${id}`);
                if (!gameRes.ok) throw new Error("Game not found");
                const gameData = await gameRes.json();
                
                setGame(gameData);
                setAchievements(gameData.achievements || []);
                
                // Настройка главного изображения при первой загрузке
                if (gameData.screenshots && gameData.screenshots.length > 0) {
                    setActiveImage(gameData.screenshots[0].url);
                } else {
                    setActiveImage(gameData.headerImageUrl || gameData.coverImageUrl || "https://via.placeholder.com/600x300");
                }

                if (isAuthenticated && userId) {
                    const libRes = await fetch(`${API_BASE_URL}/Profile/${userId}/games`);
                    if (libRes.ok) {
                        const userGames = await libRes.json();
                        const owned = userGames.some((g: any) => g.id === parseInt(id || "0"));
                        setIsInLibrary(owned);
                    }
                } else {
                    setIsInLibrary(false);
                }

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGameAndStatus();
    }, [id, isAuthenticated, userId]);

    const handleAddToCart = async () => {
        if (!isAuthenticated || !userId) {
            setStatusMsg({ text: "Please log in to add items to cart", isError: true });
            return;
        }

        setIsAdding(true);
        setStatusMsg(null);

        try {
            const response = await fetch(`${API_BASE_URL}/Cart/${userId}/${id}`, {
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
        if (!isAuthenticated || !userId) {
            setStatusMsg({ text: "Please log in to add items to wishlist", isError: true });
            return;
        }

        setIsWishing(true);
        setStatusMsg(null);

        try {
            const response = await fetch(`${API_BASE_URL}/Wishlist/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, gameId: parseInt(id || "0") })
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

    // Вытаскиваем системные требования из пришедшего массива
    const minReqs = game.requirements?.find((r: any) => r.isRecommended === false);
    const recReqs = game.requirements?.find((r: any) => r.isRecommended === true);

    return (
        <div className="game-bg">
            <style>{css}</style>

            <div className="container">
                {/* LEFT COLUMN */}
                <div className="left-column">
                    {/* ГЛАВНОЕ ИЗОБРАЖЕНИЕ ГАЛЕРЕИ */}
                    <img src={activeImage} className="main-img" alt={game.title} />

                    {/* МИНИАТЮРЫ СКРИНШОТОВ ИЗ БАЗЫ ДАННЫХ */}
                    <div className="thumbs">
                        {game.screenshots && game.screenshots.length > 0 ? (
                            game.screenshots.map((screen: any) => (
                                <img 
                                    key={screen.id} 
                                    src={screen.url} 
                                    className="thumb-item" 
                                    alt="Screenshot" 
                                    onClick={() => setActiveImage(screen.url)} // Смена главного изображения по клику
                                />
                            ))
                        ) : (
                            <div style={{ color: "#555", fontSize: 12 }}>No screenshots available</div>
                        )}
                    </div>

                    {/* ABOUT */}
                    <div style={{ marginBottom: "30px" }}>
                        <h2 style={{ marginBottom: 15 }}>About this game</h2>
                        <p className="side-desc">{game.description}</p>
                        <p className="side-desc">
                            Experience intense gameplay, tactical battles, and immersive multiplayer action.
                            Master your skills, unlock achievements, and compete against players worldwide.
                        </p>
                    </div>

                    {/* СИСТЕМНЫЕ ТРЕБОВАНИЯ */}
                    <div style={{ marginBottom: "40px" }}>
                        <h2 style={{ marginBottom: 20 }}>System Requirements</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
                            {/* MINIMUM */}
                            <div>
                                <h3 style={{ marginBottom: 15, color: "#dcdcdc" }}>Minimum</h3>
                                {minReqs ? (
                                    <div className="side-desc">
                                        <p><b>OS:</b> {minReqs.os}</p>
                                        <p><b>Processor:</b> {minReqs.processor}</p>
                                        <p><b>Memory:</b> {minReqs.memory}</p>
                                        <p><b>Graphics:</b> {minReqs.graphics}</p>
                                        <p><b>Storage:</b> {minReqs.storage}</p>
                                    </div>
                                ) : (
                                    <p className="side-desc" style={{ fontStyle: "italic" }}>Minimum requirements not listed.</p>
                                )}
                            </div>

                            {/* RECOMMENDED */}
                            <div>
                                <h3 style={{ marginBottom: 15, color: "#dcdcdc" }}>Recommended</h3>
                                {recReqs ? (
                                    <div className="side-desc">
                                        <p><b>OS:</b> {recReqs.os}</p>
                                        <p><b>Processor:</b> {recReqs.processor}</p>
                                        <p><b>Memory:</b> {recReqs.memory}</p>
                                        <p><b>Graphics:</b> {recReqs.graphics}</p>
                                        <p><b>Storage:</b> {recReqs.storage}</p>
                                    </div>
                                ) : (
                                    <p className="side-desc" style={{ fontStyle: "italic" }}>Recommended requirements not listed.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="side-card">
                    <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15 }}>{game.title}</div>
                    <p className="side-desc">{game.description}</p>

                    <div className="info-row">
                        <span className="info-label">Price</span>
                        <span>{game.price > 0 ? `${game.price} USD` : "Free to Play"}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Release Date</span>
                        <span>{game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : "TBA"}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Developer</span>
                        <span style={{ color: "#dcdcdc" }}>pixyda, inc.</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Publisher</span>
                        <span style={{ color: "#dcdcdc" }}>pixyda, inc.</span>
                    </div>

                    {/* КНОПКИ ДЕЙСТВИЯ */}
                    {isInLibrary ? (
                        <div className="owned-badge">✓ In Library</div>
                    ) : (
                        <div className="action-buttons">
                            <button className="add-btn" onClick={handleAddToCart} disabled={isAdding}>
                                {isAdding ? "Processing..." : "Add to Cart"}
                            </button>
                            <button className="wish-btn" onClick={handleAddToWishlist} disabled={isWishing}>
                                {isWishing ? "Adding..." : "Wishlist"}
                            </button>
                        </div>
                    )}

                    {statusMsg && (
                        <div className="status-msg" style={{ color: statusMsg.isError ? "#ff4d4d" : "#23d18b" }}>
                            {statusMsg.text}
                        </div>
                    )}

                    {/* PEGI BLOCK */}
                    <div style={{ marginTop: 30, padding: 14, background: "rgba(255,255,255,0.03)", backdropFilter: "blur(4px)", borderRadius: 4, border: "1px solid #4a4a4a" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{ width: 58, height: 78, background: "#f7a600", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 700, borderRadius: 2 }}>
                                16
                            </div>
                            <div>
                                <div style={{ color: "#fff", fontSize: 15, fontWeight: 400, lineHeight: 1 }}>16+</div>
                                <div style={{ color: "#b8b8b8", fontSize: 13 }}>Mild Violence</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM CONTENT */}
            <div className="bottom-content">
                {/* ДОСТИЖЕНИЯ */}
                <div className="achievements-sec">
                    <h2 style={{ marginBottom: 20 }}>Achievements ({achievements.length})</h2>
                    <div className="ach-grid">
                        {(showAllAchievements ? achievements : achievements.slice(0, 6)).map((ach: any) => (
                            <div key={ach.id} className="ach-card">
                                <img
                                    src={ach.iconUrl || "https://picsum.photos/120"}
                                    alt={ach.title}
                                    style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 12, marginBottom: 10, display: "block" }}
                                />
                                <div style={{ fontSize: 12, color: "#fff", fontWeight: 600, marginBottom: 6, textAlign: "left" }}>
                                    {ach.title}
                                </div>
                                <div style={{ fontSize: 11, color: "#b2b3b5", textAlign: "left" }}>
                                    Completed by {ach.rarityPercentage || ach.rarityPct || 0}%
                                </div>
                            </div>
                        ))}
                    </div>

                    {achievements.length > 6 && (
                        <div
                            onClick={() => setShowAllAchievements(!showAllAchievements)}
                            style={{ marginTop: 18, marginBottom: 10, color: "#8bc53f", cursor: "pointer", fontSize: 14, fontWeight: 600, textAlign: "left" }}
                        >
                            {showAllAchievements ? "← Show Less" : "Show More →"}
                        </div>
                    )}
                </div>

                {/* ОТЗЫВЫ КЛИЕНТОВ ИЗ БАЗЫ ДАННЫХ */}
                <div style={{ marginTop: 50, marginBottom: 50 }}>
                    <h2 style={{ marginBottom: 20 }}>Customer Reviews</h2>
                    {game.reviews && game.reviews.length > 0 ? (
                        <div className="reviews-grid">
                            {game.reviews.map((review: any) => (
                                <div key={review.id} className="review-card">
                                    <div className="review-top">
                                        <div className="review-icon" style={{ background: review.isPositive ? "#6ea84a" : "#a84a4a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                                            {review.isPositive ? "👍" : "👎"}
                                        </div>
                                        <div className="review-meta">
                                            <div className="review-user-row">
                                                {/* Использование связи для вывода никнейма */}
                                                <span>@{review.user?.nickname || "anonymous"}</span>
                                                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="review-recommend" style={{ color: review.isPositive ? "#9bcf6b" : "#e06b6b" }}>
                                                {review.isPositive ? "This user recommends this game" : "This user doesn't recommend this game"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="review-bottom">
                                        <div className="review-text">
                                            {review.content}
                                        </div>
                                        <div className="review-helpful">
                                            Was review helpful?
                                            <div className="review-vote">▲</div>
                                            <div className="review-vote">▼</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-reviews">No reviews for this game yet. Be the first to leave one!</div>
                    )}
                </div>
            </div>
        </div>
    );
}