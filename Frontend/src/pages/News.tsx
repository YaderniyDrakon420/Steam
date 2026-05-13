import { useState } from "react";

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #1b2838; color: #c6d4df; font-family: Arial, sans-serif; min-height: 100vh; }

  .navbar {
    background: #171a21; height: 52px; display: flex; align-items: center;
    padding: 0 20px; gap: 20px; position: sticky; top: 0; z-index: 100;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .nav-logo { font-size: 18px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 6px; cursor: pointer; }
  .nav-logo span { font-size: 11px; letter-spacing: 2px; color: #8f98a0; font-weight: 400; }
  .nav-links { display: flex; gap: 4px; }
  .nav-link { font-size: 12px; color: #8f98a0; padding: 6px 10px; border-radius: 3px; cursor: pointer; background: none; border: none; }
  .nav-link:hover { color: #fff; }
  .nav-search { max-width: 200px; background: #2a3f55; border: none; border-radius: 3px; padding: 6px 10px; color: #c6d4df; font-size: 12px; outline: none; }
  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .nav-icons { display: flex; gap: 12px; color: #8f98a0; font-size: 15px; cursor: pointer; }
  .nav-download { background: linear-gradient(to bottom, #75b022, #588a1b); color: #d2e885; font-size: 12px; font-weight: 700; border: none; border-radius: 3px; padding: 7px 14px; cursor: pointer; }
  @media (max-width: 600px) { .nav-links { display: none; } }

  .content { max-width: 900px; margin: 0 auto; padding: 30px 20px 60px; width: 100%; }

  .section-title-main {
    font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 24px;
    border-left: 3px solid #66c0f4; padding-left: 12px;
  }

  .featured-news {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 40px;
  }
  .featured-card {
    background: #16202d;
    border-radius: 6px;
    padding: 18px;
    transition: background 0.2s, transform 0.2s;
    cursor: pointer;
  }
  .featured-card:hover { background: #1a2a3a; transform: translateY(-2px); }
  .featured-image {
    width: 100%; height: 160px; background: #2a3f55; border-radius: 4px;
    margin-bottom: 12px; display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .featured-image img { width: 100%; height: 100%; object-fit: cover; }
  .featured-date { font-size: 11px; color: #8f98a0; margin-bottom: 8px; }
  .featured-title { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 10px; line-height: 1.3; }
  .featured-desc { font-size: 12px; color: #c6d4df; line-height: 1.4; margin-bottom: 12px; }
  .featured-readmore { font-size: 12px; color: #66c0f4; text-decoration: none; cursor: pointer; background: none; border: none; font-family: inherit; }

  .separator {
    height: 1px;
    background: linear-gradient(to right, transparent, #2a3f55, transparent);
    margin: 20px 0 30px;
  }

  .news-grid-2cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .news-row-item {
    background: #16202d;
    border-radius: 6px;
    padding: 14px;
    display: flex;
    gap: 14px;
    transition: background 0.2s;
    cursor: pointer;
    align-items: center;
  }
  .news-row-item:hover { background: #1a2a3a; }
  .news-row-image {
    width: 70px;
    height: 70px;
    background: #2a3f55;
    border-radius: 4px;
    flex-shrink: 0;
    overflow: hidden;
  }
  .news-row-image img { width: 100%; height: 100%; object-fit: cover; }
  .news-row-content { flex: 1; min-width: 0; }
  .news-row-date { font-size: 10px; color: #8f98a0; margin-bottom: 4px; }
  .news-row-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 4px; line-height: 1.3; }
  .news-row-desc { font-size: 11px; color: #c6d4df; margin-bottom: 6px; line-height: 1.3; }
  .news-row-readmore { font-size: 10px; color: #66c0f4; text-decoration: none; cursor: pointer; background: none; border: none; font-family: inherit; }

  @media (max-width: 650px) {
    .news-grid-2cols { grid-template-columns: 1fr; }
  }

  .pagination {
    display: flex; align-items: center; justify-content: center;
    gap: 6px; margin-top: 40px; margin-bottom: 20px; flex-wrap: wrap;
  }
  .page-btn {
    background: none; border: none; color: #8f98a0; font-size: 13px;
    padding: 6px 12px; border-radius: 3px; cursor: pointer;
    transition: background 0.15s, color 0.15s;
    min-width: 36px;
  }
  .page-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
  .page-btn.active { background: #316282; color: #fff; }
  .page-btn:disabled { opacity: 0.3; cursor: default; }

  .game-page {
    background: #16202d;
    border-radius: 8px;
    padding: 30px;
  }
  .game-header {
    display: flex;
    gap: 30px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }
  .game-image {
    width: 300px;
    height: 300px;
    background: #2a3f55;
    border-radius: 8px;
    overflow: hidden;
  }
  .game-image img { width: 100%; height: 100%; object-fit: cover; }
  .game-info { flex: 1; }
  .game-title { font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 15px; }
  .game-meta { font-size: 13px; color: #8f98a0; margin-bottom: 20px; }
  .game-meta div { margin-bottom: 5px; }
  .game-full-description { font-size: 14px; line-height: 1.6; color: #c6d4df; margin-bottom: 20px; }
  .back-button {
    background: #316282; border: none; border-radius: 4px;
    padding: 10px 20px; color: #fff; cursor: pointer;
    font-size: 14px; margin-bottom: 20px; display: inline-block;
  }
  .back-button:hover { background: #417a9e; }

  .footer {
    background: #171a21; border-top: 1px solid rgba(255,255,255,0.05);
    padding: 24px 20px; margin-top: auto;
  }
  .footer-inner { max-width: 860px; margin: 0 auto; }
  .footer-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .footer-socials { display: flex; gap: 14px; font-size: 18px; color: #8f98a0; cursor: pointer; }
  .footer-up { background: rgba(255,255,255,0.08); border: none; border-radius: 3px; color: #8f98a0; padding: 5px 10px; cursor: pointer; }
  .footer-copy { font-size: 11px; color: #5a6a7a; line-height: 1.6; margin-bottom: 12px; }
  .footer-links { display: flex; flex-wrap: wrap; gap: 12px; }
  .footer-link { font-size: 11px; color: #5a6a7a; cursor: pointer; text-decoration: none; }
  .footer-link:hover { color: #c6d4df; }
`;

// ==================== ДАННЫЕ ИГР СО ВСЕМИ КАРТИНКАМИ ====================
const GAMES_DATA = [
  {
    id: 0,
    title: "Star Wars: Knights of the Old Republic I & II",
    shortTitle: "Star Wars: KOTOR I and II",
    fullDesc: "Experience the award-winning Star Wars RPGs that defined a generation. Knights of the Old Republic takes place 4,000 years before the rise of Darth Vader, where you'll choose your path as a Jedi or Sith. Make choices that affect your destiny and explore iconic locations across the galaxy. Both games feature deep character customization, memorable companions, and a story twist that shocked millions of players worldwide.",
    releaseDate: "2003",
    developer: "BioWare / Obsidian Entertainment",
    genre: "RPG",
    image: "https://cdn-ext.fanatical.com/production/product/1280x720/acf3e2b8-8040-4200-a951-4a4dafbfe217.jpeg"
  },
  {
    id: 1,
    title: "Killing Floor 3",
    shortTitle: "Killing Floor 3",
    fullDesc: "The next generation of co-op zombie survival horror is here! Killing Floor 3 brings back the brutal gore and intense combat the series is known for, now with next-gen graphics and new mechanics. Team up with up to 5 friends to fight against waves of Zeds using an arsenal of powerful weapons. New features include vertical traversal, special abilities, and even more horrific enemy variants.",
    releaseDate: "2025",
    developer: "Tripwire Interactive",
    genre: "Co-op FPS",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRanD5ExxjvpohSQCjwjC7FLV-vVpwTA-OMpJxC44kWGvmJC9oS8KJGriHRIcCrukBEWiCKS2BNFwemlOSNX-Y1lYs6UsAw7OG0G3jYhzGdyQ&s=10"
  },
  {
    id: 2,
    title: "Delta Force: Black Hawk Down",
    shortTitle: "Delta Force: Black Hawk Down",
    fullDesc: "Relive the iconic battle of Mogadishu in this free co-op tactical shooter. Delta Force: Black Hawk Down offers authentic military gameplay with realistic weapons and vehicles. Play solo or with friends in intense missions based on the film and real events. Features include a variety of special forces operators, customizable loadouts, and challenging objectives.",
    releaseDate: "2025",
    developer: "TiMi Studio Group",
    genre: "Tactical Shooter",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD5soqp3gZW_cEKAr1voJUJl9b5DmsKOs0Uw&s"
  },
  {
    id: 3,
    title: "Blades of Fire",
    shortTitle: "Blades of Fire",
    fullDesc: "Forge your legend in a dark fantasy world where only you can wield the legendary Blades of Fire. Coming to Epic Games Store this May, this action RPG features deep combat mechanics, a rich crafting system, and a story where your choices shape the world around you. Master different blade types, unlock powerful abilities, and uncover the secrets of the ancient forge.",
    releaseDate: "2025",
    developer: "MercurySteam",
    genre: "Action RPG",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1dxxhbURzKwRPuKEdpRjQf2VbJQIdyBQIhBUcXezx4pP0llgd0c8hBgpbqBr8ILyz1oVNVTcPq8stJFxnFjd4dIjj11F9-dIJxp60BIc9&s=10"
  },
  {
    id: 4,
    title: "Infinity Nikki Daily Guide",
    shortTitle: "Infinity Nikki Guide",
    fullDesc: "The ultimate guide for Infinity Nikki players! Learn the fastest ways to earn Bling, Diamonds, and rare crafting materials. This guide covers daily activities, optimal farming routes, and secret locations for rare items. Whether you're a new player or a veteran, these tips will help you maximize your daily rewards.",
    releaseDate: "2024",
    developer: "Infold Games",
    genre: "Guide",
    image: "data:image/jpeg;base64,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"
  },
  {
    id: 5,
    title: "SMITE 2 Beginner's Guide",
    shortTitle: "SMITE 2 Guide",
    fullDesc: "Everything you need to know to start your journey in SMITE 2! This beginner's guide covers god selection, roles, map mechanics, and team strategies. Learn how to play effectively with your team of 5, master different pantheons, and climb the ranks. Perfect for new players looking to understand the fast-paced MOBA action.",
    releaseDate: "2025",
    developer: "Titan Forge Games",
    genre: "MOBA",
    image: "data:image/jpeg;base64,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"
  },
  {
    id: 6,
    title: "The WereCleaner",
    shortTitle: "The WereCleaner",
    fullDesc: "A unique horror game that turns office cleaning into a moral dilemma! Play as a janitor who turns into a werewolf at night. Will you clean up the mess... or make more? With multiple endings and branching paths, every choice matters. Features dark humor, atmospheric environments, and a story that will keep you guessing.",
    releaseDate: "2025",
    developer: "Indie Studio",
    genre: "Horror/Comedy",
    image: "data:image/jpeg;base64,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"
  },
  {
    id: 7,
    title: "Future Games Show Spring Showcase",
    shortTitle: "Future Games Show",
    fullDesc: "Shadowheart and Nathan Drake host the biggest gaming event of spring! Over 40 titles will be revealed, including exclusive first looks at upcoming games. Tune in March 20 for world premieres, developer interviews, and special announcements. Don't miss this showcase of the future of gaming!",
    releaseDate: "March 20, 2025",
    developer: "Various",
    genre: "Event",
    image: "data:image/jpeg;base64,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"
  }
];

type NewsItem = {
  id: number;
  gameId: number;
  title: string;
  desc: string;
  fullDesc?: string;
  days: string;
};

type GamePageProps = {
  game: NewsItem;
  onBack: () => void;
};

type NewsPageProps = {
  onGameSelect: (item: NewsItem) => void;
};

// ==================== ГЕНЕРАЦИЯ НОВОСТЕЙ ====================
const generateAllNews = () => {
  const news = [];
  const daysAgo = ["Just now", "1 hour ago", "2 hours ago", "3 hours ago", "5 hours ago", "1 day ago", "2 days ago", "3 days ago", "4 days ago", "5 days ago", "6 days ago"];
  const descriptions = [
    "Breaking news about this amazing game! New features and content revealed.",
    "Check out the latest updates and patch notes for this popular title.",
    "Developer interview: Behind the scenes of the making of this game.",
    "Exclusive first look at upcoming DLC and expansion packs.",
    "Community event announced! Join the fun and win exclusive rewards.",
    "Critical acclaim: This game is getting rave reviews from critics.",
    "New gameplay trailer dropped! Watch the action-packed footage now.",
    "Special sale alert! Get this game at a discounted price this week."
  ];
  
  for (let i = 0; i < 80; i++) {
    const game = GAMES_DATA[i % GAMES_DATA.length];
    const dayIndex = i % daysAgo.length;
    const descIndex = i % descriptions.length;
    news.push({
      id: i,
      gameId: game.id,
      days: daysAgo[dayIndex],
      title: game.shortTitle + (i >= GAMES_DATA.length ? ` — Special Update #${Math.floor(i / GAMES_DATA.length) + 1}` : ""),
      desc: descriptions[descIndex] + " " + game.fullDesc.substring(0, 60),
      fullDesc: game.fullDesc + " " + descriptions[descIndex]
    });
  }
  return news;
};

const ALL_NEWS = generateAllNews();
const NEWS_PER_PAGE = 10;

// ==================== ПАГИНАЦИЯ ====================
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = (): (number | string)[] => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Previous
      </button>

      {getPageNumbers().map((page, idx: number) => (
        <button
          key={idx}
          className={`page-btn ${currentPage === page ? "active" : ""}`}
          onClick={() => {
            if (typeof page === "number") onPageChange(page);
          }}
          disabled={typeof page !== "number"}
          style={typeof page !== "number" ? { cursor: "default" } : {}}
        >
          {page}
        </button>
      ))}

      <button
        className="page-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next →
      </button>
    </div>
  );
}

// ==================== ГЛАВНАЯ СТРАНИЦА ====================
function NewsPage({ onGameSelect }: NewsPageProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(ALL_NEWS.length / NEWS_PER_PAGE);

  const startIndex = (currentPage - 1) * NEWS_PER_PAGE;
  const endIndex = startIndex + NEWS_PER_PAGE;
  const currentNews = ALL_NEWS.slice(startIndex, endIndex);

  const featuredNews = currentNews.slice(0, 2);
  const restNews = currentNews.slice(2);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  return (
    <>
      <h1 className="section-title-main">Relevant News</h1>

      <div className="featured-news">
        {featuredNews.map((item: NewsItem) => (
          <div key={item.id} className="featured-card">
            <div className="featured-image">
              {GAMES_DATA[item.gameId]?.image && (
                <img src={GAMES_DATA[item.gameId].image} alt={item.title} />
              )}
            </div>
            <div className="featured-date">{item.days}</div>
            <h3 className="featured-title">{item.title}</h3>
            <p className="featured-desc">{item.desc.substring(0, 80)}...</p>
            <button
              className="featured-readmore"
              onClick={() => onGameSelect(item)}
            >
              Read More →
            </button>
          </div>
        ))}
      </div>

      <div className="separator"></div>

      <div className="news-grid-2cols">
        {restNews.map((item: NewsItem) => (
          <div key={item.id} className="news-row-item">
            <div className="news-row-image">
              {GAMES_DATA[item.gameId]?.image && (
                <img src={GAMES_DATA[item.gameId].image} alt={item.title} />
              )}
            </div>
            <div className="news-row-content">
              <div className="news-row-date">{item.days}</div>
              <h3 className="news-row-title">{item.title}</h3>
              <p className="news-row-desc">
                {item.desc.substring(0, 60)}...
              </p>
              <button
                className="news-row-readmore"
                onClick={() => onGameSelect(item)}
              >
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}

// ==================== СТРАНИЦА ИГРЫ ====================
function GamePage({ game, onBack }: GamePageProps) {
  if (!game) {
    return <div className="content">Новость не найдена</div>;
  }

  const gameData = GAMES_DATA[game.gameId];

  return (
    <div className="content">
      <button className="back-button" onClick={onBack}>
        ← Back to News
      </button>

      <div className="game-page">
        <div className="game-header">
          <div className="game-image">
            {gameData?.image && (
              <img src={gameData.image} alt={game.title} />
            )}
          </div>

          <div className="game-info">
            <h1 className="game-title">{game.title}</h1>

            <div className="game-meta">
              <div>📅 Published: {game.days}</div>
              <div>🎮 Developer: {gameData?.developer || "Various"}</div>
              <div>🏷️ Genre: {gameData?.genre || "Game"}</div>
              {gameData?.releaseDate && (
                <div>📆 Release: {gameData.releaseDate}</div>
              )}
            </div>

            <p className="game-full-description">
              {game.fullDesc || game.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
// ==================== ГЛАВНЫЙ КОМПОНЕНТ ====================
export default function App() {
  const [currentGame, setCurrentGame] = useState<NewsItem | null>(null);
  
  if (currentGame !== null) {
    return (
      <>
        <style>{css}</style>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <GamePage game={currentGame} onBack={() => setCurrentGame(null)} />
        </div>
      </>
    );
  }
  
  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div className="content">
          <NewsPage onGameSelect={(item) => {
              setCurrentGame(item);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }} />
        </div>
      </div>
    </>
  );
}