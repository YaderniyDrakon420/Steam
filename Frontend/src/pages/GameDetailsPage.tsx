import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const css = `
  .game-bg { background: #121212; color: #fff; min-height: 100vh; font-family: sans-serif; padding: 40px 20px; }
  .container { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 320px; gap: 30px; }
  
  /* Left Column */
  .main-img { width: 100%; border-radius: 8px; margin-bottom: 20px; }
  .thumbs { display: flex; gap: 10px; margin-bottom: 30px; }
  .thumb-item { width: 120px; height: 70px; background: #2a2a2a; border-radius: 4px; overflow: hidden; position: relative; }
  .play-icon { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); }

  /* Right Sidebar */
  .side-card { position: sticky; top: 20px; }
  .game-logo { width: 200px; margin-bottom: 20px; }
  .side-desc { color: #aaa; font-size: 14px; line-height: 1.5; margin-bottom: 20px; }
  .info-row { display: flex; justify-content: space-between; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #222; }
  .info-label { color: #666; }
  .add-btn { width: 100%; background: #23d18b; color: #000; border: none; padding: 12px; border-radius: 4px; font-weight: bold; margin-top: 20px; }
  .wish-btn { width: 100%; background: transparent; color: #fff; border: 1px solid #444; padding: 12px; border-radius: 4px; margin-top: 10px; }

  /* Achievements */
  .achievements-sec { margin-top: 50px; grid-column: 1 / -1; }
  .ach-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 20px; }
  .ach-card { background: #1e1e1e; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #333; }
  .ach-icon { width: 64px; height: 64px; margin-bottom: 10px; border-radius: 4px; }
  .ach-title { font-size: 12px; font-weight: bold; margin-bottom: 5px; }
  .ach-rarity { font-size: 10px; color: #23d18b; }
`;

export default function GameDetailsPage() {
  const { id } = useParams();
  const [game, setGame] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
    const fetchGameData = async () => {
        try {
            // Делаем ТОЛЬКО ОДИН запрос. В нем уже будут и игра, и достижения.
            const response = await fetch(`https://localhost:7190/api/Games/${id}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка сервера: ${response.status}. ${errorText}`);
            }

            const data = await response.json();
            console.log("Данные успешно получены:", data);
            
            setGame(data);
            // Если в JSON достижения лежат в поле achievements (с маленькой буквы)
            setAchievements(data.achievements || []); 
            
        } catch (err: any) {
            console.error("Ошибка при загрузке:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchGameData();
}, [id]);

  if (!game) return <div className="game-bg">Loading...</div>;

  return (
    <div className="game-bg">
      <style>{css}</style>
      <div className="container">
        
        {/* Левая часть */}
        <div>
          <img src={game.headerImageUrl || game.coverImageUrl} className="main-img" alt="Main" />
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

        {/* Правая часть (Сайдбар) */}
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

          <button className="add-btn">Add to cart</button>
          <button className="wish-btn">Wishlist</button>
          
          <div style={{ marginTop: 30, padding: 15, background: '#1e1e1e', borderRadius: 8 }}>
            <span style={{ fontSize: 20 }}>16+</span>
            <span style={{ marginLeft: 15, color: '#aaa' }}>Mild Violence</span>
          </div>
        </div>

        {/* Достижения (из БД) */}
        <div className="achievements-sec">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>Achievements ({achievements.length})</h3>
            <span style={{ color: '#23d18b', cursor: 'pointer' }}>Show more →</span>
          </div>
          
          <div className="ach-grid">
            {achievements.map((ach) => (
              <div key={ach.id} className="ach-card">
                <img src={ach.iconUrl} className="ach-icon" alt={ach.title} />
                <div className="ach-title">{ach.title}</div>
                <div className="ach-rarity">{ach.rarityPercentage}% players have this</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}