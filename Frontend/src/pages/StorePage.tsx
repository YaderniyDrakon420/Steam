import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// StorePage.tsx — Полная версия (C# + MS SQL Integration)
// ─────────────────────────────────────────────────────────────

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #121212; color: #c7c7c7; font-family: Arial, sans-serif; font-size: 14px; }
  a { text-decoration: none; color: inherit; cursor: pointer; }
  button { cursor: pointer; font-family: inherit; }

  /* ── NAVBAR ── */
  .nav {
    background: #1a1a1a; height: 50px; display: flex; align-items: center;
    padding: 0 24px; gap: 0; position: sticky; top: 0; z-index: 200;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .nav-logo { font-size: 17px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px; margin-right: 20px; }
  .nav-logo-sub { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #666; }
  .nav-tabs { display: flex; }
  .nav-tab { font-size: 13px; color: #888; padding: 0 14px; height: 50px; display: flex; align-items: center; border-bottom: 2px solid transparent; transition: 0.15s; }
  .nav-tab.active { color: #fff; border-bottom-color: #23d18b; }
  .nav-search-wrap { position: relative; margin-left: 10px; }
  .nav-search { background: #2a2a2a; border: 1px solid rgba(255,255,255,0.08); border-radius: 3px; padding: 5px 10px 5px 28px; color: #c7c7c7; font-size: 12px; width: 160px; outline: none; }
  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 14px; }
  .nav-btn { background: #23d18b; color: #000; font-size: 12px; font-weight: 700; border: none; border-radius: 3px; padding: 7px 14px; }

  /* ── СТРАНИЦА ── */
  .page { max-width: 1180px; margin: 0 auto; padding: 24px 20px 60px; }

  /* ── HERO BANNER ── */
  .hero { border-radius: 8px; overflow: hidden; height: 400px; background: #1a1a2a; display: flex; align-items: flex-end; position: relative; margin-bottom: 32px; border: 1px solid rgba(255,255,255,0.06); }
  .hero-img { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 0.4s; }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%); }
  .hero-content { position: relative; z-index: 1; padding: 28px 32px; width: 100%; }
  .hero-title { font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 14px; }
  .hero-btn { background: #23d18b; color: #000; font-size: 13px; font-weight: 700; border: none; border-radius: 4px; padding: 10px 24px; }

  /* ── СЕТКИ ── */
  .section { margin-bottom: 36px; }
  .section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .section-title { font-size: 15px; font-weight: 700; color: #fff; }
  .grid-6 { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .grid-lists { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

  /* ── КАРТОЧКИ ── */
  .game-card { background: #1e1e1e; border-radius: 5px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); transition: 0.15s; cursor: pointer; }
  .game-card:hover { transform: translateY(-3px); }
  .game-thumb { width: 100%; aspect-ratio: 3/4; background: #252525; background-size: cover; background-position: center; }
  .game-info { padding: 8px; }
  .game-name { font-size: 11px; font-weight: 600; color: #fff; margin-bottom: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  
  .price-row { display: flex; align-items: center; gap: 5px; }
  .price-badge { background: #4c6b22; color: #beee11; font-size: 10px; font-weight: 700; padding: 1px 4px; border-radius: 2px; }
  .price-old { text-decoration: line-through; color: #555; font-size: 10px; }
  .price-new { color: #beee11; font-weight: 700; }
  .game-price.free { color: #23d18b; font-weight: 700; }

  .list-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .list-thumb { width: 40px; height: 40px; border-radius: 4px; background-size: cover; background-position: center; }

  .footer { background: #111; border-top: 1px solid rgba(255,255,255,0.06); padding: 40px 20px; text-align: center; }
`;

// ── Вспомогательные компоненты ──
function SectionHead({ title }: any) {
  return (
    <div className="section-head">
      <h2 className="section-title">{title}</h2>
      <button style={{ background: 'none', border: 'none', color: '#66c0f4', fontSize: '12px' }}>View more</button>
    </div>
  );
}

function GameCard({ game }: any) {
  const navigate = useNavigate();

  // Если данных нет, рисуем заглушку
  if (!game) {
    return <div style={{ aspectRatio: '3/4', background: '#1a1a1a', borderRadius: 5 }} />;
  }

  const isFree = game.price === 0;

  return (
    <div 
      className="game-card" 
      onClick={() => navigate(`/game/${game.id}`)} 
      style={{ cursor: 'pointer' }}
    >
      <div 
        className="game-thumb" 
        style={{ backgroundImage: `url(${game.coverUrl})` }} 
      />
      <div className="game-info">
        <div className="game-name">{game.title}</div>
        <div className="price-row">
          {game.discountPct > 0 && (
            <span className="price-badge">-{game.discountPct}%</span>
          )}
          <span className={isFree ? "game-price free" : "price-new"}>
            {isFree ? "Free" : `$${game.price}`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function StorePage() {
  const [allGames, setAllGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Инициализируем навигацию

  useEffect(() => {
    fetch("https://localhost:7190/api/Games")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((g: any) => ({
          id: g.id,
          title: g.title,
          price: g.price,
          discountPct: g.discountPercentage,
          coverUrl: g.coverImageUrl,
          // Сохраняем обе ссылки
          headerUrl: g.headerImageUrl,
          coverUrlFull: g.coverImageUrl 
        }));
        setAllGames(formatted);
        setLoading(false);
      })
      .catch(err => console.error("C# API Error:", err));
  }, []);

  const fill = (data: any[], count: number) => {
    return Array.from({ length: count }, (_, i) => data[i] || null);
  };

  if (loading) return <div style={{ color: '#fff', padding: 100, textAlign: 'center' }}>Connecting to MS SQL Server...</div>;

  // Берем первую игру для баннера
  const featuredGame = allGames[0];

  return (
    <>
      <style>{css}</style>

      <div className="page">
        {/* HERO BANNER */}
        <div className="hero">
          {/* ИСПРАВЛЕНО: Если headerUrl пустой (null), используем coverUrl */}
          <div 
            className="hero-img" 
            style={{ 
              backgroundImage: `url(${featuredGame?.headerUrl || featuredGame?.coverUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top' 
            }} 
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div style={{ fontSize: 10, color: '#888', letterSpacing: 2, marginBottom: 8 }}>FEATURED GAME</div>
            <div className="hero-title">{featuredGame?.title}</div>
            
            {/* ИСПРАВЛЕНО: Добавлен onClick для перехода на страницу игры */}
            <button 
              className="hero-btn" 
              onClick={() => featuredGame && navigate(`/game/${featuredGame.id}`)}
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* DISCOVER SOMETHING NEW */}
        <div className="section">
          <SectionHead title="Discover Something New" />
          <div className="grid-6">
            {fill(allGames.slice(0, 6), 6).map((g, i) => <GameCard key={i} game={g} />)}
          </div>
        </div>

        {/* Остальные секции (Sale Spotlight, Free Games и т.д.) остаются без изменений */}
        <div className="section">
          <SectionHead title="Game Sale Spotlight" />
          <div className="grid-6">
            {fill(allGames.slice(6, 12), 6).map((g, i) => <GameCard key={i} game={g} />)}
          </div>
        </div>

        <div className="section">
          <div style={{ background: '#1e1e1e', padding: '15px', borderRadius: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🎁</span> <b>Free Games</b>
          </div>
          <div className="grid-3">
            {fill(allGames.filter(g => g.price === 0).slice(0, 3), 3).map((g, i) => (
              <div 
                key={i} 
                onClick={() => g && navigate(`/game/${g.id}`)} // Тоже делаем кликабельным
                style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #333', cursor: 'pointer' }}
              >
                <div style={{ height: 160, backgroundImage: `url(${g?.coverUrl})`, backgroundSize: 'cover' }} />
                <div style={{ padding: 10, background: '#1e1e1e' }}>
                  <div style={{ fontSize: 13, fontWeight: 'bold' }}>{g?.title || "Upcoming Free Game"}</div>
                  <div style={{ color: '#23d18b', fontSize: 11, marginTop: 5 }}>Free Now</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}