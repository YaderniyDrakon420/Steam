import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const listCss = `
  .ach-page { max-width: 860px; margin: 0 auto; padding: 40px 20px; }
  .ach-header { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; }
  .ach-list { display: flex; flex-direction: column; gap: 10px; }
  .ach-item { 
    background: #16202d; 
    display: flex; 
    align-items: center; 
    padding: 15px; 
    border-radius: 4px; 
    border: 1px solid rgba(255,255,255,0.05);
    position: relative;
    overflow: hidden;
  }
  .ach-icon { width: 64px; height: 64px; border-radius: 4px; margin-right: 20px; z-index: 2; }
  .ach-info { flex: 1; z-index: 2; }
  .ach-title { color: #fff; font-size: 16px; font-weight: 600; margin-bottom: 4px; }
  .ach-desc { color: #8f98a0; font-size: 13px; }
  .ach-rarity-box { text-align: right; z-index: 2; }
  .ach-pct { color: #fff; font-size: 14px; font-weight: 600; }
  .ach-progress-bg {
    position: absolute; left: 0; top: 0; bottom: 0; 
    background: rgba(102, 192, 244, 0.05);
    z-index: 1;
  }
`;

export default function UserAchievementsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://localhost:7190/api/Profile/${userId}/achievements`)
      .then(res => res.json())
      .then(data => {
        setAchievements(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div style={{ color: '#fff', padding: 100 }}>Loading...</div>;

  return (
    <div className="ach-page">
      <style>{listCss}</style>
      <div className="ach-header">
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: '1px solid #333', color: '#fff', padding: '5px 10px', borderRadius: 4 }}>← Back</button>
        <h1 style={{ color: '#fff', fontSize: '24px' }}>All Achievements ({achievements.length})</h1>
      </div>

      <div className="ach-list">
        {achievements.map(a => (
          <div key={a.id} className="ach-item">
            {/* Полоска прогресса на фоне (как в Steam) */}
            <div className="ach-progress-bg" style={{ width: `${a.rarityPct}%` }} />
            
            <img src={a.iconUrl || "https://via.placeholder.com/64"} className="ach-icon" alt="" />
            <div className="ach-info">
              <div className="ach-title">{a.title}</div>
              <div className="ach-desc">{a.description || "No description available"}</div>
            </div>
            <div className="ach-rarity-box">
              <div className="ach-pct">{a.rarityPct}%</div>
              <div style={{ fontSize: '10px', color: '#8f98a0' }}>of players</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}