import React, { useState, useEffect } from "react";

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #1b2838; color: #c6d4df; font-family: Arial, sans-serif; min-height: 100vh; }
  
  .page { max-width: 860px; margin: 0 auto; padding: 36px 20px 80px; }
  
  .page-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
  .page-title { font-size: 26px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 2px; }
  
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
    background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255,255,255,0.05);
    border-radius: 0; display: flex; gap: 0;
    margin-bottom: 10px; overflow: hidden;
    transition: background 0.2s;
  }
  .wish-card:hover { background: rgba(255, 255, 255, 0.05); }
  
  .wish-cover {
    width: 200px; height: 94px; flex-shrink: 0;
    background-color: #16202d; background-size: cover; background-position: center;
  }
  .wish-body { flex: 1; padding: 12px 16px; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .wish-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .wish-title { font-size: 18px; font-weight: 400; color: #fff; text-decoration: none; }
  
  .wish-price-box { display: flex; align-items: center; background: #000; padding-left: 8px; border-radius: 2px; }
  .wish-price { font-size: 14px; color: #fff; padding: 8px 12px; }
  .wish-discount-pct { background: #4c6b22; color: #beee11; font-size: 14px; font-weight: 700; padding: 8px; }
  
  .wish-meta { display: flex; flex-direction: column; gap: 2px; margin-top: 4px; }
  .wish-row { font-size: 11px; color: #8f98a0; }
  .review-positive { color: #66c0f4; }

  .wish-actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: auto; }
  .wish-remove {
    background: none; border: none; color: #8f98a0;
    font-size: 12px; cursor: pointer; text-decoration: underline;
  }
  .wish-remove:hover { color: #fff; }
  .wish-add-cart {
    background: linear-gradient(to bottom, #75b022, #588a1b);
    color: #d2e885; font-size: 12px; font-weight: 700;
    border: none; border-radius: 2px; padding: 6px 14px; cursor: pointer;
  }
`;

function WishCard({ game, onRemove, onAddToCart, userId }) {
  const discountPrice = game.discount > 0 
    ? (game.price * (1 - game.discount / 100)).toFixed(2) 
    : game.price;

  return (
    <div className="wish-card">
      <div
        className="wish-cover"
        style={{ backgroundImage: `url(${game.coverUrl})` }}
      />
      
      <div className="wish-body">
        <div className="wish-top">
          <div className="wish-title">{game.title}</div>
          <div className="wish-price-box">
            {game.discount > 0 && (
              <div className="wish-discount-pct">-{game.discount}%</div>
            )}
            <div className="wish-price">
               {game.price === 0 ? "Free" : `${discountPrice} UAH`}
            </div>
          </div>
        </div>

        <div className="wish-meta">
          <div className="wish-row">Added on {game.addedDate}</div>
          <div className="wish-row">
            Overall reviews: <span className="review-positive">Very Positive</span>
          </div>
        </div>

        <div className="wish-actions">
          <button className="wish-remove" onClick={() => onRemove(game.id)}>
            Remove
          </button>
          <button className="wish-add-cart" onClick={() => onAddToCart(game.id)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage({ userId }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState(false);

  // Завантаження даних з Бекенду
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const response = await fetch(`https://localhost:7190/api/Wishlist/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setGames(data);
        }
      } catch (error) {
        console.error("Помилка при завантаженні Wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  // Видалення через контроллер
  const handleRemove = async (gameId) => {
    try {
      const response = await fetch(`https://localhost:7190/api/Wishlist/${userId}/${gameId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setGames(prev => prev.filter(g => g.id !== gameId));
      } else {
        alert("Не вдалося видалити гру");
      }
    } catch (err) {
      console.error("Помилка видалення:", err);
    }
  };

  // Додавання в кошик через контроллер
  const handleAddToCart = async (gameId) => {
    try {
      const response = await fetch(`https://localhost:7190/api/Cart/${userId}/${gameId}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        alert("Гру додано до кошика!");
        // Опціонально: видаляємо з вішліста після додавання в кошик
        handleRemove(gameId);
      }
    } catch (err) {
      console.error("Помилка кошика:", err);
    }
  };

  if (loading) {
    return <div style={{ color: "white", textAlign: "center", padding: "50px" }}>Loading wishlist...</div>;
  }

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
            <input 
                type="checkbox" 
                checked={notify} 
                onChange={e => setNotify(e.target.checked)} 
            />
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
            <button className="empty-browse" onClick={() => window.location.href="/"}>
                Browse the store
            </button>
          </div>
        ) : (
          games.map(game => (
            <WishCard
              key={game.id}
              game={game}
              userId={userId}
              onRemove={handleRemove}
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </div>
    </>
  );
}