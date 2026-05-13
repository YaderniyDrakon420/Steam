import React, { useState, useEffect } from "react";

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #1b2838; color: #c6d4df; font-family: Arial, sans-serif; min-height: 100vh; }
  
  .nav {
    background: #171a21; height: 52px; display: flex; align-items: center;
    padding: 0 24px; gap: 0; position: sticky; top: 0; z-index: 100;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .nav-logo { font-size: 18px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 7px; margin-right: 20px; }
  .nav-logo-sub { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #666; }
  .nav-tabs { display: flex; }
  .nav-tab { font-size: 13px; color: #8f98a0; padding: 0 14px; height: 52px; display: flex; align-items: center; transition: color 0.15s; text-decoration: none; }
  .nav-tab:hover { color: #fff; }
  .nav-search-wrap { position: relative; margin-left: 10px; }
  .nav-search-wrap::before { content: '⌕'; position: absolute; left: 8px; top: 50%; transform: translateY(-50%); color: #555; font-size: 15px; pointer-events: none; }
  .nav-search { background: #2a3f55; border: 1px solid rgba(255,255,255,0.07); border-radius: 3px; padding: 5px 10px 5px 28px; color: #c6d4df; font-size: 12px; outline: none; width: 170px; }
  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 16px; }
  .nav-icons { display: flex; gap: 16px; color: #8f98a0; font-size: 16px; }
  .nav-icon { cursor: pointer; transition: color 0.15s; }
  .nav-icon:hover { color: #fff; }
  .nav-signin { font-size: 13px; color: #c6d4df; background: none; border: none; cursor: pointer; }
  .nav-signin:hover { color: #fff; }
  .nav-btn { background: linear-gradient(to bottom, #75b022, #588a1b); color: #d2e885; font-size: 12px; font-weight: 700; border: none; border-radius: 3px; padding: 7px 14px; cursor: pointer; }
  .nav-btn:hover { filter: brightness(1.1); }
  @media (max-width: 640px) { .nav-tabs { display: none; } .nav-search { width: 110px; } }
  
  .page { max-width: 860px; margin: 0 auto; padding: 36px 20px 80px; }
  
  .page-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
  .page-title { font-size: 26px; font-weight: 700; color: #fff; }
  
  .notify-bar {
    display: flex; align-items: center; justify-content: space-between;
    background: #1e2d3d; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 6px; padding: 12px 16px;
    margin-bottom: 20px; gap: 12px;
  }
  .notify-left { display: flex; align-items: center; gap: 12px; }
  .notify-accent { width: 4px; height: 36px; background: #5c7e10; border-radius: 2px; flex-shrink: 0; }
  .notify-icon { font-size: 16px; color: #8f98a0; }
  .notify-text { font-size: 12px; color: #8f98a0; line-height: 1.5; }
  
  .toggle { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
  .toggle track {
    position: absolute; inset: 0; background: #2a3a4a;
    border-radius: 20px; cursor: pointer; transition: background 0.2s;
  }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .toggle-track {
    position: absolute; inset: 0; background: #2a3a4a;
    border-radius: 20px; cursor: pointer; transition: background 0.2s;
  }
  .toggle input:checked + .toggle-track { background: #5c7e10; }
  .toggle-thumb {
    position: absolute; top: 3px; left: 3px;
    width: 16px; height: 16px; background: #fff;
    border-radius: 50%; transition: transform 0.2s; pointer-events: none;
  }
  .toggle input:checked ~ .toggle-thumb { transform: translateX(18px); }
  
  .sort-row { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; font-size: 13px; color: #8f98a0; }
  .sort-select {
    background: #1e2d3d; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 4px; color: #c6d4df; font-size: 13px;
    padding: 5px 10px; outline: none; cursor: pointer;
  }
  
  .empty-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 14px; padding: 80px 20px;
    color: #4a5a6a; text-align: center;
  }
  .empty-icon { font-size: 52px; opacity: 0.4; }
  .empty-title { font-size: 18px; font-weight: 700; color: #5a6a7a; }
  .empty-sub { font-size: 13px; color: #4a5a6a; max-width: 320px; line-height: 1.5; }
  .empty-browse {
    background: linear-gradient(to bottom, #75b022, #588a1b);
    color: #d2e885; font-size: 13px; font-weight: 700;
    border: none; border-radius: 3px; padding: 10px 24px; cursor: pointer;
    margin-top: 6px;
  }
  .empty-browse:hover { filter: brightness(1.1); }
  
  .wish-card {
    background: #1e2d3d; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 6px; display: flex; gap: 0;
    margin-bottom: 10px; overflow: hidden;
    transition: border-color 0.15s;
  }
  .wish-card:hover { border-color: rgba(255,255,255,0.15); }
  
  .wish-cover {
    width: 200px; flex-shrink: 0;
    background: #16202d; background-size: cover; background-position: center;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; color: #3a4a5a; text-align: center;
    min-height: 90px;
  }
  .wish-body { flex: 1; padding: 12px 16px; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .wish-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .wish-badge {
    display: inline-block; background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 3px;
    font-size: 10px; color: #8f98a0; padding: 2px 7px; margin-bottom: 4px;
  }
  
  .wish-title { font-size: 16px; font-weight: 700; color: #fff; }
  
  .wish-price { font-size: 14px; font-weight: 700; color: #fff; white-space: nowrap; }
  .wish-price.free { color: #5c7e10; }
  .wish-price.sale { color: #beee11; }
  .wish-meta { display: flex; flex-direction: column; gap: 3px; }
  .wish-row { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #8f98a0; }
  .wish-row-label { min-width: 100px; }
  
  .review-positive { color: #66c0f4; }
  .review-very-positive { color: #5c7e10; }
  .review-mixed { color: #a57a3a; }
  .review-negative { color: #e84040; }
  .wish-platforms { display: flex; gap: 6px; margin-top: 4px; }
  .platform-icon { font-size: 14px; color: #8f98a0; }
  .wish-actions { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
  .wish-remove {
    background: none; border: none; color: #8f98a0;
    font-size: 12px; cursor: pointer; padding: 0;
    transition: color 0.15s;
  }
  .wish-remove:hover { color: #e84040; }
  .wish-add-cart {
    background: linear-gradient(to bottom, #75b022, #588a1b);
    color: #d2e885; font-size: 12px; font-weight: 700;
    border: none; border-radius: 3px; padding: 8px 18px; cursor: pointer;
    transition: filter 0.15s; white-space: nowrap;
  }
  .wish-add-cart:hover { filter: brightness(1.1); }
  .wish-add-cart:disabled { opacity: 0.4; cursor: default; }
  
  .wish-discount { display: flex; align-items: center; gap: 6px; }
  .wish-badge-sale { background: #4c6b22; color: #beee11; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 2px; }
  .wish-old-price { text-decoration: line-through; color: #8f98a0; font-size: 12px; }
  
  .footer { background: #171a21; border-top: 1px solid rgba(255,255,255,0.05); padding: 28px 20px; }
  .footer-inner { max-width: 860px; margin: 0 auto; }
  .footer-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .footer-socials { display: flex; gap: 14px; }
  .footer-social { font-size: 20px; color: #8f98a0; cursor: pointer; transition: color 0.15s; }
  .footer-social:hover { color: #fff; }
  .footer-logo { font-size: 32px; color: rgba(255,255,255,0.06); font-weight: 900; }
  .footer-up { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; color: #8f98a0; padding: 7px 12px; font-size: 13px; cursor: pointer; }
  .footer-up:hover { color: #fff; }
  .footer-copy { font-size: 11px; color: #5a6a7a; line-height: 1.7; margin-bottom: 14px; }
  .footer-links { display: flex; flex-wrap: wrap; gap: 14px; }
  .footer-link { font-size: 11px; color: #5a6a7a; cursor: pointer; transition: color 0.15s; text-decoration: none; }
  .footer-link:hover { color: #c6d4df; }
`;

function WishCard({ game, onRemove, onAddToCart }) {
  // Використовуємо coverUrl або headerImageUrl (залежно від того, що прийшло з БД)
  const cover = game.coverUrl || game.headerImageUrl || "";
  const platforms = Array.isArray(game.platforms) ? game.platforms : ["windows"]; 

  const reviewColor = {
    "Overwhelmingly Positive": "review-very-positive",
    "Very Positive": "review-very-positive",
    "Mostly Positive": "review-positive",
    "Mixed": "review-mixed",
  }[game.reviews] || "review-positive";

  return (
    <div className="wish-card">
      <div
        className="wish-cover"
        style={{ 
          backgroundImage: cover ? `url(${cover})` : 'none',
          backgroundColor: '#16202d',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {!cover && "No cover"}
      </div>
      
      <div className="wish-body">
        <div className="wish-top">
          <div>
            <div className="wish-badge">{game.type || "Base Game"}</div>
            <div className="wish-title">{game.title}</div>
          </div>
          <div className="wish-price">UAH {game.price}</div>
        </div>

        <div className="wish-meta">
          <div className="wish-row">
            <span className="wish-row-label">Release Date:</span>
            <span>{game.releaseDate ? game.releaseDate.split('T')[0] : "TBA"}</span>
          </div>
          {game.reviews && (
            <div className="wish-row">
              <span className="wish-row-label">Reviews:</span>
              <span className={reviewColor}>{game.reviews}</span>
            </div>
          )}
        </div>

        <div className="wish-platforms">
          {platforms.map((p) => (
            <span key={p} className="platform-icon" title={p}>
              {p === "windows" ? "🪟" : p === "mac" ? "🍎" : "🐧"}
            </span>
          ))}
        </div>

        <div className="wish-actions">
          <button className="wish-remove" onClick={() => onRemove(game.id)}>Remove</button>
          <button className="wish-add-cart" onClick={() => onAddToCart(game.id)}>Add To Cart</button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage({ userId }) {
  const [games, setGames] = useState([]);   
  const [notify, setNotify] = useState(false);
  const [sort, setSort] = useState("on-sale");

  // Зчитування з localStorage при відкритті
useEffect(() => {
  const currentUserId = localStorage.getItem("userId") || "5";
  const wishlistKey = `wishlist_${currentUserId}`; // Такий самий ключ
  const data = localStorage.getItem(wishlistKey);
  
  if (data) {
    setGames(JSON.parse(data));
  } else {
    setGames([]); // Якщо у нового юзера порожньо
  }
}, [userId]);

  const handleRemove = (gameId) => {
    const updated = games.filter(g => g.id !== gameId);
    setGames(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const handleAddToCart = async (gameId) => {
    try {
      const response = await fetch(`https://localhost:7190/api/Cart/${userId}/${gameId}`, {
        method: 'POST'
      });
      if (response.ok) {
        setGames(prev => prev.map(g => g.id === gameId ? { ...g, inCart: true } : g));
      }
    } catch (err) {
      console.error("Cart error:", err);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="page">
        <div className="page-head">
          <h1 className="page-title">My Wishlist</h1>
        </div>

        <div className="notify-bar">
          <div className="notify-left">
            <div className="notify-accent" />
            <span className="notify-icon">✉️</span>
            <span className="notify-text">
              Get notified when your wishlisted games go on sale, or are available for purchase or pre-purchase.
            </span>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} />
            <div className="toggle-track" />
            <div className="toggle-thumb" />
          </label>
        </div>

        

        {games.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">♡</div>
            <div className="empty-title">Your wishlist is empty</div>
            <div className="empty-sub">
              Add games you want to buy later — you'll get notified when they go on sale.
            </div>
            <button className="empty-browse" onClick={() => window.location.href="/"}>Browse the store</button>
          </div>
        ) : (
          games.map(game => (
            <WishCard
              key={game.id}
              game={game}
              onRemove={handleRemove}
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </div>
    </>
  );
}