import { useState } from "react";

// 1. ТИПЫ
interface NewsItem {
  days: string;
  title: string;
  desc: string;
  link: string;
  image: string | null;
}

// 2. СТИЛИ (CSS)
const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #1b2838; color: #c6d4df; font-family: Arial, sans-serif; min-height: 100vh; }

  .navbar {
    background: #171a21; height: 52px; display: flex; align-items: center;
    padding: 0 20px; gap: 20px; position: sticky; top: 0; z-index: 100;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .nav-logo { font-size: 18px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 6px; }
  .nav-logo span { font-size: 11px; letter-spacing: 2px; color: #8f98a0; font-weight: 400; }
  .nav-links { display: flex; gap: 4px; }
  .nav-link { font-size: 12px; color: #8f98a0; padding: 6px 10px; border-radius: 3px; cursor: pointer; background: none; border: none; outline: none; }
  .nav-link:hover { color: #fff; }
  .nav-link.active { color: #fff; background: rgba(255,255,255,0.1); }
  
  .nav-search { max-width: 200px; background: #2a3f55; border: none; border-radius: 3px; padding: 6px 10px; color: #c6d4df; font-size: 12px; outline: none; }
  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .nav-icons { display: flex; gap: 12px; color: #8f98a0; font-size: 15px; cursor: pointer; }
  .nav-download { background: linear-gradient(to bottom, #75b022, #588a1b); color: #d2e885; font-size: 12px; font-weight: 700; border: none; border-radius: 3px; padding: 7px 14px; cursor: pointer; }
  
  .content { max-width: 860px; margin: 0 auto; padding: 30px 20px 60px; width: 100%; flex: 1; }

  .section-title-main {
    font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 24px;
    border-left: 3px solid #66c0f4; padding-left: 12px;
  }
  .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
  .news-card { background: #16202d; border-radius: 6px; padding: 18px; display: flex; flex-direction: column; }
  .news-image { width: 100%; height: 140px; background: #1e2a36; border-radius: 4px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; color: #5a6a7a; font-size: 12px; }
  .news-date { font-size: 11px; color: #8f98a0; margin-bottom: 8px; }
  .news-title { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 10px; }
  .news-desc { font-size: 13px; color: #c6d4df; line-height: 1.4; margin-bottom: 12px; }
  .news-readmore { font-size: 12px; color: #66c0f4; text-decoration: none; margin-top: auto; }

  .footer { background: #171a21; border-top: 1px solid rgba(255,255,255,0.05); padding: 24px 20px; margin-top: auto; }
  .footer-inner { max-width: 860px; margin: 0 auto; }
  .footer-copy { font-size: 11px; color: #5a6a7a; }
`;

const NEWS_DATA: NewsItem[] = [
  { days: "4 days ago", title: "Star Wars: KOTOR free on mobile", desc: "Feudal Gotham's Dark Night and Ninja Knight Batman strike back.", link: "#", image: null },
  { days: "2 days ago", title: "Killing Floor 3 development", desc: "How classic horror movies shaped the new game mechanics.", link: "#", image: null },
  { days: "1 day ago", title: "Delta Force: Black Hawk Down", desc: "The legendary shooter returns as a free co-op experience.", link: "#", image: null },
];

// 3. КОМПОНЕНТЫ
function NewsPage() {
  return (
    <>
      <h1 className="section-title-main">Relevant News</h1>
      <div className="news-grid">
        {NEWS_DATA.map((item, idx) => (
          <div key={idx} className="news-card">
            <div className="news-image">No Image</div>
            <div className="news-date">{item.days}</div>
            <h3 className="news-title">{item.title}</h3>
            <p className="news-desc">{item.desc}</p>
            <a href={item.link} className="news-readmore">Read More →</a>
          </div>
        ))}
      </div>
    </>
  );
}

// ГЛАВНЫЙ КОМПОНЕНТ
export default function App() {
  const [page] = useState("news");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <style>{css}</style>
      
      

      {/* КОНТЕНТ СТРАНИЦЫ */}
      <main className="content">
        {page === "news" && <NewsPage />}
        {page === "discover" && <div style={{textAlign: 'center', marginTop: '50px'}}>Discover Page Content</div>}
        {page === "support" && <div style={{textAlign: 'center', marginTop: '50px'}}>Support Page Content</div>}
      </main>

      {/* ФУТЕР */}
      <footer className="footer">
        <div className="footer-inner">
          <p className="footer-copy">© 2026 Valve Corporation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}