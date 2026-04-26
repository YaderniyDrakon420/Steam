import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Game {
  id: number;
  title: string;
  price: number;
  coverUrl: string;
}

interface Props {
  title: string;
  games: Game[];
}

export default function GameSection({ title, games }: Props) {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: '40px', padding: '0 20px' }}>
      <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '15px', fontWeight: 500 }}>
        {title}
      </h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(6, 1fr)', 
        gap: '15px' 
      }}>
        {games.map(game => (
          <div 
            key={game.id} 
            onClick={() => navigate(`/game/${game.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', aspectRatio: '3/4' }}>
              <img 
                src={game.coverUrl} 
                alt={game.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '11px', color: '#8f98a0', textTransform: 'uppercase' }}>Base Game</div>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500, margin: '2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {game.title}
              </div>
              <div style={{ color: '#fff', fontSize: '13px' }}>
                {game.price === 0 ? "Free" : `UAH ${game.price}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}