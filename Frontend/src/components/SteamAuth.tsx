import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Headphones, ArrowLeft, Check, QrCode } from "lucide-react";
import { AuthContext } from "../context/AuthContext"; 

// Хелпер генерации токена для QR
export function generateToken() {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
}

const API_URL = "https://localhost:7190/api/auth";

type ScreenType = "login" | "register" | "success";

interface LoginErrors { name?: string; pass?: string; }
interface RegisterErrors { email?: string; nickname?: string; pass?: string; agreed?: string; }

// ===== КЛАССИЧЕСКИЕ СТИЛИ STEAM ДЛЯ СТОПРОЦЕНТНОГО ОТОБРАЖЕНИЯ =====
const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Arial&display=swap');
  
  .auth-page-wrapper {
    font-family: 'Arial', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
  }
  .auth-page-wrapper * { box-sizing: border-box; margin: 0; padding: 0; }

  /* Размытый задний фон */
  .blur-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1920&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    filter: blur(8px);
    transform: scale(1.1);
    z-index: 1;
  }
  .bg-dark-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    z-index: 2;
  }

  /* Сетка из игр на фоне */
  .games-grid-bg {
    position: absolute;
    inset: 0;
    opacity: 0.15;
    pointer-events: none;
    z-index: 3;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    padding: 40px;
    transform: rotate(-7deg) scale(1.25);
  }
  .bg-game-img {
    width: 100%;
    height: 144px;
    object-fit: cover;
    border-radius: 16px;
  }

  /* Основной контейнер */
  .auth-content-container {
    position: relative;
    z-index: 10;
    display: flex;
    gap: 24px;
    align-items: flex-start;
    max-width: 90%;
  }

  /* Главная карточка */
  .auth-card {
    width: 470px;
    background: rgba(23, 28, 37, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 32px;
    shadow: 0 0 60px rgba(0,0,0,0.7);
  }

  .auth-card h1 {
    color: #fff;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 24px;
  }

  /* Поля ввода и лейблы */
  .auth-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #8f98a0;
    margin-bottom: 6px;
    margin-top: 12px;
  }
  .auth-input {
    width: 100%;
    height: 48px;
    background: #2a3140;
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 0 16px;
    color: #fff;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, background-color 0.2s;
  }
  .auth-input:focus {
    border-color: #66c0f4;
  }
  .auth-input.err-field {
    border-color: #e84040;
    background: #3a1e1e;
  }
  .error-message {
    font-size: 12px;
    color: #e84040;
    margin-top: 4px;
    display: block;
  }

  /* Капча */
  .captcha-box {
    width: 180px;
    height: 64px;
    background: #fff;
    border-radius: 8px;
    margin: 16px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    cursor: pointer;
    user-select: none;
  }
  .captcha-check-square {
    width: 20px;
    height: 20px;
    border: 1px solid #999;
    background: #f9f9f9;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .captcha-text {
    color: #000;
    font-size: 13px;
    font-weight: 600;
    margin-left: 8px;
  }

  /* Кнопки */
  .flex-buttons-row {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    margin-top: 16px;
  }
  .btn-steam-green {
    flex: 1;
    height: 48px;
    background: linear-gradient(to bottom, #75b022, #588a1b);
    color: #d2e885;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .btn-steam-green:hover { brightness: 1.1; }
  
  .btn-qr-toggle {
    height: 48px;
    padding: 0 16px;
    background: #2a3140;
    color: #fff;
    border: none;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
  }
  .btn-qr-toggle.active {
    background: #a3e635;
    color: #000;
  }

  .btn-steam-gray {
    width: 100%;
    height: 48px;
    background: #2a3140;
    color: #d1d5db;
    border: none;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
  }
  .btn-back-arrow {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
  }
  .btn-back-arrow:hover { color: #fff; }

  /* Ссылка переключения */
  .switch-mode-text {
    text-align: center;
    color: #9ca3af;
    margin-top: 20px;
    font-size: 14px;
  }
  .switch-mode-link {
    background: none;
    border: none;
    color: #a3e635;
    cursor: pointer;
    font-size: 14px;
    text-decoration: none;
    margin-left: 4px;
  }
  .switch-mode-link:hover { text-decoration: underline; }

  /* Чекбокс согласия */
  .agreement-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 16px 0;
    color: #d1d5db;
    font-size: 13px;
  }
  .agreement-row input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  /* Окно QR-кода справа */
  .qr-side-card {
    width: 280px;
    background: rgba(23, 28, 37, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 24px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .qr-side-card h2 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .qr-image-wrapper {
    background: #fff;
    padding: 12px;
    border-radius: 16px;
    display: block;
  }
  .qr-image-wrapper img {
    width: 180px;
    height: 180px;
    display: block;
  }
  .qr-info-block {
    margin-top: 16px;
    text-align: center;
    font-size: 12px;
    color: #9ca3af;
    background: rgba(0,0,0,0.3);
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.05);
  }
  .qr-token-text {
    font-family: monospace;
    color: #a3e635;
    display: block;
    margin-bottom: 4px;
  }
`;

export default function SteamAuth() {
  const [screen, setScreen] = useState<ScreenType>("login");

  // Поля авторизации
  const [name, setName] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErrs, setLoginErrs] = useState<LoginErrors>({});

  // Поля регистрации
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [regPass, setRegPass] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [regErrs, setRegErrs] = useState<RegisterErrors>({});

  // Капчи
  const [captchaLogin, setCaptchaLogin] = useState(false);
  const [captchaRegister, setCaptchaRegister] = useState(false);

  // QR-код
  const [showQR, setShowQR] = useState(false);
  const [qrToken, setQrToken] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const gameImages = [
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/header.jpg",
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/header.jpg",
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172470/header.jpg",
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg",
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/header.jpg",
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/440/header.jpg",
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/header.jpg",
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg"
  ];

  const generateQR = () => {
    const token = generateToken();
    setQrToken(token);
    setSecondsLeft(60);
  };

  useEffect(() => {
    if (!showQR) return;
    generateQR();
    const interval = setInterval(() => generateQR(), 60000);
    return () => clearInterval(interval);
  }, [showQR]);

  useEffect(() => {
    if (!showQR) return;
    const timer = setInterval(() => {
      setSecondsLeft(s => (s > 0 ? s - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, [showQR]);

  const qrUrl = qrToken
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrToken}`
    : "";

  // Клик по логину
  const handleLoginSubmit = async () => {
    const e: LoginErrors = {};
    if (!name.trim()) e.name = "Введи имя аккаунта";
    if (!loginPass.trim()) e.pass = "Введи пароль";
    if (Object.keys(e).length) return setLoginErrs(e);
    setLoginErrs({});

    if (!captchaLogin) {
      alert("Пожалуйста, пройдите проверку (капчу) для входа.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: name, password: loginPass }),
      });

      if (response.ok) {
        const userData = await response.json();
        auth?.login(userData.id || userData.Id); 
        navigate("/profile"); 
      } else {
        alert("Неверный логин или пароль");
      }
    } catch (err) {
      alert("Ошибка подключения к серверу. Проверь C# бэкенд!");
    }
  };

  // Клик по регистрации
  const handleRegisterSubmit = async () => {
    const e: RegisterErrors = {};
    if (!email.includes("@")) e.email = "Некорректный email";
    if (!nickname.trim()) e.nickname = "Введите никнейм";
    if (regPass.length < 6) e.pass = "Пароль слишком короткий (минимум 6 знаков)";
    if (!agreed) e.agreed = "Требуется согласие с правилами";
    if (Object.keys(e).length) return setRegErrs(e);
    setRegErrs({});

    if (!captchaRegister) {
      alert("Подтвердите, что вы человек.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname,
          email: email,
          passwordHash: regPass
        }),
      });

      if (response.ok) {
        setScreen("success");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Ошибка регистрации");
      }
    } catch (err) {
      alert("Сеть недоступна.");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <style>{cssStyles}</style>

      {/* Слои бэкграунда */}
      <div className="blur-bg" />
      <div className="bg-dark-overlay" />

      <div className="games-grid-bg">
        {gameImages.map((img, i) => (
          <img key={i} src={img} className="bg-game-img" alt="game preview" />
        ))}
      </div>

      {/* Контент */}
      <div className="auth-content-container">
        <div className="auth-card">
          
          {/* СТРАНИЦА ВХОДА */}
          {screen === "login" && (
            <>
              <h1>Log in</h1>

              <label className="auth-label">Account Name</label>
              <input
                className={`auth-input ${loginErrs.name ? "err-field" : ""}`}
                placeholder="Username"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              {loginErrs.name && <span className="error-message">{loginErrs.name}</span>}

              <label className="auth-label">Password</label>
              <input
                className={`auth-input ${loginErrs.pass ? "err-field" : ""}`}
                placeholder="Password"
                type="password"
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
              />
              {loginErrs.pass && <span className="error-message">{loginErrs.pass}</span>}

              {/* Капча логина */}
              <div className="captcha-box" onClick={() => setCaptchaLogin(p => !p)}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="captcha-check-square">
                    {captchaLogin && <Check size={14} style={{ color: "#000", strokeWidth: 3 }} />}
                  </div>
                  <span className="captcha-text">Verify login</span>
                </div>
                <ShieldCheck style={{ color: "#555" }} />
              </div>

              <div className="flex-buttons-row">
                <button className="btn-steam-green" onClick={handleLoginSubmit}>
                  Sign In
                </button>
                <button 
                  className={`btn-qr-toggle ${showQR ? "active" : ""}`} 
                  onClick={() => setShowQR(p => !p)}
                >
                  <QrCode size={18} /> QR
                </button>
              </div>

              <button className="btn-steam-gray">
                <Headphones size={18} /> Contact support
              </button>

              <p className="switch-mode-text">
                No account? 
                <button className="switch-mode-link" onClick={() => { setScreen("register"); setLoginErrs({}); }}>
                  Create one
                </button>
              </p>
            </>
          )}

          {/* СТРАНИЦА РЕГИСТРАЦИИ */}
          {screen === "register" && (
            <>
              <button className="btn-back-arrow" onClick={() => { setScreen("login"); setRegErrs({}); }}>
                <ArrowLeft size={22} />
              </button>

              <h1>Create account</h1>

              <label className="auth-label">Email</label>
              <input
                className={`auth-input ${regErrs.email ? "err-field" : ""}`}
                placeholder="example@mail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              {regErrs.email && <span className="error-message">{regErrs.email}</span>}

              <label className="auth-label">Nickname</label>
              <input
                className={`auth-input ${regErrs.nickname ? "err-field" : ""}`}
                placeholder="YourNickname"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
              />
              {regErrs.nickname && <span className="error-message">{regErrs.nickname}</span>}

              <label className="auth-label">Password</label>
              <input
                className={`auth-input ${regErrs.pass ? "err-field" : ""}`}
                placeholder="Min. 6 characters"
                type="password"
                value={regPass}
                onChange={e => setRegPass(e.target.value)}
              />
              {regErrs.pass && <span className="error-message">{regErrs.pass}</span>}

              {/* Чекбокс */}
              <div className="agreement-row">
                <input
                  type="checkbox"
                  id="agree-checkbox-steam"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                />
                <label htmlFor="agree-checkbox-steam" style={{ color: "inherit", fontSize: "inherit", textTransform: "none", letterSpacing: "normal", display: "inline", fontWeight: "normal" }}>
                  I confirm that I am older than 13 years old
                </label>
              </div>
              {regErrs.agreed && <span className="error-message" style={{ marginBottom: '10px', display: 'block' }}>{regErrs.agreed}</span>}

              {/* Капча регистрации */}
              <div className="captcha-box" onClick={() => setCaptchaRegister(p => !p)}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="captcha-check-square">
                    {captchaRegister && <Check size={14} style={{ color: "#000", strokeWidth: 3 }} />}
                  </div>
                  <span className="captcha-text">I'm human</span>
                </div>
                <ShieldCheck style={{ color: "#555" }} />
              </div>

              <button className="btn-steam-green" style={{ width: "100%" }} onClick={handleRegisterSubmit}>
                Continue
              </button>

              <p className="switch-mode-text">
                Already have account? 
                <button className="switch-mode-link" onClick={() => { setScreen("login"); setRegErrs({}); }}>
                  Login
                </button>
              </p>
            </>
          )}

          {/* СТРАНИЦА УСПЕХА */}
          {screen === "success" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <h1>Done! ✅</h1>
              <p style={{ color: "#8f98a0", fontSize: "14px", marginBottom: "24px" }}>
                Регистрация завершена! Перейдите на экран входа.
              </p>
              <button className="btn-steam-green" style={{ width: "100%" }} onClick={() => setScreen("login")}>
                Log in now
              </button>
            </div>
          )}
        </div>

        {/* ПЛАШКА QR-КОДА */}
        {showQR && screen === "login" && (
          <div className="qr-side-card">
            <h2>QR Login</h2>
            <div className="qr-image-wrapper">
              <img src={qrUrl} alt="steam qr auth" />
            </div>
            <div className="qr-info-block">
              <span className="qr-token-text">Token: {qrToken}</span>
              Refresh in <b>{secondsLeft}s</b>
            </div>
            <button className="btn-steam-gray" style={{ marginTop: "16px", height: "40px" }} onClick={() => setShowQR(false)}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}