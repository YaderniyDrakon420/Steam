import React, { useState, useEffect } from "react";

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
  .nav-icons span { cursor: pointer; transition: color 0.2s; }
  .nav-icons span:hover { color: #fff; }
  .nav-download { background: linear-gradient(to bottom, #75b022, #588a1b); color: #d2e885; font-size: 12px; font-weight: 700; border: none; border-radius: 3px; padding: 7px 14px; cursor: pointer; }
  @media (max-width: 600px) { .nav-links { display: none; } }

  .content { max-width: 860px; margin: 0 auto; padding: 30px 20px 60px; width: 100%; }

  .cart-section, .wishlist-section, .payment-section, .thankyou-section {
    background: #16202d;
    border-radius: 8px;
    padding: 24px;
  }
  .cart-title, .wishlist-title, .payment-title, .thankyou-title {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 24px;
    padding-left: 12px;
  }
  .cart-item, .wishlist-item {
    display: flex;
    gap: 20px;
    padding: 20px 0;
    border-bottom: 1px solid #2a3f55;
  }
  .item-image {
    width: 120px;
    height: 120px;
    background: #1e2a36;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5a6a7a;
    font-size: 12px;
    flex-shrink: 0;
    overflow: hidden;
  }
  .item-image img { width: 100%; height: 100%; object-fit: cover; }
  .item-info { flex: 1; }
  .item-title { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .item-reviews { font-size: 12px; color: #8f98a0; margin-bottom: 8px; }
  .item-reviews span { color: #66c0f4; }
  .item-date { font-size: 12px; color: #8f98a0; margin-bottom: 12px; }
  .item-actions { display: flex; gap: 16px; }
  .item-action { font-size: 12px; color: #8f98a0; background: none; border: none; cursor: pointer; transition: color 0.2s; }
  .item-action:hover { color: #66c0f4; }
  .item-price { font-size: 18px; font-weight: 700; color: #fff; text-align: right; min-width: 100px; }
  .cart-total { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; margin-top: 10px; }
  .checkout-btn, .place-order-btn {
    background: linear-gradient(to bottom, #75b022, #588a1b);
    color: #d2e885;
    font-size: 16px;
    font-weight: 700;
    border: none;
    border-radius: 4px;
    padding: 12px 32px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
  }
  .empty-message { text-align: center; padding: 60px 20px; color: #8f98a0; font-size: 16px; }

  .payment-methods { display: flex; gap: 20px; margin-bottom: 24px; }
  .payment-method {
    display: flex; align-items: center; gap: 8px; cursor: pointer;
    background: #1e2a36; padding: 8px 16px; border-radius: 8px; transition: background 0.2s;
  }
  .payment-method.selected { background: #2a4a6a; outline: 1px solid #66c0f4; }
  .payment-method img { width: 40px; height: auto; }
  .card-details { background: #1e2a36; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
  .card-row { margin-bottom: 16px; }
  .card-row label { display: block; font-size: 12px; color: #8f98a0; margin-bottom: 4px; }
  .card-row input {
    width: 100%; background: #2a3f55; border: 1px solid #3a5a7a;
    border-radius: 4px; padding: 10px; color: #c6d4df; font-size: 14px; outline: none;
  }
  .card-row input:focus { border-color: #66c0f4; }
  .row-2cols { display: flex; gap: 16px; }
  .row-2cols > div { flex: 1; }
  .save-checkbox { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; font-size: 13px; }
  .order-summary { background: #1e2a36; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
  .summary-line { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
  .summary-total {
    display: flex; justify-content: space-between; font-weight: 700; font-size: 18px;
    margin-top: 12px; padding-top: 12px; border-top: 1px solid #3a5a7a;
  }
  .legal-text { font-size: 11px; color: #8f98a0; margin: 16px 0; line-height: 1.4; }
  .thankyou-message { text-align: center; padding: 40px 20px; }
  .thankyou-message h2 { color: #fff; margin-bottom: 16px; }
  .thankyou-message p { margin-bottom: 12px; }
`;

// ==================== ИНТЕРФЕЙСЫ ====================
interface Game {
  id: number;
  title: string;
  reviews: string;
  releaseDate: string;
  price: number;
  image: string | null;
}

const API_BASE_URL = "https://localhost:7190/api"; // ЗАМІНИ НА СВІЙ ПОРТ
const getUserId = () => {
  const savedId = localStorage.getItem("userId");
  return savedId ? parseInt(savedId) : 5; // Повертає 5 за замовчуванням, якщо ніхто не "увійшов"
};

// ==================== СТРАНИЦА "СПАСИБО" ====================
interface ThankYouProps { onBrowseShop: () => void; }
const ThankYouPage: React.FC<ThankYouProps> = ({ onBrowseShop }) => {
  return (
    <div className="thankyou-section">
      <h1 className="thankyou-title">Order Complete</h1>
      <div className="thankyou-message">
        <h2>Thank you for buying our games!</h2>
        <p>An email receipt has been sent to you.</p>
        <p>If there is anything else you need, feel free to browse our shop!</p>
        <button onClick={onBrowseShop} style={{ marginTop: 20, background: "#66c0f4", border: "none", padding: "8px 20px", borderRadius: 4, color: "#1b2838", cursor: "pointer" }}>Browse Shop</button>
      </div>
    </div>
  );
};

// ==================== КОМПОНЕНТ ОПЛАТЫ ====================
interface PaymentProps {
  cartItems: Game[];
  onPlaceOrder: () => void;
  onBackToCart: () => void;
}

const PaymentPage: React.FC<PaymentProps> = ({ cartItems, onPlaceOrder, onBackToCart }) => {
  const [selectedMethod, setSelectedMethod] = useState("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const subtotal = cartItems.reduce((sum: number, item: Game) => sum + item.price, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  // --- МАСКИ ВВОДУ ---

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Тільки цифри
    if (value.length > 16) value = value.slice(0, 16);
    // Додаємо пробіли кожні 4 цифри
    const formatted = value.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted);
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Тільки цифри
    if (value.length > 4) value = value.slice(0, 4);
    
    if (value.length >= 3) {
      setExpiration(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiration(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z\s]/g, "");
    setNameOnCard(value);
  };

  // --- ВАЛІДАЦІЯ ---

  const validate = () => {
    let e: { [key: string]: string } = {};

    // Валідація номера (Алгоритм Луна тут не додаємо для простоти, але довжину перевіряємо суворо)
    const rawCard = cardNumber.replace(/\s/g, "");
    if (rawCard.length !== 16) {
      e.cardNumber = "Card number must be 16 digits";
    }

    // Валідація імені
    if (nameOnCard.trim().length < 3) {
      e.nameOnCard = "Full name is required (min 3 chars)";
    }

    // Валідація дати (Термін дії)
    if (!/^\d{2}\/\d{2}$/.test(expiration)) {
      e.expiration = "Format MM/YY";
    } else {
      const [month, year] = expiration.split("/").map(Number);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = parseInt(now.getFullYear().toString().slice(-2));

      if (month < 1 || month > 12) {
        e.expiration = "Invalid month";
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        e.expiration = "Card has expired";
      }
    }

    // Валідація CVV
    if (cvv.length !== 3) {
      e.cvv = "3 digits required";
    }

    // Згода з правилами
    if (!agreeTerms) {
      e.agreeTerms = "Required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onPlaceOrder();
    }
  };

  return (
    <div className="payment-section">
      <style>{`
        .payment-section { max-width: 500px; margin: 0 auto; color: #c6d4df; }
        .payment-title { font-size: 24px; color: #fff; margin-bottom: 20px; font-weight: bold; }
        
        .payment-methods { display: flex; gap: 10px; margin-bottom: 25px; }
        .payment-method { 
          flex: 1; background: #2a303b; padding: 12px; border-radius: 4px; 
          display: flex; align-items: center; gap: 10px; cursor: pointer;
          border: 1px solid transparent; transition: 0.2s;
        }
        .payment-method.selected { border-color: #66c0f4; background: #3d4450; }
        .payment-method img { height: 20px; }

        .card-details { background: #1b2838; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
        .card-row { margin-bottom: 15px; position: relative; }
        .card-row label { display: block; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; color: #8f98a0; }
        .card-row input { 
          width: 100%; background: #32353c; border: 1px solid #000; padding: 10px; 
          color: #fff; border-radius: 3px; outline: none; box-sizing: border-box;
        }
        .card-row input:focus { border-color: #66c0f4; }
        .row-2cols { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

        .error-text { color: #ff4d4d; font-size: 11px; margin-top: 4px; display: block; }
        .input-error { border-color: #ff4d4d !important; }

        .order-summary { background: #1b2838; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
        .summary-line { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; color: #acb2b8; }
        .summary-total { display: flex; justify-content: space-between; font-size: 18px; color: #fff; font-weight: bold; border-top: 1px solid #333; pt: 10px; margin-top: 10px; }

        .place-order-btn { 
          width: 100%; background: linear-gradient(to bottom, #75b022, #588a1b); 
          color: #fff; border: none; padding: 15px; font-weight: bold; cursor: pointer; border-radius: 3px;
        }
        .place-order-btn:hover { background: linear-gradient(to bottom, #8ed629, #6aa621); }
        
        .legal-text { margin-bottom: 20px; font-size: 13px; }
      `}</style>

      <h1 className="payment-title">CHECKOUT</h1>
      
      <div className="payment-methods">
        <div className={`payment-method ${selectedMethod === "visa" ? "selected" : ""}`} onClick={() => setSelectedMethod("visa")}>
          <img src="https://cdn.jsdelivr.net/gh/amcharts/amcharts4@4.10.26/dist/images/visa.png" alt="Visa" /> Visa
        </div>
        <div className={`payment-method ${selectedMethod === "mastercard" ? "selected" : ""}`} onClick={() => setSelectedMethod("mastercard")}>
          <img src="https://cdn.jsdelivr.net/gh/amcharts/amcharts4@4.10.26/dist/images/mastercard.png" alt="Mastercard" /> Mastercard
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-details">
          <div className="card-row">
            <label>Card number</label>
            <input 
              type="text" 
              className={errors.cardNumber ? "input-error" : ""}
              placeholder="0000 0000 0000 0000" 
              value={cardNumber} 
              onChange={handleCardNumberChange} 
            />
            {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
          </div>

          <div className="card-row">
            <label>Name on card</label>
            <input 
              type="text" 
              className={errors.nameOnCard ? "input-error" : ""}
              placeholder="IVAN IVANOV" 
              value={nameOnCard} 
              onChange={handleNameChange} 
            />
            {errors.nameOnCard && <span className="error-text">{errors.nameOnCard}</span>}
          </div>

          <div className="row-2cols">
            <div className="card-row">
              <label>Expiration (MM/YY)</label>
              <input 
                type="text" 
                className={errors.expiration ? "input-error" : ""}
                placeholder="MM/YY" 
                value={expiration} 
                onChange={handleExpirationChange} 
              />
              {errors.expiration && <span className="error-text">{errors.expiration}</span>}
            </div>
            <div className="card-row">
              <label>Security Code (CVV)</label>
              <input 
                type="password" 
                className={errors.cvv ? "input-error" : ""}
                placeholder="123" 
                value={cvv} 
                onChange={handleCvvChange} 
              />
              {errors.cvv && <span className="error-text">{errors.cvv}</span>}
            </div>
          </div>
        </div>

        <div className="order-summary">
          <h3 style={{ marginBottom: 15, fontSize: "14px", letterSpacing: "1px" }}>ORDER SUMMARY</h3>
          {cartItems.map(item => (
            <div key={item.id} className="summary-line">
              <span>{item.title}</span>
              <span>UAH {item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-line" style={{ marginTop: 10, fontSize: "12px" }}>
            <span>Estimated Tax (5%)</span>
            <span>UAH {tax.toFixed(2)}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>UAH {total.toFixed(2)}</span>
          </div>
        </div>

        <div className="legal-text">
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input 
              type="checkbox" 
              checked={agreeTerms} 
              onChange={e => setAgreeTerms(e.target.checked)} 
            /> 
            <span>I agree to the terms of the Subscriber Agreement</span>
          </label>
          {errors.agreeTerms && <span className="error-text" style={{ marginLeft: 25 }}>{errors.agreeTerms}</span>}
        </div>

        <button type="submit" className="place-order-btn">PLACE ORDER</button>
      </form>

      <button 
        onClick={onBackToCart} 
        style={{ width: "100%", marginTop: 15, background: "none", border: "none", color: "#66c0f4", cursor: "pointer", textDecoration: "underline" }}
      >
        ← Back to cart
      </button>
    </div>
  );
};

// ==================== СТРАНИЦА КОРЗИНЫ ====================
interface CartProps {
  cartItems: Game[];
  onRemoveFromCart: (id: number) => void;
  onCheckout: () => void;
}
const CartPage: React.FC<CartProps> = ({ cartItems, onRemoveFromCart, onCheckout }) => {
  const total = cartItems.reduce((sum: number, item: Game) => sum + item.price, 0);
  
  if (cartItems.length === 0) {
    return (
      <div className="cart-section">
        <h1 className="cart-title">My Cart</h1>
        <div className="empty-message">Your cart is empty</div>
      </div>
    );
  }

  return (
    <div className="cart-section">
      <h1 className="cart-title">My Cart</h1>
      {cartItems.map(item => (
        <div key={item.id} className="cart-item">
          <div className="item-image">{item.image ? <img src={item.image} alt="" /> : "Image"}</div>
          <div className="item-info">
            <div className="item-title">Base Game<br />{item.title}</div>
            <div className="item-actions">
              <button className="item-action" onClick={() => onRemoveFromCart(item.id)}>Remove</button>
            </div>
          </div>
          <div className="item-price">UAH {item.price.toFixed(2)}</div>
        </div>
      ))}
      <div className="cart-total"><span>Total:</span><span>UAH {total.toFixed(2)}</span></div>
      <button className="checkout-btn" onClick={onCheckout}>Check Out</button>
    </div>
  );
};

// ==================== ГЛАВНЫЙ КОМПОНЕНТ ====================
export default function App() {
  const [page, setPage] = useState<string>("cart");
  const [cartItems, setCartItems] = useState<Game[]>([]); // КОРЗИНА ПОРОЖНЯ ПРИ СТАРТІ
  const [isLoading, setIsLoading] = useState(true);

  // ЗАВАНТАЖЕННЯ КОРЗИНИ З БЕКЕНДУ
const fetchCart = async () => {
  try {
    const currentUserId = getUserId(); // Отримуємо ID тут
    const response = await fetch(`${API_BASE_URL}/Cart/${currentUserId}`);
    
    if (response.ok) {
      const data = await response.json();
      setCartItems(data);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchCart();
  }, []);

  // ВИДАЛЕННЯ З БЕКЕНДУ
 const removeFromCart = async (gameId: number) => {
  try {
    const currentUserId = getUserId(); // І тут теж
    const response = await fetch(`${API_BASE_URL}/Cart/${currentUserId}/${gameId}`, {
      method: "DELETE",
    });
    
    if (response.ok) {
      setCartItems(prev => prev.filter(i => i.id !== gameId));
    }
  } catch (error) {
    console.error("Delete error:", error);
  }
};

  if (isLoading) return <div style={{ color: "#fff", textAlign: "center", padding: 50 }}>Loading...</div>;

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div className="content">
          {page === "cart" && (
            <CartPage 
              cartItems={cartItems} 
              onRemoveFromCart={removeFromCart} 
              onCheckout={() => setPage("payment")} 
            />
          )}
          {page === "payment" && (
            <PaymentPage 
              cartItems={cartItems} 
              onPlaceOrder={() => { setCartItems([]); setPage("thankyou"); }} 
              onBackToCart={() => setPage("cart")} 
            />
          )}
          {page === "thankyou" && <ThankYouPage onBrowseShop={() => setPage("cart")} />}
        </div>
      </div>
    </>
  );
}