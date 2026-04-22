import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Импортируем контекст

// 1. ОПИСАНИЕ ТИПОВ
interface Achievement {
  id: number;
  title: string;
  rarityPct: number;
  iconUrl: string | null;
  unlocked: boolean;
}

interface Game {
  id: number;
  title: string;
  playTime: number;
  lastPlayed: string;
  completedPct: number;
  coverUrl: string | null;
}

interface User {
  nickname: string;
  email: string;
  avatarUrl: string | null;
  level: number;
  balance: number;
  gamesCount: number;
  achievementsCount: number;
}

const css = `
  .profile-page { max-width: 860px; margin: 0 auto; padding: 30px 20px 60px; }
  .profile-header {
    background: #16202d; border-radius: 6px; padding: 24px;
    display: flex; align-items: center; gap: 24px;
    margin-bottom: 28px; position: relative;
  }
  .avatar {
    width: 88px; height: 88px; border-radius: 4px; background: #2a3a4a;
    display: flex; align-items: center; justify-content: center;
    font-size: 36px; color: #5a6a7a; border: 2px solid rgba(255,255,255,0.1); overflow: hidden;
  }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .profile-info { flex: 1; min-width: 0; }
  .profile-level { font-size: 12px; color: #8f98a0; margin-bottom: 4px; }
  .profile-level span { color: #66c0f4; font-weight: 700; }
  .profile-name { font-size: 26px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .profile-email { font-size: 12px; color: #5a6a7a; margin-bottom: 12px; }
  .profile-stats { display: flex; gap: 28px; flex-wrap: wrap; }
  .stat-num { font-size: 20px; font-weight: 700; color: #fff; }
  .stat-label { font-size: 11px; color: #8f98a0; margin-top: 2px; }
  .balance-chip {
    position: absolute; bottom: 52px; right: 16px;
    background: #1e3a1e; border: 1px solid #3a6a3a;
    border-radius: 3px; padding: 4px 10px;
    font-size: 12px; color: #75b022; font-weight: 700;
  }
  .edit-btn {
    position: absolute; bottom: 16px; right: 16px;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 3px; color: #8f98a0; font-size: 11px; padding: 5px 10px; cursor: pointer;
  }
  .section { margin-bottom: 32px; }
  .section-title { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 16px; }
  .achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px; }
  .achievement-card { text-align: center; }
  .achievement-img {
    width: 100%; aspect-ratio: 1; border-radius: 4px; background: #2a3a4a;
    margin-bottom: 6px; display: flex; align-items: center; justify-content: center;
    font-size: 26px; border: 1px solid rgba(255,255,255,0.07); overflow: hidden;
  }
  .achievement-img img { width: 100%; height: 100%; object-fit: cover; }
  .achievement-name { font-size: 11px; color: #c6d4df; margin-bottom: 2px; }
  .achievement-rarity { font-size: 10px; color: #8f98a0; }
  .games-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .game-card { background: #16202d; border-radius: 4px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
  .game-cover { width: 100%; height: 110px; object-fit: cover; display: block; }
  .game-info { padding: 10px 12px; }
  .game-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .game-hours { font-size: 10px; color: #8f98a0; line-height: 1.5; }
  .progress-bar { height: 4px; background: #2a3a4a; border-radius: 2px; margin-top: 8px; }
  .progress-fill { height: 100%; background: #5c7e10; border-radius: 2px; }
  .status-screen { display: flex; height: 50vh; align-items: center; justify-content: center; color: #8f98a0; }
`;

// Базовый URL теперь без ID в конце
const API_BASE_URL = "https://localhost:7190/api/Profile";

function ProfileHeader({ user }: { user: User }) {
  return (
    <div className="profile-header">
      <div className="avatar">
        {user.avatarUrl ? <img src={user.avatarUrl} alt="avatar" /> : "👤"}
      </div>
      <div className="profile-info">
        <div className="profile-level">Level <span>{user.level}</span></div>
        <div className="profile-name">{user.nickname}</div>
        <div className="profile-email">{user.email}</div>
        <div className="profile-stats">
          <div>
            <div className="stat-num">{user.gamesCount}</div>
            <div className="stat-label">Games</div>
          </div>
          <div>
            <div className="stat-num">{user.achievementsCount}</div>
            <div className="stat-label">Achievements</div>
          </div>
        </div>
      </div>
      <div className="balance-chip">$ {user.balance.toFixed(2)}</div>
      <button className="edit-btn">Edit profile</button>
    </div>
  );
}

function AchievementsSection({ items }: { items: Achievement[] }) {
  return (
    <div className="section">
      <h2 className="section-title">Achievements</h2>
      <div className="achievements-grid">
        {items.map((a: Achievement) => (
          <div key={a.id} className="achievement-card">
            <div className="achievement-img">
              {a.iconUrl ? <img src={a.iconUrl} alt={a.title} /> : "🏆"}
            </div>
            <div className="achievement-name">{a.title}</div>
            <div className="achievement-rarity">{a.rarityPct}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GameCard({ game }: { game: Game }) {
  return (
    <div className="game-card">
      <img className="game-cover" src={game.coverUrl || "https://via.placeholder.com/200x110"} alt={game.title} />
      <div className="game-info">
        <div className="game-title">{game.title}</div>
        <div className="game-hours">
          {game.playTime}h played<br />
          Last played: {new Date(game.lastPlayed).toLocaleDateString()}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${game.completedPct}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Достаем ID текущего пользователя из контекста
  const auth = useContext(AuthContext);
  const userId = auth?.userId;

  useEffect(() => {
    // Если пользователь не авторизован (ID нет), не делаем запрос
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        // Параллельно загружаем профиль, игры и достижения по динамическому ID
        const [uRes, gRes, aRes] = await Promise.all([
          fetch(`${API_BASE_URL}/${userId}`),
          fetch(`${API_BASE_URL}/${userId}/games`),
          fetch(`${API_BASE_URL}/${userId}/achievements`)
        ]);

        if (!uRes.ok || !gRes.ok || !aRes.ok) throw new Error("API Error");

        const userData: User = await uRes.json();
        const gData: Game[] = await gRes.json();
        const aData: Achievement[] = await aRes.json();

        setUser(userData);
        setGames(gData);
        setAchievements(aData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]); // Перезагружаем данные, если userId изменится

  if (loading) return <div className="status-screen"><style>{css}</style>Loading Profile...</div>;
  
  // Если не залогинен или возникла ошибка
  if (!userId || !user) return (
    <div className="status-screen">
      <style>{css}</style>
      Please sign in to view your profile.
    </div>
  );

  return (
    <div className="profile-page">
      <style>{css}</style>
      <ProfileHeader user={user} />
      {achievements.length > 0 && <AchievementsSection items={achievements} />}
      <div className="section">
        <h2 className="section-title">Game Collection ({games.length})</h2>
        <div className="games-grid">
          {games.map((g: Game) => <GameCard key={g.id} game={g} />)}
        </div>
      </div>
    </div>
  );
}