import { useState, useRef, useEffect } from "react";

// 1. ИНТЕРФЕЙСЫ
interface SupportCategory {
  id: number;
  title: string;
  body: string;
}

interface AccordionItemProps {
  item: SupportCategory;
  isOpen: boolean;
  onToggle: () => void;
}

interface PaginationProps {
  current: number;
  onChange: (page: number) => void;
}

// Стили только для элементов страницы поддержки
const supportStyles = `
  .support-page { max-width: 780px; margin: 0 auto; padding: 40px 20px 60px; }
  .page-title { font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 20px; }

  .search-wrap { position: relative; margin-bottom: 28px; max-width: 420px; }
  .search-wrap::before { content: "🔍"; position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 13px; }
  .search-input { width: 100%; background: transparent; border: 1px solid #4a5a6a; border-radius: 20px; padding: 9px 14px 9px 34px; color: #c6d4df; font-size: 13px; outline: none; transition: border-color 0.2s; }
  .search-input:focus { border-color: #66c0f4; }
  .search-input::placeholder { color: #5a6a7a; }

  .accordion-list { margin-bottom: 32px; }
  .accordion-item { border-bottom: 1px solid rgba(255,255,255,0.07); }
  .accordion-item:first-child { border-top: 1px solid rgba(255,255,255,0.07); }

  .accordion-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 4px; cursor: pointer; transition: background 0.15s;
  }
  .accordion-header:hover { background: rgba(255,255,255,0.04); }
  .accordion-title { font-size: 14px; color: #c6d4df; }

  .accordion-arrow {
    font-size: 18px; color: #8f98a0; transition: transform 0.25s ease;
  }
  .accordion-arrow.open { transform: rotate(90deg); }

  .accordion-body {
    overflow: hidden; transition: height 0.25s ease, opacity 0.2s ease;
    height: 0; opacity: 0;
  }
  .accordion-body.open { opacity: 1; }
  .accordion-body-inner { padding: 0 4px 16px; font-size: 13px; color: #8f98a0; line-height: 1.6; }

  .cta-block { text-align: center; padding: 40px 20px; border-top: 1px solid rgba(255,255,255,0.07); margin-top: 40px; }
  .cta-title { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 20px; }
  .cta-btn { background: linear-gradient(to bottom, #75b022, #588a1b); color: #d2e885; font-size: 14px; font-weight: 700; border: none; border-radius: 3px; padding: 13px 28px; cursor: pointer; }
`;

const CATEGORIES: SupportCategory[] = [
  { id: 1, title: "Game problems", body: "If you are contacted by support, the email will come from the official domain. Any email with a different domain is not official." },
  { id: 2, title: "Refund", body: "Refunds are available within 14 days of purchase if you have less than 2 hours of playtime." },
  { id: 3, title: "My account", body: "Manage settings, change passwords, and enable two-factor authentication here." },
  { id: 4, title: "Client", body: "If the app is lagging, try clearing the cache or reinstalling the client." },
  { id: 5, title: "Community problems", body: "Report inappropriate behavior or appeal bans via the community portal." },
];

function AccordionItem({ item, isOpen, onToggle }: AccordionItemProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.style.height = isOpen ? `${el.scrollHeight}px` : "0px";
  }, [isOpen]);

  return (
    <div className="accordion-item">
      <div className="accordion-header" onClick={onToggle}>
        <span className="accordion-title">{item.title}</span>
        <span className={`accordion-arrow ${isOpen ? "open" : ""}`}>›</span>
      </div>
      <div ref={bodyRef} className={`accordion-body ${isOpen ? "open" : ""}`}>
        <div className="accordion-body-inner">{item.body}</div>
      </div>
    </div>
  );
}

function Pagination({ current, onChange }: PaginationProps) {
  const pages = [1, 2, 3, 4, 5];
  return (
    <div className="pagination">
      <button className="page-btn" disabled={current === 1} onClick={() => onChange(current - 1)}>‹ Prev</button>
      {pages.map(p => (
        <button key={p} className={`page-btn ${current === p ? "active" : ""}`} onClick={() => onChange(p)}>{p}</button>
      ))}
      <button className="page-btn" onClick={() => onChange(current + 1)}>Next ›</button>
    </div>
  );
}

export default function SupportPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = CATEGORIES.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: number) => setOpenId(prev => prev === id ? null : id);

  return (
    <div className="support-page">
      <style>{supportStyles}</style>
      <h1 className="page-title">Support</h1>

      <div className="search-wrap">
        <input
          className="search-input"
          placeholder="Find help"
          value={search}
          onChange={e => { setSearch(e.target.value); setOpenId(null); }}
        />
      </div>

      <div className="accordion-list">
        {filtered.length > 0 ? (
          filtered.map(item => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))
        ) : (
          <p style={{ color: "#8f98a0" }}>Nothing found</p>
        )}
      </div>

      <Pagination current={page} onChange={setPage} />

      <div className="cta-block">
        <h2 className="cta-title">Have any other questions?</h2>
        <button className="cta-btn">Contact us on our email!</button>
      </div>
    </div>
  );
}