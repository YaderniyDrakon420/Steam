import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import { AuthContext } from "../context/AuthContext"; 

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Arial&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1b2838;
    position: relative;
    overflow: hidden;
  }
  .bg {
    position: fixed;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 3px;
    opacity: 0.3;
    pointer-events: none;
  }
  .bg-tile { border-radius: 3px; }
  .bg-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
  }
  .card {
    position: relative;
    z-index: 2;
    background: rgba(22, 32, 45, 0.95);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 4px;
    padding: 32px 36px;
    width: 100%;
    max-width: 430px;
  }
  h1 { color: #fff; font-size: 22px; margin-bottom: 22px; }
  label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #8f98a0;
    margin-bottom: 5px;
  }
  input {
    width: 100%;
    background: #316282;
    border: 1px solid #316282;
    border-radius: 3px;
    padding: 9px 10px;
    color: #c6d4df;
    font-size: 13px;
    outline: none;
    margin-bottom: 12px;
  }
  input:focus { border-color: #66c0f4; }
  input.err { border-color: #e84040; background: #3a1e1e; }
  .err-text { font-size: 11px; color: #e84040; margin: -8px 0 10px; display: block; }
  .btn-green {
    width: 100%;
    background: linear-gradient(to bottom, #75b022, #588a1b);
    color: #d2e885;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    border: none;
    border-radius: 3px;
    padding: 11px;
    cursor: pointer;
  }
  .btn-gray {
    background: linear-gradient(to bottom, #4b5b6e, #394856);
    color: #c6d4df;
    font-size: 12px;
    border: none;
    border-radius: 3px;
    padding: 10px 14px;
    cursor: pointer;
  }
  .link { color: #66c0f4; cursor: pointer; text-decoration: none; font-size: 12px; }
  .sub-text { font-size: 11px; color: #8f98a0; line-height: 1.4; }
  .qr-box {
    width: 80px;
    height: 80px;
    background: white;
    padding: 4px;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
  }
`;

const API_URL = "https://localhost:7190/api/auth";

type ScreenType = "login" | "register" | "success";
interface PageProps {
  go: (screen: ScreenType) => void;
}

interface LoginErrors { name?: string; pass?: string; }
interface RegisterErrors { email?: string; nickname?: string; pass?: string; agreed?: string; }

function Bg() {
  const TILES = ["#1a3a5c", "#2d4a1e", "#4a1a2d", "#1a4a3a", "#3a2d1a", "#4a3a1a", "#2d1a4a"];
  return (
    <>
      <div className="bg">
        {[...Array(35)].map((_, i) => <div key={i} className="bg-tile" style={{ background: TILES[i % 7] }} />)}
      </div>
      <div className="bg-overlay" />
    </>
  );
}

// ===== ВХОД =====
function LoginPage({ go }: PageProps) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [errs, setErrs] = useState<LoginErrors>({});
  
  const auth = useContext(AuthContext); 
  const navigate = useNavigate(); 

  const submit = async () => {
    const e: LoginErrors = {};
    if (!name.trim()) e.name = "Введи имя аккаунта";
    if (!pass.trim()) e.pass = "Введи пароль";
    if (Object.keys(e).length) return setErrs(e);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: name, password: pass }),
      });

      if (response.ok) {
        const userData = await response.json(); // Ждем JSON от твоего C# бэкенда
        
        // ВАЖНО: передаем id в функцию login
        // Если твой C# отдает Id с большой буквы, пиши userData.Id
        auth?.login(userData.id); 
        
        navigate("/profile"); 
      } else {
        alert("Неверный логин или пароль");
      }
    } catch (err) {
      alert("Ошибка подключения к серверу. Проверь, запущен ли бэкенд!");
    }
  };

  return (
    <div className="page">
      <Bg />
      <div className="card">
        <h1>Log in</h1>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <label>Account Name</label>
            <input className={errs.name ? "err" : ""} value={name} onChange={e => setName(e.target.value)} />
            {errs.name && <span className="err-text">{errs.name}</span>}

            <label>Password</label>
            <input type="password" className={errs.pass ? "err" : ""} value={pass} onChange={e => setPass(e.target.value)} />
            {errs.pass && <span className="err-text">{errs.pass}</span>}

            <button className="btn-green" onClick={submit}>Sign in</button>
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <span className="sub-text">No account? </span>
              <a className="link" onClick={() => go("register")}>Create a new one!</a>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div className="qr-box">
              {[...Array(49)].map((_, i) => <div key={i} style={{ background: Math.random() > 0.5 ? "#000" : "#fff" }} />)}
            </div>
            <span className="sub-text" style={{ fontSize: 9 }}>QR Code</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== РЕГИСТРАЦИЯ =====
function RegisterPage({ go }: PageProps) {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [pass, setPass] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errs, setErrs] = useState<RegisterErrors>({});

  const submit = async () => {
    const e: RegisterErrors = {};
    if (!email.includes("@")) e.email = "Некорректный email";
    if (!nickname.trim()) e.nickname = "Введите никнейм";
    if (pass.length < 6) e.pass = "Пароль слишком короткий";
    if (!agreed) e.agreed = "Нужно согласие";
    if (Object.keys(e).length) return setErrs(e);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname,
          email: email,
          passwordHash: pass
        }),
      });

      if (response.ok) go("success");
      else {
        const errorData = await response.json();
        alert(errorData.message || "Ошибка регистрации");
      }
    } catch (err) {
      alert("Ошибка сети");
    }
  };

  return (
    <div className="page">
      <Bg />
      <div className="card">
        <h1 style={{ textAlign: "center" }}>Create Account</h1>
        <label>Email</label>
        <input className={errs.email ? "err" : ""} value={email} onChange={e => setEmail(e.target.value)} />
        {errs.email && <span className="err-text">{errs.email}</span>}

        <label>Nickname</label>
        <input className={errs.nickname ? "err" : ""} value={nickname} onChange={e => setNickname(e.target.value)} />
        {errs.nickname && <span className="err-text">{errs.nickname}</span>}

        <label>Password</label>
        <input type="password" className={errs.pass ? "err" : ""} value={pass} onChange={e => setPass(e.target.value)} />
        {errs.pass && <span className="err-text">{errs.pass}</span>}

        <div style={{ display: "flex", gap: 8, marginBottom: 15 }}>
          <input type="checkbox" style={{ width: "auto" }} checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          <span className="sub-text">I agree to terms</span>
        </div>
        {errs.agreed && <span className="err-text">{errs.agreed}</span>}

        <button className="btn-green" onClick={submit}>Continue</button>
        <button className="btn-gray" style={{ width: "100%", marginTop: 8 }} onClick={() => go("login")}>Back</button>
      </div>
    </div>
  );
}

function SuccessPage({ go }: PageProps) {
  return (
    <div className="page"><Bg />
      <div className="card" style={{ textAlign: "center" }}>
        <h1>Done! ✅</h1>
        <button className="btn-green" onClick={() => go("login")}>Log in now</button>
      </div>
    </div>
  );
}

export default function SteamAuth() {
  const [screen, setScreen] = useState<ScreenType>("login");
  return (
    <>
      <style>{css}</style>
      {screen === "login" && <LoginPage go={setScreen} />}
      {screen === "register" && <RegisterPage go={setScreen} />}
      {screen === "success" && <SuccessPage go={setScreen} />}
    </>
  );
}