import { useState } from "react";

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

  /* фон — цветные плитки как обложки игр */
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

  /* карточка по центру */
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

  @media (max-width: 500px) {
    .card { margin: 12px; padding: 24px 18px; }
    .login-row { flex-direction: column !important; }
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

  input[type="text"],
  input[type="email"],
  input[type="password"] {
    width: 100%;
    background: #316282;
    border: 1px solid #316282;
    border-radius: 3px;
    padding: 9px 10px;
    color: #c6d4df;
    font-size: 13px;
    outline: none;
    margin-bottom: 12px;
    transition: border-color 0.2s;
  }
  input:focus { border-color: #66c0f4; }
  input.err { border-color: #e84040; background: #3a1e1e; }

  .err-text { font-size: 11px; color: #e84040; margin: -8px 0 10px; display: block; }

  /* зелёная кнопка */
  .btn-green {
    width: 100%;
    background: linear-gradient(to bottom, #75b022, #588a1b);
    color: #d2e885;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    border: none;
    border-radius: 3px;
    padding: 11px;
    cursor: pointer;
  }
  .btn-green:hover { filter: brightness(1.1); }

  /* серая кнопка */
  .btn-gray {
    background: linear-gradient(to bottom, #4b5b6e, #394856);
    color: #c6d4df;
    font-size: 12px;
    border: none;
    border-radius: 3px;
    padding: 10px 14px;
    cursor: pointer;
    white-space: nowrap;
  }
  .btn-gray:hover { filter: brightness(1.1); }

  .link { color: #66c0f4; cursor: pointer; text-decoration: none; font-size: 12px; }
  .link:hover { text-decoration: underline; }

  .sub-text { font-size: 11px; color: #8f98a0; line-height: 1.4; }

  /* чекбокс соглашения */
  .check-row {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    margin-bottom: 16px;
  }
  .check-row input { margin-top: 2px; accent-color: #5c7e10; flex-shrink: 0; }

  /* qr блок */
  .qr-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-width: 110px;
  }
  .qr-box {
    width: 80px;
    height: 80px;
    background: white;
    border-radius: 3px;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(7, 1fr);
    gap: 1px;
    padding: 4px;
    overflow: hidden;
  }
  .qr-cell { border-radius: 1px; }

  .back-btn {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 10;
    background: none;
    border: none;
    color: #c6d4df;
    font-size: 24px;
    cursor: pointer;
  }
`;

// плитки фона
const TILES = [
  "#1a3a5c","#2d4a1e","#4a1a2d","#1a4a3a","#3a2d1a","#4a3a1a","#2d1a4a",
  "#1a4a1a","#4a1a1a","#3a1a3a","#2a3a4a","#4a2a1a","#1a3a2a","#3a4a1a",
  "#2a1a3a","#4a2a3a","#3a1a2a","#2a4a2a","#1a3a3a","#4a3a2a","#2a2a4a",
  "#1a2a4a","#3a2a1a","#4a1a4a","#1a4a2a","#2a3a1a","#4a2a2a","#1a2a3a",
  "#3a4a2a","#2a4a3a","#4a4a1a","#1a1a3a","#3a3a4a","#2a1a4a","#4a3a3a",
];

// простой qr паттерн для макета
const QR = [1,0,1,0,1,1,0, 1,1,0,1,0,1,1, 0,1,1,0,0,1,0,
            1,0,1,1,1,0,1, 0,1,0,1,0,1,0, 1,1,1,0,1,0,1, 0,0,1,1,0,1,1];

function Bg() {
  return (
    <>
      <div className="bg">
        {TILES.map((c, i) => <div key={i} className="bg-tile" style={{ background: c }} />)}
      </div>
      <div className="bg-overlay" />
    </>
  );
}

// ===== ВХОД =====
function LoginPage({ go }) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [errs, setErrs] = useState({});

  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = "Введи имя аккаунта";
    if (!pass.trim()) e.pass = "Введи пароль";
    if (Object.keys(e).length) return setErrs(e);

    // TODO: запрос на логин
    // await api.post('/auth/login', { name, pass })
    alert("Подключи API!");
  };

  return (
    <div className="page">
      <Bg />
      <div className="card">
        <h1>Log in</h1>
        <div className="login-row" style={{ display: "flex", gap: 20 }}>

          <div style={{ flex: 1 }}>
            <label>Sign in with account name</label>
            <input type="text" className={errs.name ? "err" : ""} value={name}
              onChange={e => { setName(e.target.value); setErrs(p => ({...p, name: ""})); }} />
            {errs.name && <span className="err-text">{errs.name}</span>}

            <label>Password</label>
            <input type="password" className={errs.pass ? "err" : ""} value={pass}
              onChange={e => { setPass(e.target.value); setErrs(p => ({...p, pass: ""})); }} />
            {errs.pass && <span className="err-text">{errs.pass}</span>}

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button className="btn-green" style={{ flex: 1 }} onClick={submit}>Sign in</button>
              <button className="btn-gray">Help, I can't log in</button>
            </div>

            <div style={{ textAlign: "center" }}>
              <span className="sub-text">No account? </span>
              <a className="link" onClick={() => go("register")}>Create a new one!</a>
            </div>
          </div>

          {/* QR — замени на qrcode.react если нужен настоящий */}
          <div className="qr-block">
            <a className="link" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Sign in with QRcode
            </a>
            <div className="qr-box">
              {QR.map((v, i) => <div key={i} className="qr-cell" style={{ background: v ? "#000" : "#fff" }} />)}
            </div>
            <span className="sub-text" style={{ textAlign: "center", fontSize: 10 }}>
              Сканируй приложением чтобы войти
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== РЕГИСТРАЦИЯ =====
function RegisterPage({ go }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errs, setErrs] = useState({});

  const submit = () => {
    const e = {};
    if (!email.includes("@")) e.email = "Введи нормальный email";
    if (pass.length < 6) e.pass = "Минимум 6 символов";
    if (!agreed) e.agreed = "Нужно согласиться с условиями";
    if (Object.keys(e).length) return setErrs(e);

    // TODO: запрос на регистрацию
    // await api.post('/auth/register', { email, pass })
    go("success");
  };

  return (
    <div className="page">
      <Bg />
      <button className="back-btn" onClick={() => go("login")}>‹</button>
      <div className="card">
        <h1 style={{ textAlign: "center" }}>Create an account</h1>

        <label>Put your email here</label>
        <input type="email" className={errs.email ? "err" : ""} value={email}
          onChange={e => { setEmail(e.target.value); setErrs(p => ({...p, email: ""})); }} />
        {errs.email && <span className="err-text">{errs.email}</span>}

        <label>Create a password</label>
        <input type="password" className={errs.pass ? "err" : ""} value={pass}
          onChange={e => { setPass(e.target.value); setErrs(p => ({...p, pass: ""})); }} />
        {errs.pass && <span className="err-text">{errs.pass}</span>}

        <div className="check-row">
          <input type="checkbox" checked={agreed}
            onChange={e => { setAgreed(e.target.checked); setErrs(p => ({...p, agreed: ""})); }} />
          <span className="sub-text">
            Мне 13+ лет, согласен с <a className="link">Steam Subscriber Agreement</a> и <a className="link">Valve Privacy Policy</a>
          </span>
        </div>
        {errs.agreed && <span className="err-text">{errs.agreed}</span>}

        <button className="btn-green" onClick={submit}>Sign in</button>
      </div>
    </div>
  );
}

// ===== АККАУНТ СОЗДАН =====
function SuccessPage({ go }) {
  return (
    <div className="page">
      <Bg />
      <button className="back-btn" onClick={() => go("login")}>‹</button>
      <div className="card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h1 style={{ marginBottom: 8 }}>Account created!</h1>
        <p className="sub-text" style={{ marginBottom: 28 }}>An email has been sent to you.</p>
        <button className="btn-green" onClick={() => go("login")}>Log in</button>
      </div>
    </div>
  );
}

// ===== ГЛАВНЫЙ КОМПОНЕНТ =====
// go() меняет экран — если есть react-router, замени на navigate()
export default function SteamAuth() {
  const [screen, setScreen] = useState("login");

  return (
    <>
      <style>{css}</style>
      {screen === "login"    && <LoginPage    go={setScreen} />}
      {screen === "register" && <RegisterPage go={setScreen} />}
      {screen === "success"  && <SuccessPage  go={setScreen} />}
    </>
  );
}
