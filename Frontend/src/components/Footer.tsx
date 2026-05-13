import { FaFacebook, FaTwitter, FaYoutube, FaChevronUp } from "react-icons/fa";

const footerStyles = `
  .main-footer {
    background: #2a2d33;
    color: #8f98a0;
    padding: 40px 0 60px 0;
    font-family: "Motiva Sans", Arial, Helvetica, sans-serif;
    font-size: 12px;
    margin-top: 50px;
  }

  .footer-container {
    max-width: 940px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
  }

  .footer-socials {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 25px;
  }

  .footer-social-link {
    color: #fff;
    font-size: 24px;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .footer-social-link:hover {
    opacity: 1;
  }

  .footer-text {
    text-align: center;
    line-height: 1.6;
    margin-bottom: 25px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .footer-links {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 20px;
  }

  .footer-link {
    color: #fff;
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-link:hover {
    color: #66c0f4;
  }

  .valve-logo-wrap {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .btn-scroll-top {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 3px;
  }

  .valve-logo {
    opacity: 0.5;
    width: 35px;
    filter: invert(1);
  }
`;

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>{footerStyles}</style>
      <footer className="main-footer">
        <div className="footer-container">
          {/* Иконки соцсетей с твоими ссылками */}
          <div className="footer-socials">
            <a href="https://www.facebook.com/Steam" target="_blank" rel="noreferrer" className="footer-social-link">
              <FaFacebook />
            </a>
            <a href="https://twitter.com/Steam" target="_blank" rel="noreferrer" className="footer-social-link">
              <FaTwitter />
            </a>
            <a href="https://www.youtube.com/@Steam" target="_blank" rel="noreferrer" className="footer-social-link">
              <FaYoutube />
            </a>
          </div>

          <div className="footer-text">
            © 2026 Valve Corporation. All rights reserved. All trademarks are property of their respective owners in the US and other countries.
            <br />
            VAT included in all prices where applicable.
          </div>

          <div className="footer-links">
            <a href="#" className="footer-link">Terms of service</a>
            <a href="#" className="footer-link">Jobs</a>
            <a href="#" className="footer-link">Rules</a>
            <a href="#" className="footer-link">Contracts</a>
            <a href="#" className="footer-link">Gift cards</a>
            <a href="#" className="footer-link">Facebook</a>
            <a href="#" className="footer-link">Twitter</a>
          </div>

          {/* Правая часть: кнопка вверх и логотип Valve */}
          <div className="valve-logo-wrap">
            <button className="btn-scroll-top" onClick={scrollToTop}>
              <FaChevronUp />
            </button>
            <img 
              src="https://store.cloudflare.steamstatic.com/public/images/footerLogo_valve_new.png" 
              alt="Valve" 
              className="valve-logo" 
            />
          </div>
        </div>
      </footer>
    </>
  );
}