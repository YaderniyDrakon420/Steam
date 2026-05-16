import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const getUserId = (): number => {
    const savedId = localStorage.getItem("userId");
    return savedId ? parseInt(savedId) : 5;
};

const css = `
.game-bg { background: radial-gradient(circle at top right, #2d3e35 0%, #121821 45%, #0f141b 100%); color: #fff; min-height: 100vh; font-family: sans-serif; padding: 40px 20px; }
.container { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 720px 300px; gap: 32px;}
.left-column { padding-right: 35px; border-right: 1px solid #2a2a2a; }
.main-img { width: 100%; height: 360px; object-fit: cover; border-radius: 6px; margin-bottom: 12px; background: #1e1e1e; }
.thumbs { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin-bottom: 30px; width: 100%; }
.thumb-item { width: 100%; height: 90px; object-fit: cover; border-radius: 3px; cursor: pointer; border: 1px solid #333; transition: 0.2s; }
.thumb-item:hover { border-color: #66c0f4; transform: scale(1.02); }
.side-card { position: sticky; top: 100px; height: fit-content;}
.side-desc { color: #aaa; font-size: 13px; line-height: 1.5; margin-bottom: 18px; }
.info-row { display: flex; justify-content: space-between; font-size: 12px; padding: 8px 0; border-bottom: 1px solid #222; }
.info-label { color: #666; }
.add-btn { width: 100%; background: #8bc53f; color: #000; border: none; padding: 11px; border-radius: 2px; font-weight: bold; margin-top: 20px; cursor: pointer; }
.wish-btn { width: 100%; background: #3a3f4a; color: #fff; border: none; padding: 11px; border-radius: 2px; margin-top: 10px; cursor: pointer; }
.owned-badge { background: #3c3d3e; color: #66c0f4; padding: 12px; border-radius: 4px; text-align: center; font-weight: bold; margin-top: 20px; border: 1px solid #66c0f4; }
.achievements-sec { width: 100%; margin-top: 50px; }
.ach-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-top: 20px; }
.ach-card { background: transparent; border-radius: 6px; transition: 0.2s; cursor: pointer;padding: 5px; }
.ach-card:hover { transform: translateY(-2px); }
.ach-card img { border: 1px solid #2a2a2a; }
.ach-card div {line-height: 1.2;}
.status-msg { margin-top: 10px; font-size: 12px; text-align: center; }
.reviews-grid {display: grid;grid-template-columns: 1fr 1fr;gap: 16px;}
.review-card {background: #2a2f3a;border-radius: 4px;overflow: hidden;border: 1px solid #3a3f4a;}
.review-top {display: flex;align-items: center;gap: 12px;padding: 12px;margin-bottom: 4px;border-bottom: 1px solid #3f454f;background: rgba(255,255,255,0.02);}
.review-icon {width: 42px;height: 42px;border-radius: 4px;flex-shrink: 0;}
.review-meta {flex: 1;}
.review-user-row {display: flex;justify-content: space-between;font-size: 11px;color: #9fa6ad;margin-bottom: 4px;}
.review-recommend {font-size: 14px;font-weight: 600;}
.review-bottom {padding: 14px;}
.review-text {font-size: 14px;color: #d0d0d0;line-height: 1.5;margin-bottom: 16px;}
.review-helpful {font-size: 12px;color: #8f98a0;display: flex;align-items: center;gap: 8px;}
.review-vote {width: 18px;height: 18px;border: 1px solid #5c6268;display: flex;align-items: center;justify-content: center;cursor: pointer;font-size: 11px;}
.review-vote:hover {border-color: #66c0f4; color: #66c0f4;}
.action-buttons { display: flex; gap: 10px; margin-top: 20px; }
.action-buttons button { flex: 1; margin-top: 0; }
.bottom-content { max-width: 1100px; margin: 0 auto; padding-left: 0; }
.bottom-content h2 { text-align: left; }
.review-text, .review-status, .review-header, .side-desc { text-align: left; }
h2 { text-align: left; font-size: 24px; margin-left: 0;font-weight: 600;letter-spacing: 1px; }
h3 { text-align: left; font-size: 18px; margin-left: 0; }
`;

const API_BASE_URL = "https://localhost:7190/api";

export default function GameDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState<any>(null);
    const [achievements, setAchievements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const screenshots = [
        game?.headerImageUrl,
        game?.coverImageUrl,
        game?.headerImageUrl,
        game?.coverImageUrl
    ];
    // Стани для кнопок та перевірки бібліотеки
    const [isAdding, setIsAdding] = useState(false);
    const [isWishing, setIsWishing] = useState(false);
    const [isInLibrary, setIsInLibrary] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ text: string, isError: boolean } | null>(null);
    const [showAllAchievements, setShowAllAchievements] = useState(false);
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

    const displayImage = game?.headerImageUrl || game?.coverImageUrl || "https://via.placeholder.com/600x300";

    return (
        <div className="game-bg">
            <style>{css}</style>

            <div className="container">

                {/* LEFT COLUMN */}
                <div className="left-column">

                    {/* MAIN IMAGE */}
                    <img
                        src={displayImage}
                        className="main-img"
                        alt={game.title}
                    />

                    {/* SCREENSHOTS */}
                    <div className="thumbs">
                        {[displayImage, displayImage, displayImage, displayImage].map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                className="thumb-item"
                                alt=""
                            />
                        ))}
                    </div>

                    {/* ABOUT */}
                    <div style={{
                        marginBottom: "30px"
                    }}>
                        <h2 style={{ marginBottom: 15 }}>About this game</h2>

                        <p className="side-desc">
                            {game.description}
                        </p>

                        <p className="side-desc">
                            Experience intense gameplay, tactical battles, and immersive multiplayer action.
                            Master your skills, unlock achievements, and compete against players worldwide.
                        </p>

                        <img
                            src={displayImage}
                            style={{
                                width: "100%",
                                borderRadius: 6,
                                marginTop: 20
                            }}
                        />
                    </div>

                    {/* SYSTEM REQUIREMENTS */}
                    <div style={{
                        marginBottom: "40px"
                    }}>
                        <h2 style={{ marginBottom: 20 }}>System Requirements</h2>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 30
                        }}>

                            {/* MINIMUM */}
                            <div>
                                <h3 style={{ marginBottom: 15, color: "#dcdcdc" }}>
                                    Minimum
                                </h3>

                                <div className="side-desc">
                                    <p><b>OS:</b> Windows 10</p>
                                    <p><b>Processor:</b> Intel Core i5-6600</p>
                                    <p><b>Memory:</b> 8 GB RAM</p>
                                    <p><b>Graphics:</b> GTX 1060</p>
                                    <p><b>Storage:</b> 50 GB available space</p>
                                </div>
                            </div>

                            {/* RECOMMENDED */}
                            <div>
                                <h3 style={{ marginBottom: 15, color: "#dcdcdc" }}>
                                    Recommended
                                </h3>

                                <div className="side-desc">
                                    <p><b>OS:</b> Windows 11</p>
                                    <p><b>Processor:</b> Intel Core i7-9700K</p>
                                    <p><b>Memory:</b> 16 GB RAM</p>
                                    <p><b>Graphics:</b> RTX 3070</p>
                                    <p><b>Storage:</b> 50 GB SSD</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="side-card">

                    <div style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        marginBottom: 15
                    }}>
                        {game.title}
                    </div>

                    <p className="side-desc">
                        {game.description}
                    </p>

                    <div className="info-row">
                        <span className="info-label">Price</span>

                        <span>
                            {game.price > 0
                                ? `${game.price} USD`
                                : "Free to Play"}
                        </span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Release Date</span>

                        <span>
                            {new Date(game.releaseDate).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Developer</span>

                        <span style={{ color: "#dcdcdc" }}>
                            pixyda, inc.
                        </span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Publisher</span>
                        <span style={{ color: "#dcdcdc" }}>
                            pixyda, inc.
                        </span>
                    </div>

                    {/* BUTTONS */}
                    {isInLibrary ? (
                        <div className="owned-badge">
                            ✓ In Library
                        </div>
                    ) : (
                        <div className="action-buttons">
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
                                {isWishing ? "Adding..." : "Wishlist"}
                            </button>
                        </div>
                    )}

                    {statusMsg && (
                        <div
                            className="status-msg"
                            style={{
                                color: statusMsg.isError
                                    ? "#ff4d4d"
                                    : "#23d18b"
                            }}
                        >
                            {statusMsg.text}
                        </div>
                    )}

                    {/* AGE BLOCK */}
                    {/* AGE BLOCK */}
                    <div
                        style={{
                            marginTop: 30,
                            padding: 14,
                            background: "rgba(255,255,255,0.03)",
                            backdropFilter: "blur(4px)",
                            borderRadius: 4,
                            border: "1px solid #4a4a4a"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14
                            }}
                        >

                            {/* PEGI IMAGE */}
                            <div
                                style={{
                                    width: 58,
                                    height: 78,
                                    background: "#f7a600",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                    fontWeight: 700,
                                    borderRadius: 2
                                }}
                            >
                                16
                            </div>

                            {/* TEXT */}
                            <div>

                                <div
                                    style={{
                                        color: "#fff",
                                        fontSize: 15,
                                        fontWeight: 400,
                                        lineHeight: 1
                                    }}
                                >
                                    16+
                                </div>

                                <div
                                    style={{
                                        color: "#b8b8b8",
                                        fontSize: 13
                                    }}
                                >
                                    Mild Violence
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </div>
            <div className="bottom-content">
                {/* ACHIEVEMENTS */}
                <div className="achievements-sec">

                    <h2 style={{ marginBottom: 20 }}>
                        Achievements ({achievements.length})
                    </h2>

                    <div className="ach-grid">
                        {(showAllAchievements
                            ? achievements
                            : achievements.slice(0, 6)
                        ).map((ach: any) => (

                            <div key={ach.id} className="ach-card">

                                <img
                                    src="https://picsum.photos/120"
                                    alt={ach.title}
                                    style={{
                                        width: "100%",
                                        aspectRatio: "1 / 1",
                                        objectFit: "cover",
                                        borderRadius: 12,
                                        marginBottom: 10,
                                        display: "block"
                                    }}
                                />

                                <div style={{
                                    fontSize: 12,
                                    color: "#fff",
                                    fontWeight: 600,
                                    marginBottom: 6,
                                    textAlign: "left"
                                }}>
                                    {ach.title}
                                </div>

                                <div style={{
                                    fontSize: 11,
                                    color: "#b2b3b5",
                                    textAlign: "left"
                                }}>
                                    Completed by {ach.rarityPercentage || ach.rarityPct}%
                                </div>

                            </div>

                        ))}
                    </div>

                    {achievements.length > 6 && (
                        <div
                            onClick={() => setShowAllAchievements(!showAllAchievements)}
                            style={{
                                marginTop: 18,
                                marginBottom: 10,
                                color: "#8bc53f",
                                cursor: "pointer",
                                fontSize: 14,
                                fontWeight: 600,
                                textAlign: "left"
                            }}
                        >
                            {showAllAchievements
                                ? "← Show Less"
                                : "Show More →"}
                        </div>
                    )}

                </div>
                {/* REVIEWS */}
                <div
                    style={{
                        marginTop: 50,
                        marginBottom: 50
                    }}
                >
                    <h2 style={{ marginBottom: 20 }}>
                        Customer Reviews
                    </h2>

                    <div className="reviews-grid">

                        {[1, 2, 3, 4, 5, 6].map((r) => {

                            const positive = r % 2 === 0;

                            return (
                                <div key={r} className="review-card">

                                    {/* TOP */}
                                    <div className="review-top">

                                        <div
                                            className="review-icon"
                                            style={{
                                                background: positive
                                                    ? "#6ea84a"
                                                    : "#a84a4a",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 24
                                            }}
                                        >
                                            {positive ? "👍" : "👎"}
                                        </div>

                                        <div className="review-meta">

                                            <div className="review-user-row">
                                                <span>@user_generic</span>

                                                <span>
                                                    Posted on: November 23
                                                </span>
                                            </div>

                                            <div
                                                className="review-recommend"
                                                style={{
                                                    color: positive
                                                        ? "#9bcf6b"
                                                        : "#e06b6b"
                                                }}
                                            >
                                                {positive
                                                    ? "This user recommends this game"
                                                    : "This user doesn't recommend this game"}
                                            </div>

                                        </div>
                                    </div>

                                    {/* BOTTOM */}
                                    <div className="review-bottom">

                                        <div className="review-text">
                                            Amazing gameplay and atmosphere.
                                            One of the best multiplayer experiences.
                                            Great visuals and satisfying gameplay loop.
                                        </div>

                                        <div className="review-helpful">
                                            Was review helpful?

                                            <div className="review-vote">
                                                ▲
                                            </div>

                                            <div className="review-vote">
                                                ▼
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>
            </div>
        </div>
    );
}