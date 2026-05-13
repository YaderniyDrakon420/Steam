import { createContext, useState, type ReactNode } from "react";

// 1. Опис інтерфейсу контексту
interface AuthContextType {
  isAuthenticated: boolean;
  userId: number | null;
  login: (id: number) => void;
  logout: () => void;
}

// 2. Створення самого контексту
export const AuthContext = createContext<AuthContextType | null>(null);

// 3. Провайдер, який керує станом
export function AuthProvider({ children }: { children: ReactNode }) {
  // Намагаємося дістати ID з localStorage відразу при завантаженні
  const savedId = localStorage.getItem("userId");
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!savedId);
  const [userId, setUserId] = useState<number | null>(savedId ? parseInt(savedId) : null);

  const login = (id: number) => {
    setUserId(id);
    setIsAuthenticated(true);
    localStorage.setItem("userId", id.toString()); 
  };

  const logout = () => {
    setUserId(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}