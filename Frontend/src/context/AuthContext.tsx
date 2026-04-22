import { createContext, useState, type ReactNode } from "react";

// 1. Описание интерфейса контекста
interface AuthContextType {
  isAuthenticated: boolean;
  userId: number | null;
  login: (id: number) => void;
  logout: () => void;
}

// 2. Создание самого контекста
export const AuthContext = createContext<AuthContextType | null>(null);

// 3. Провайдер, который управляет состоянием
export function AuthProvider({ children }: { children: ReactNode }) {
  // Пытаемся достать ID из localStorage сразу при загрузке, чтобы не вылетало при F5
  const savedId = localStorage.getItem("userId");
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!savedId);
  const [userId, setUserId] = useState<number | null>(savedId ? parseInt(savedId) : null);

  const login = (id: number) => {
    setUserId(id);
    setIsAuthenticated(true);
    // В JS метод пишется с маленькой буквы: toString()
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